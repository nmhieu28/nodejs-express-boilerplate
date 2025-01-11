import path from "path";
import fs from "fs";
import yaml from "yaml";
const env: string = process.env.NODE_ENV || "development";
var configFilePath = path.join(__dirname, `${env}.config.yml`);

interface Config {
  service: {
    port: number;
    name: string;
    maxUploadLimit: string;
    maxParameterLimit: string;
  };
  cors: {
    enable: boolean;
    allows: string[];
  };
  databases: {
    postgresql: {
      host: string;
      database: string;
      userName: string;
      password: string;
      port: number;
    };
  };
  storage: {
    s3: {
      region: string;
      endpoint: string;
      accessKeyId: string;
      accessKeySecret: string;
      bucket: string;
    };
  };
  redis: {
    host: string;
    port: number;
    userName: string;
    password: string;
  };
  smtp: {
    userName: string;
    password: string;
    service: string;
  };
  internalUrl: {
    client: string;
  };
  jwt: {
    secretKey: string;
    tokenExpire: number;
    refreshTokenExpire: number;
    audience: string;
    issuer: string;
    refreshSecretKey: string;
  };
}

function loadConfig() {
  try {
    const fileContent = fs.readFileSync(configFilePath, "utf8");
    return yaml.parse(fileContent) as Config;
  } catch (error) {
    console.error("Error loading config file:", error);
    throw error;
  }
}

export const appSettings = loadConfig();
