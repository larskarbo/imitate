require("dotenv").config();

export const getEnv = (key: string): string => {
  const envVar = process.env[key];
  if (typeof envVar != "string" || envVar?.length == 0) {
    throw new Error(`Please set env ${key}`);
  }
  return envVar;
};
