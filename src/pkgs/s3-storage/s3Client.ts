import { S3Client } from "@aws-sdk/client-s3";
import { appSettings } from "../../configs/config";
const s3Config = appSettings.storage.s3;
const s3Client = new S3Client({
  region: s3Config.region,
  endpoint: s3Config.endpoint,
  credentials: {
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.accessKeySecret,
  },
  forcePathStyle: true,
});
export default s3Client;
