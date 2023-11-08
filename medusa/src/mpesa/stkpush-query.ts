import axios, { AxiosResponse } from "axios";
import { Config, generatePassword, timeStamp } from "./utils";

function initStkPushQueryRequestBody(
  businessShortCode: string,
  password: string,
  timeStamp: string,
  CheckoutRequestID: string
): Record<string, string> {
  return {
    BusinessShortCode: businessShortCode,
    Password: password,
    Timestamp: timeStamp,
    CheckoutRequestID: CheckoutRequestID,
  };
}

export default async function StkPushQuery(
  businessShortCode: string,
  passkey: string,
  accessToken: string,
  environment: string,
  CheckoutRequestID: string
): Promise<any> {
  const password = generatePassword(businessShortCode, passkey);
  const requestBody = initStkPushQueryRequestBody(
    businessShortCode,
    password,
    timeStamp,
    CheckoutRequestID
  );
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${environment}/mpesa/stkpushquery/v1/query`,
      requestBody,
      await Config(accessToken)
    );
    return response.data;
  } catch (error) {
    return null;
  }
}
