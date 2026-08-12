/**
 * Stellar Wallet Integration using Freighter
 * Provides wallet connection, signing, and transaction submission
 */

export interface WalletInfo {
  publicKey: string;
  isConnected: boolean;
  network: 'testnet' | 'public';
}

export interface SignedTransaction {
  signedXdr: string;
  signerPublicKey: string;
}

export interface TransactionResult {
  status: 'success' | 'error';
  hash?: string;
  error?: string;
}

class StellarWallet {
  private isConnected = false;
  private publicKey = '';
  private network: 'testnet' | 'public' = 'testnet';

  /**
   * Check if Freighter wallet is installed
   */
  isAvailable(): boolean {
    return !!(window as any).freighter;
  }

  /**
   * Connect to Freighter wallet
   */
  async connect(): Promise<WalletInfo> {
    if (!this.isAvailable()) {
      throw new Error('Freighter wallet is not installed. Please install it from https://freighter.app');
    }

    try {
      const freighter = (window as any).freighter;
      
      // Request access to public key
      const publicKey = await freighter.getPublicKey();
      
      if (!publicKey) {
        throw new Error('Failed to get public key from wallet');
      }

      this.publicKey = publicKey;
      this.isConnected = true;

      // Determine network (Freighter defaults to testnet for development)
      this.network = 'testnet';

      return {
        publicKey: this.publicKey,
        isConnected: this.isConnected,
        network: this.network,
      };
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw new Error('Failed to connect to wallet');
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.isConnected = false;
    this.publicKey = '';
  }

  /**
   * Get current wallet info
   */
  getWalletInfo(): WalletInfo {
    return {
      publicKey: this.publicKey,
      isConnected: this.isConnected,
      network: this.network,
    };
  }

  /**
   * Sign a transaction with Freighter
   */
  async signTransaction(xdr: string): Promise<SignedTransaction> {
    if (!this.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const freighter = (window as any).freighter;
      const signedXdr = await freighter.signXDR(xdr);

      return {
        signedXdr,
        signerPublicKey: this.publicKey,
      };
    } catch (error) {
      console.error('Transaction signing error:', error);
      throw new Error('Failed to sign transaction');
    }
  }

  /**
   * Sign and submit a transaction
   */
  async signAndSubmitTransaction(xdr: string): Promise<TransactionResult> {
    try {
      const { signedXdr } = await this.signTransaction(xdr);
      
      // Submit to Stellar network
      const result = await this.submitTransaction(signedXdr);
      
      return result;
    } catch (error) {
      console.error('Sign and submit error:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Submit a signed transaction to the Stellar network
   */
  async submitTransaction(signedXdr: string): Promise<TransactionResult> {
    try {
      const horizonUrl = this.network === 'testnet'
        ? 'https://horizon-testnet.stellar.org'
        : 'https://horizon.stellar.org';

      const response = await fetch(`${horizonUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `tx=${encodeURIComponent(signedXdr)}`,
      });

      const data = await response.json();

      if (response.ok) {
        return {
          status: 'success',
          hash: data.hash,
        };
      } else {
        return {
          status: 'error',
          error: data.extras?.result_codes?.transaction || 'Transaction failed',
        };
      }
    } catch (error) {
      console.error('Transaction submission error:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to submit transaction',
      };
    }
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<string> {
    if (!this.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const horizonUrl = this.network === 'testnet'
        ? 'https://horizon-testnet.stellar.org'
        : 'https://horizon.stellar.org';

      const response = await fetch(`${horizonUrl}/accounts/${this.publicKey}`);
      const data = await response.json();

      // Find XLM balance (native asset)
      const balance = data.balances?.find((b: any) => b.asset_type === 'native');
      return balance?.balance || '0';
    } catch (error) {
      console.error('Balance fetch error:', error);
      throw new Error('Failed to fetch balance');
    }
  }

  /**
   * Get account details
   */
  async getAccountDetails(): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const horizonUrl = this.network === 'testnet'
        ? 'https://horizon-testnet.stellar.org'
        : 'https://horizon.stellar.org';

      const response = await fetch(`${horizonUrl}/accounts/${this.publicKey}`);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Account details fetch error:', error);
      throw new Error('Failed to fetch account details');
    }
  }

  /**
   * Switch network (testnet <-> public)
   */
  async switchNetwork(network: 'testnet' | 'public'): Promise<void> {
    try {
      const freighter = (window as any).freighter;
      
      // Freighter allows network switching
      await freighter.setNetwork(network);
      
      this.network = network;
    } catch (error) {
      console.error('Network switch error:', error);
      throw new Error('Failed to switch network');
    }
  }
}

// Export singleton instance
export const stellarWallet = new StellarWallet();

// TypeScript declaration for Freighter
declare global {
  interface Window {
    freighter?: {
      getPublicKey(): Promise<string>;
      signXDR(xdr: string): Promise<string>;
      setNetwork(network: 'testnet' | 'public'): Promise<void>;
      isConnected(): Promise<boolean>;
    };
  }
}
