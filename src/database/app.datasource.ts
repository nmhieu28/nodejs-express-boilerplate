import { DataSource } from "typeorm";
import { appSettings } from "../configs/config";
const dbConfig = appSettings.databases["postgresql"];
export const appDataSource = new DataSource({
  type: "postgres",
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.userName,
  password: dbConfig.password,
  database: dbConfig.database,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  connectTimeoutMS: 60000,
  synchronize: false,
  migrations: ["src/database/migrations/*.ts"],
  metadataTableName: "migrations",
});
export default appDataSource;
