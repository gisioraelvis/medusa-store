/* 

[0]   data: {
[0]     MerchantRequestID: '38109-85593845-1',
[0]     CheckoutRequestID: 'ws_CO_08112023170111795705640212',
[0]     ResponseCode: '0',
[0]     ResponseDescription: 'Success. Request accepted for processing',
[0]     CustomerMessage: 'Success. Request accepted for processing'
[0]   }
*/

export interface PaymentRequestData {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface CallbackMetadataItem {
  Name: string;
  Value: string;
}

export interface PaymentData {
  Body: {
    stkCallback: {
      ResultCode: number;
      CallbackMetadata: {
        Item: CallbackMetadataItem[];
      };
    };
  };
}

interface PaymentInfo {
  Amount: string;
  MpesaReceiptNumber: string;
  TransactionDate: string;
  PhoneNumber: string;
}

export interface PaymentResult {
  status: "canceled" | "failed" | "success";
  data?: PaymentInfo;
  message?: string;
  resultCode?: number;
}

export function FormatPaymentData(data: PaymentData): PaymentResult {
  function extractData(data: PaymentData): PaymentInfo {
    const { Amount, MpesaReceiptNumber, TransactionDate, PhoneNumber } =
      data.Body.stkCallback.CallbackMetadata.Item.reduce((acc, item) => {
        acc[item.Name as keyof PaymentInfo] = item.Value;
        return acc;
      }, {} as PaymentInfo);

    return { Amount, MpesaReceiptNumber, TransactionDate, PhoneNumber };
  }

  const resultscode = data.Body.stkCallback.ResultCode;

  if (data && resultscode === 0) {
    const paymentinfo = extractData(data);
    return {
      status: "success",
      message: "Transaction processed successfully",
      data: {
        Amount: paymentinfo.Amount,
        MpesaReceiptNumber: paymentinfo.MpesaReceiptNumber,
        PhoneNumber: paymentinfo.PhoneNumber,
        TransactionDate: paymentinfo.TransactionDate,
      },
      resultCode: resultscode,
    };
  } else {
    if (data && resultscode === 17) {
      return {
        status: "failed",
        message: "Unable to process the transaction",
        resultCode: resultscode,
      };
    } else {
      return {
        status: "canceled",
        message: "Transaction was canceled by the user",
        resultCode: resultscode,
      };
    }
  }
}
