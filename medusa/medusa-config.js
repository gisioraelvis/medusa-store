const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-store";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
  // {
  //   resolve: "@medusajs/payment-m-pesa",
  //   options: {
  //     consumerKey: process.env.MPESA_CONSUMER_KEY,
  //     consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  //     businessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
  //     passkey: process.env.MPESA_PASSKEY,
  //     partyA: process.env.MPESA_PARTY_A,
  //     b2cSecurityCredential: process.env.MPESA_B2C_SECURITY_CREDENTIAL,
  //     initiatorName: process.env.MPESA_INITIATOR_NAME,
  //     callbackUrl: process.env.MPESA_CALLBACK_URL,
  //     environment: process.env.MPESA_ENVIRONMENT,
  //     transactionType: process.env.MPESA_TRANSACTION_TYPE,
  //   },
  // },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL,
    },
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL,
    },
  },
};

const MPESA_ENVS = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  businessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  partyA: process.env.MPESA_PARTY_A,
  b2cSecurityCredential: process.env.MPESA_B2C_SECURITY_CREDENTIAL,
  initiatorName: process.env.MPESA_INITIATOR_NAME,
  callbackUrl: process.env.MPESA_CALLBACK_URL,
  environment: process.env.MPESA_ENVIRONMENT,
  transactionType: process.env.MPESA_TRANSACTION_TYPE,
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  redis_url: REDIS_URL,
  mpesa_envs: MPESA_ENVS,
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
