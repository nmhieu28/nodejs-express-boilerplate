import { createClient, RedisClientType } from "redis";

export interface RedisConfig {
  host: string;
  port: number;
  userName: string;
  password: string;
}
export class RedisClient {
  private client: RedisClientType;

  constructor(config: RedisConfig, databaseNumber: number = 0) {
    const { host, port, userName, password } = config;
    const url = `redis://${host}:${port}/${databaseNumber}`;
    this.client = createClient({
      url,
      username: userName,
      password,
    });

    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    // process.on("SIGINT", async () => {
    //   await this.disconnect();
    //   process.exit(0);
    // });
  }

  async connect() {
    await this.client.connect();
  }

  async selectDatabase(db: number) {
    await this.client.select(db);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl: number = 3600) {
    await this.client.setEx(key, ttl, value);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async disconnect() {
    await this.client.quit();
    console.log("Disconnected from Redis");
  }
}
