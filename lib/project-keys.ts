import crypto from "crypto";

export function createWidgetPublicKey() {
  return `pl_pub_${crypto.randomBytes(16).toString("hex")}`;
}

export function createWidgetSecretKey() {
  return `pl_sec_${crypto.randomBytes(32).toString("hex")}`;
}

