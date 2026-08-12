import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface PaystackTransactionResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    amount: number;
    status: string;
    paid_at?: string;
    channel?: string;
    currency: string;
    customer?: {
      email: string;
      first_name: string;
      last_name: string;
    };
    authorization_url?: string;
    subaccount_code?: string;
    transfer_code?: string;
    recipient_code?: string;
  };
}

export interface InitializePaymentParams {
  email: string;
  amount: number; // in kobo (NGN * 100)
  reference: string;
  metadata?: Record<string, any>;
}

export interface VerifyPaymentParams {
  reference: string;
}

export class PaystackService {
  private headers: Record<string, string>;

  constructor() {
    this.headers = {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Initialize a payment transaction
   */
  async initializePayment(params: InitializePaymentParams): Promise<PaystackTransactionResponse> {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email: params.email,
          amount: params.amount,
          reference: params.reference,
          metadata: params.metadata,
          channels: ['card', 'bank_transfer', 'ussd', 'qr'],
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack initialization error:', error.response?.data || error.message);
      throw new Error(`Failed to initialize payment: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(params: VerifyPaymentParams): Promise<PaystackTransactionResponse> {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${params.reference}`,
        { headers: this.headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack verification error:', error.response?.data || error.message);
      throw new Error(`Failed to verify payment: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create a subaccount for landlords to receive payments
   */
  async createSubaccount(params: {
    business_name: string;
    settlement_bank: string;
    account_number: string;
    percentage_charge: number;
  }) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/subaccount`,
        {
          business_name: params.business_name,
          settlement_bank: params.settlement_bank,
          account_number: params.account_number,
          percentage_charge: params.percentage_charge,
          primary_contact_email: process.env.PLATFORM_EMAIL,
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack subaccount creation error:', error.response?.data || error.message);
      throw new Error(`Failed to create subaccount: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get bank list for Nigeria
   */
  async getBanks(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/bank`,
        { 
          headers: this.headers,
          params: { country: 'nigeria' }
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Paystack banks fetch error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch banks: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Resolve account number to bank details
   */
  async resolveAccountNumber(accountNumber: string, bankCode: string): Promise<any> {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/bank/resolve`,
        {
          headers: this.headers,
          params: {
            account_number: accountNumber,
            bank_code: bankCode,
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Paystack account resolution error:', error.response?.data || error.message);
      throw new Error(`Failed to resolve account: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Transfer funds to landlord's bank account
   */
  async initiateTransfer(params: {
    amount: number; // in kobo
    recipient: string; // recipient code
    reference: string;
    reason?: string;
  }) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transfer`,
        {
          source: 'balance',
          amount: params.amount,
          recipient: params.recipient,
          reference: params.reference,
          reason: params.reason || 'Rent payment',
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack transfer error:', error.response?.data || error.message);
      throw new Error(`Failed to initiate transfer: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create a transfer recipient
   */
  async createTransferRecipient(params: {
    type: string;
    name: string;
    account_number: string;
    bank_code: string;
    currency?: string;
  }) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transferrecipient`,
        {
          type: params.type,
          name: params.name,
          account_number: params.account_number,
          bank_code: params.bank_code,
          currency: params.currency || 'NGN',
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack recipient creation error:', error.response?.data || error.message);
      throw new Error(`Failed to create transfer recipient: ${error.response?.data?.message || error.message}`);
    }
  }
}

export const paystackService = new PaystackService();
