import axios, { AxiosResponse } from "axios";
import { Config } from "./utils";

function initTransactionStatusRequestBody(
  transactionId: string,
  b2cSecurityCredential: string,
  callbackUrl: string,
  initiator: string,
  partyA: string
): Record<string, any> {
  return {
    Initiator: initiator,
    SecurityCredential: b2cSecurityCredential,
    CommandID: "TransactionStatusQuery",
    TransactionID: transactionId,
    PartyA: partyA,
    IdentifierType: "4",
    ResultURL: callbackUrl,
    QueueTimeOutURL: callbackUrl,
    Remarks: "done",
    Occasion: "OK",
  };
}

//check status of the initiated stkpush, #payed, #canceled, # successfull
export default async function checkTransactionStatus(
  transactionId: string,
  callbackUrl: string,
  initiator: string,
  accessToken: string,
  b2cSecurityCredential: string,
  partyA: string,
  environment: string
): Promise<any> {
  const requestBody = initTransactionStatusRequestBody(
    transactionId,
    b2cSecurityCredential,
    callbackUrl,
    initiator,
    partyA
  );

  try {
    const response: AxiosResponse<any> = await axios.post(
      `${environment}/mpesa/transactionstatus/v1/query`,
      requestBody,
      await Config(accessToken)
    );
    return response.data;
  } catch (error) {
    return null;
  }
}
