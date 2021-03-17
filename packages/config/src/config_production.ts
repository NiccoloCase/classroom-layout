import { IConfiguration } from "./config.type";

export const productionKeys: IConfiguration = {
  APP_NAME: "Classroom layout",
  isProduction: true,
  server: {
    PORT: Number(process.env.PORT!),
    WEB_APP_DOMAIN: process.env.WEB_APP_DOMAIN!,
  },
  database: {
    URI: process.env.MONGO_URI!,
  },
  emailService: {
    SENDER: process.env.EMAIL_SENDER!,
    USER: process.env.EMAIL_USER!,
    PASSWORD: process.env.EMAIL_PASSWORD!,
  },
};
