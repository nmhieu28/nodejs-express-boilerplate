import bcrypt from "bcryptjs";

async function hash(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}
async function verify(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export const HashPassWord = { hash, verify };
