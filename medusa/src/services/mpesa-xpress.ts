import {
  AbstractPaymentProcessor,
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  PaymentSessionStatus,
  isPaymentProcessorError,
} from "@medusajs/medusa";
import { EOL } from "os";
import Mpesa, { TMpesaOptions } from "../mpesa";
import {
  FormatPaymentData,
  PaymentData,
  PaymentRequestData,
} from "../mpesa/payment-data";
import generateUniqueReferenceNumber from "../mpesa/utils";

type TProjectConfig = {
  projectConfig: {
    mpesa_envs: TMpesaOptions;
  };
};

class MPesaXpressPaymentProcessor extends AbstractPaymentProcessor {
  static identifier = "mpesa";

  protected mpesa_: Mpesa;
  protected readonly options_: TProjectConfig;

  constructor(container, options) {
    super(container);
    this.options_ = options;
    this.init();
  }

  protected init(): void {
    this.mpesa_ = new Mpesa({
      ...this.options_.projectConfig.mpesa_envs,
    });
  }

  async initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    const {
      email,
      context: cart_context,
      currency_code,
      amount,
      resource_id,
      customer,
    } = context;

    const phoneNumber = (customer?.metadata?.mpesa_phone_number ??
      "254705640212") as string;
    const accountReference = generateUniqueReferenceNumber("Medusa");
    const transactionDesc = (cart_context.payment_description ??
      "Medusa M-Pesa Xpress") as string;

    let session_data;
    try {
      let payment = (await this.mpesa_.stkPush({
        amount: amount.toString(),
        phoneNumber: phoneNumber,
        accountReference: accountReference,
        transactionDesc: transactionDesc,
      })) as PaymentRequestData;

      session_data = payment;
    } catch (error) {
      console.log(error);
      return this.buildError(
        "An error occurred while initiating the M-Pesa Xpress payment session",
        error
      );
    }

    return {
      session_data,
      update_requests:
        customer?.metadata?.mpesa_phone_number ?? email
          ? undefined
          : {
              customer_metadata: {
                mpesa_phone_number: phoneNumber,
              },
            },
    };
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    const id = paymentSessionData.id as string;
    const paymentIntent = await this.mpesa_.transactionStatus(id);

    switch (paymentIntent.status) {
      case "requires_payment_method":
      case "requires_confirmation":
      case "processing":
        return PaymentSessionStatus.PENDING;
      case "requires_action":
        return PaymentSessionStatus.REQUIRES_MORE;
      case "canceled":
        return PaymentSessionStatus.CANCELED;
      case "requires_capture":
      case "succeeded":
        return PaymentSessionStatus.AUTHORIZED;
      default:
        // return PaymentSessionStatus.PENDING;
        return PaymentSessionStatus.AUTHORIZED;
    }
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProcessorError
    | {
        status: PaymentSessionStatus;
        data: Record<string, unknown>;
      }
  > {
    const status = await this.getPaymentStatus(paymentSessionData);
    return { data: paymentSessionData, status };
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }

  async updatePayment(
    context: PaymentProcessorContext
  ): Promise<void | PaymentProcessorError | PaymentProcessorSessionResponse> {
    throw new Error("Method not implemented.");
  }

  updatePaymentData(
    sessionId: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }

  protected buildError(
    message: string,
    e: PaymentProcessorError | Error
  ): PaymentProcessorError {
    return {
      error: message,
      code: "code" in e ? e.code : "",
      detail: isPaymentProcessorError(e)
        ? `${e.error}${EOL}${e.detail ?? ""}`
        : "detail" in e
        ? e.detail
        : e.message ?? "",
    };
  }
}

export default MPesaXpressPaymentProcessor;
