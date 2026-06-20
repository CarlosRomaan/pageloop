import crypto from "node:crypto";

export const createInviteToken = () => {
  return crypto.randomBytes(32).toString("hex");
};