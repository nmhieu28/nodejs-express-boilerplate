import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import s3Client from "./s3Client";

class WasabiStorageService {
  private s3: S3Client;

  constructor() {
    this.s3 = s3Client;
  }

  async uploadFile(bucketName: string, fileKey: string, fileContent: Buffer) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: fileContent,
    });

    return this.s3.send(command);
  }

  async deleteFile(bucketName: string, fileKey: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    return this.s3.send(command);
  }

  async listFiles(bucketName: string, prefix: string) {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });

    return this.s3.send(command);
  }

  async downloadFile(bucketName: string, fileKey: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    const response = await this.s3.send(command);
    return response.Body as Readable;
  }
}

export default WasabiStorageService;
