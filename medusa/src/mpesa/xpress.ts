import { MedusaError } from "@medusajs/utils";
import axios, { AxiosResponse } from "axios";
import { generatePassword, Config, timeStamp } from "./utils";

function initMpesaExpressRequestBody(
  amount: string,
  phoneNumber: string,
  callbackUrl: string,
  timeStamp: string,
  password: string,
  businessShortCode: string,
  accountReference: string,
  transactionDesc: string,
  transactionType: string
): Record<string, string> {
  const TrnsType =
    transactionType === "paybill"
      ? "CustomerPayBillOnline"
      : "CustomerBuyGoodsOnline";

  return {
    BusinessShortCode: businessShortCode,
    Password: password,
    Timestamp: timeStamp,
    TransactionType: TrnsType,
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: businessShortCode,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackUrl,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  };
}

export default async function MpesaExpress(
  amount: string,
  phoneNumber: string,
  accessToken: string,
  accountReference: string,
  transactionDesc: string,
  callbackUrl: string,
  businessShortCode: string,
  passkey: string,
  environment: string,
  transactionType: string
): Promise<any> {
  const password = generatePassword(businessShortCode, passkey);
  const requestBody = initMpesaExpressRequestBody(
    amount,
    phoneNumber,
    callbackUrl,
    timeStamp,
    password,
    businessShortCode,
    accountReference,
    transactionDesc,
    transactionType
  );

  try {
    const response: AxiosResponse<any> = await axios.post(
      `${environment}/mpesa/stkpush/v1/processrequest`,
      requestBody,
      await Config(accessToken)
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw new MedusaError(
      MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
      "Error initiating M-Pesa Xpress payment"
    );
  }
}
