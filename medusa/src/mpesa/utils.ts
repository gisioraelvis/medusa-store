export const timeStamp = new Date()
  .toISOString()
  .replace(/[^0-9]/g, "")
  .slice(0, -3);

export async function Config(accessToken: string): Promise<any> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
  return config;
}

export function generatePassword(
  businessShortCode: string,
  passKey: string
): string {
  return Buffer.from(`${businessShortCode}${passKey}${timeStamp}`).toString(
    "base64"
  );
}

const usedReferenceNumbers: Set<string> = new Set();
export default function generateUniqueReferenceNumber(prefix: string): string {
  let referenceNumber: string;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  do {
    referenceNumber = `${prefix}-`;
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      const randomChar = characters.charAt(randomIndex);
      referenceNumber += randomChar;
    }
  } while (usedReferenceNumbers.has(referenceNumber));
  usedReferenceNumbers.add(referenceNumber);
  return referenceNumber;
}
