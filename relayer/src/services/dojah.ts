import axios from 'axios';

const DOJAH_API_KEY = process.env.DOJAH_API_KEY || '';
const DOJAH_APP_ID = process.env.DOJAH_APP_ID || '';
const DOJAH_BASE_URL = 'https://api.dojah.io';

export interface KYCVerificationResponse {
  status: string;
  message: string;
  data: {
    first_name: string;
    last_name: string;
    middle_name?: string;
    dob: string;
    gender: string;
    phone: string;
    email?: string;
    bvn: string;
    nin?: string;
    address?: string;
    lga?: string;
    state?: string;
    country: string;
    photo?: string;
    signature?: string;
  };
}

export interface BVNVerificationParams {
  bvn: string;
}

export interface NINVerificationParams {
  nin: string;
}

export class DojahService {
  private headers: Record<string, string>;

  constructor() {
    this.headers = {
      Authorization: DOJAH_API_KEY,
      AppId: DOJAH_APP_ID,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Verify BVN (Bank Verification Number)
   */
  async verifyBVN(params: BVNVerificationParams): Promise<KYCVerificationResponse> {
    try {
      const response = await axios.get(
        `${DOJAH_BASE_URL}/api/v1/biometrics/verify/bvn`,
        {
          headers: this.headers,
          params: { bvn: params.bvn },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dojah BVN verification error:', error.response?.data || error.message);
      throw new Error(`Failed to verify BVN: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Verify NIN (National Identity Number)
   */
  async verifyNIN(params: NINVerificationParams): Promise<KYCVerificationResponse> {
    try {
      const response = await axios.get(
        `${DOJAH_BASE_URL}/api/v1/biometrics/verify/nin`,
        {
          headers: this.headers,
          params: { nin: params.nin },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dojah NIN verification error:', error.response?.data || error.message);
      throw new Error(`Failed to verify NIN: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get BVN details
   */
  async getBVNDetails(bvn: string): Promise<KYCVerificationResponse> {
    try {
      const response = await axios.get(
        `${DOJAH_BASE_URL}/api/v1/biometrics/verify/bvn`,
        {
          headers: this.headers,
          params: { bvn },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dojah BVN details error:', error.response?.data || error.message);
      throw new Error(`Failed to get BVN details: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get NIN details
   */
  async getNINDetails(nin: string): Promise<KYCVerificationResponse> {
    try {
      const response = await axios.get(
        `${DOJAH_BASE_URL}/api/v1/biometrics/verify/nin`,
        {
          headers: this.headers,
          params: { nin },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dojah NIN details error:', error.response?.data || error.message);
      throw new Error(`Failed to get NIN details: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Perform face verification
   */
  async verifyFace(image: string, referenceId: string): Promise<any> {
    try {
      const response = await axios.post(
        `${DOJAH_BASE_URL}/api/v1/biometrics/verify/face`,
        {
          image,
          reference_id: referenceId,
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dojah face verification error:', error.response?.data || error.message);
      throw new Error(`Failed to verify face: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Verify phone number
   */
  async verifyPhone(phone: string): Promise<any> {
    try {
      const response = await axios.get(
        `${DOJAH_BASE_URL}/api/v1/sandbox/verification/phone`,
        {
          headers: this.headers,
          params: { phone },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dojah phone verification error:', error.response?.data || error.message);
      throw new Error(`Failed to verify phone: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get credit bureau report
   */
  async getCreditReport(bvn: string): Promise<any> {
    try {
      const response = await axios.get(
        `${DOJAH_BASE_URL}/api/v1/credit/bureau`,
        {
          headers: this.headers,
          params: { bvn },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dojah credit report error:', error.response?.data || error.message);
      throw new Error(`Failed to get credit report: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create a KYC verification request
   */
  async createKYCRequest(params: {
    first_name: string;
    last_name: string;
    dob: string;
    phone: string;
    bvn?: string;
    nin?: string;
  }): Promise<any> {
    try {
      const response = await axios.post(
        `${DOJAH_BASE_URL}/api/v1/kyc/verify`,
        params,
        { headers: this.headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dojah KYC request error:', error.response?.data || error.message);
      throw new Error(`Failed to create KYC request: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get KYC request status
   */
  async getKYCStatus(requestId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${DOJAH_BASE_URL}/api/v1/kyc/status/${requestId}`,
        { headers: this.headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dojah KYC status error:', error.response?.data || error.message);
      throw new Error(`Failed to get KYC status: ${error.response?.data?.message || error.message}`);
    }
  }
}

export const dojahService = new DojahService();
