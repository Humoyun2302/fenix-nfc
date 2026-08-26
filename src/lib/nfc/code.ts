import { customAlphabet } from "nanoid";

// Unambiguous uppercase + digits (no O/0/I/1 confusion) for printed NFC codes.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const generate = customAlphabet(ALPHABET, 8);

/** Generate a public NFC tag code, e.g. "ABCD2345". */
export function generateNfcCode(): string {
  return generate();
}

export function isValidNfcCode(code: string): boolean {
  return /^[A-Za-z0-9]{4,32}$/.test(code);
}
