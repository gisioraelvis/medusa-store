import generateAccessToken from "./auth";
import StkPushQuery from "./stkpush-query";
import checkTransactionStatus from "./transaction-status";
import MpesaExpress from "./xpress";

type TStkPush = {
  amount: string;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
};

export type TMpesaOptions = {
  consumerKey: string;
  consumerSecret: string;
  businessShortCode: string;
  passkey: string;
  partyA: string;
  b2cSecurityCredential: string;
  initiatorName: string;
  callbackUrl: string;
  environment: "sandbox" | "live";
  transactionType: "paybill" | "till";
};

class Mpesa {
  private consumerKey: string;
  private consumerSecret: string;
  private businessShortCode: string;
  private passkey: string;
  private partyA: string;
  private environment: string;
  private callbackUrl: string;
  private b2cSecurityCredential: string;
  private initiatorName: string;
  private transactionType: string;

  constructor(options: TMpesaOptions) {
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
    this.businessShortCode = options.businessShortCode;
    this.passkey = options.passkey;
    this.partyA = options.partyA;
    this.b2cSecurityCredential = options.b2cSecurityCredential;
    this.initiatorName = options.initiatorName;
    this.environment =
      options.environment === "live"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";
    this.transactionType = options.transactionType;
    this.callbackUrl = options.callbackUrl;
  }

  //stkpush method for directly initiating a pop to the specified phonenumber with the amount to payed
  //accesstoken

  async AccessToken() {
    return await generateAccessToken(
      this.consumerKey,
      this.consumerSecret,
      this.environment
    );
  }

  public async stkPush({
    amount,
    phoneNumber,
    accountReference,
    transactionDesc,
  }: TStkPush): Promise<any> {
    const accessToken = await this.AccessToken();
    return await MpesaExpress(
      amount,
      phoneNumber,
      accessToken,
      accountReference,
      transactionDesc,
      this.callbackUrl,
      this.businessShortCode,
      this.passkey,
      this.environment,
      this.transactionType
    );
  }

  public async stkPushQuery(CheckoutRequestID: string): Promise<any> {
    const accessToken = await this.AccessToken();
    return await StkPushQuery(
      this.businessShortCode,
      this.passkey,
      accessToken,
      this.environment,
      CheckoutRequestID
    );
  }

  public async transactionStatus(transactionId: string): Promise<any> {
    const accessToken = await this.AccessToken();
    return await checkTransactionStatus(
      transactionId,
      this.callbackUrl,
      this.initiatorName,
      accessToken,
      this.b2cSecurityCredential,
      this.partyA,
      this.environment
    );
  }
}

export default Mpesa;
