import {
  Keypair,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  Contract,
  SorobanRpc,
  nativeToScVal,
  Address,
  scValToNative,
} from "@stellar/stellar-sdk";

const NETWORK = process.env.STELLAR_NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
const RPC_URL =
  process.env.STELLAR_RPC_URL ||
  "https://soroban-testnet.stellar.org";

const LEASE_CONTRACT_ID = process.env.LEASE_CONTRACT_ID || "";
const PLATFORM_SECRET = process.env.PLATFORM_SECRET_KEY || "";

export class StellarService {
  private server: SorobanRpc.Server;
  private platformKeypair: Keypair;

  constructor() {
    this.server = new SorobanRpc.Server(RPC_URL, { allowHttp: RPC_URL.startsWith("http://") });
    this.platformKeypair = Keypair.fromSecret(PLATFORM_SECRET);
  }

  /** Create a Stellar wallet for a new user (custodial for MVP) */
  async createWallet(): Promise<{ publicKey: string; secret: string }> {
    const kp = Keypair.random();
    // Fund on testnet via Friendbot
    if (NETWORK === Networks.TESTNET) {
      await fetch(`https://friendbot.stellar.org?addr=${kp.publicKey()}`);
    }
    return { publicKey: kp.publicKey(), secret: kp.secret() };
  }

  /** Invoke create_lease on the Soroban contract */
  async createLease(params: {
    landlordAddress: string;
    tenantSecret: string;
    propertyId: string;
    monthlyRentUsdc: number;
    securityDepositUsdc: number;
    durationMonths: number;
  }) {
    const tenantKp = Keypair.fromSecret(params.tenantSecret);
    const account = await this.server.getAccount(tenantKp.publicKey());
    const contract = new Contract(LEASE_CONTRACT_ID);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK,
    })
      .addOperation(
        contract.call(
          "create_lease",
          new Address(params.landlordAddress).toScVal(),
          new Address(tenantKp.publicKey()).toScVal(),
          nativeToScVal(params.propertyId, { type: "symbol" }),
          nativeToScVal(BigInt(params.monthlyRentUsdc), { type: "i128" }),
          nativeToScVal(BigInt(params.securityDepositUsdc), { type: "i128" }),
          nativeToScVal(params.durationMonths, { type: "u32" }),
        )
      )
      .setTimeout(30)
      .build();

    const preparedTx = await this.server.prepareTransaction(tx);
    preparedTx.sign(tenantKp);

    const result = await this.server.sendTransaction(preparedTx);
    return result;
  }

  /** Pay monthly rent */
  async payRent(params: {
    propertyId: string;
    tenantSecret: string;
  }) {
    const tenantKp = Keypair.fromSecret(params.tenantSecret);
    const account = await this.server.getAccount(tenantKp.publicKey());
    const contract = new Contract(LEASE_CONTRACT_ID);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK,
    })
      .addOperation(
        contract.call(
          "pay_rent",
          nativeToScVal(params.propertyId, { type: "symbol" }),
          new Address(tenantKp.publicKey()).toScVal(),
        )
      )
      .setTimeout(30)
      .build();

    const preparedTx = await this.server.prepareTransaction(tx);
    preparedTx.sign(tenantKp);
    return this.server.sendTransaction(preparedTx);
  }

  /** Fetch lease data from chain */
  async getLease(propertyId: string) {
    const contract = new Contract(LEASE_CONTRACT_ID);
    const account = await this.server.getAccount(this.platformKeypair.publicKey());

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK,
    })
      .addOperation(
        contract.call("get_lease", nativeToScVal(propertyId, { type: "symbol" }))
      )
      .setTimeout(30)
      .build();

    const sim = await this.server.simulateTransaction(tx);
    if (SorobanRpc.Api.isSimulationSuccess(sim) && sim.result) {
      return scValToNative(sim.result.retval);
    }
    return null;
  }
}

export const stellarService = new StellarService();
