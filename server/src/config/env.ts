import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3000),

  nodeEnv:
    process.env.NODE_ENV ||
    "development",

  clientUrl:
    process.env.CLIENT_URL ||
    "http://127.0.0.1:5173",

  appName:
    process.env.APP_NAME ||
    "Tantsaha_miombona",

  databasePath:
    process.env.DATABASE_PATH ||
    "./data/tantsaha_miombona.db",

  jwtSecret:
    process.env.JWT_SECRET ||
    "CHANGE_ME",

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN ||
    "8h"
};
