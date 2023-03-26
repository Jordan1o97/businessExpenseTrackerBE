import axios, { AxiosError, AxiosResponse } from 'axios';

const productionURL = 'https://buy.itunes.apple.com/verifyReceipt';
const sandboxURL = 'https://sandbox.itunes.apple.com/verifyReceipt';

interface ReceiptData {
  'receipt-data': string;
  password: string;
}

interface ReceiptValidationResponse {
  success: boolean;
  expiryDate?: string;
}

async function validateReceipt(receiptData: string): Promise<ReceiptValidationResponse> {
  const requestData: ReceiptData = {
    'receipt-data': receiptData,
    'password': '9c7f98ac31ed48d0bae214142f94d3bd', // Replace with your app's shared secret
  };

  let response: AxiosResponse<any> = await axios.post(productionURL, requestData).catch(async (error: AxiosError) => {
    if (error.response && error.response.status === 21007) {
      // Sandbox receipt used in production, validate against the sandbox environment
      return await axios.post(sandboxURL, requestData);
    } else {
      throw error;
    }
  });

  if (response.data.status === 0) {
    const receipt = response.data.receipt;

    // Extract relevant data, such as the subscription expiry date
    // This example assumes only one in-app purchase
    const expiryDateMs = receipt.in_app[0].expires_date_ms;
    const expiryDate = new Date(Number(expiryDateMs)).toISOString();

    return { success: true, expiryDate: expiryDate };
  } else {
    return { success: false };
  }
}

export { validateReceipt };