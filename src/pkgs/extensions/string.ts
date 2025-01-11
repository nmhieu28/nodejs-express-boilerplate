import { v4 as uuidv4 } from "uuid";

export class StringExtension {
  static generateShortUuid(): string {
    const uuid = uuidv4();
    const hex = uuid.replace(/-/g, "");
    const buffer = Buffer.from(hex, "hex");
    let base64Uuid = buffer.toString("base64");
    base64Uuid = base64Uuid.replace(/=/g, "");
    base64Uuid = base64Uuid.replace(/\+/g, "-").replace(/\//g, "_");
    return base64Uuid;
  }
  static formatErrorCode(enumName: string, errorValue: number): string {
    const words = enumName.match(/[A-Z][a-z]*/g) || [];
    const prefix = words
      .slice(0, 3)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    return `${prefix}-${errorValue}`;
  }
}
