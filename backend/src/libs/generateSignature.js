import crypto from "crypto";

export const generateSignature = (
  apiKey,
  merchantId,
  referenceCode,
  txValue,
  currency
) => {
  const formattedValue = parseFloat(txValue).toFixed(2);
  const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${formattedValue}~${currency}`;
  return crypto.createHash("md5").update(signatureString).digest("hex");
};
