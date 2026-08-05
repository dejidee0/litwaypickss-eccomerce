/**
 * MTN Liberia (Lonestar Cell MTN) mobile prefixes, expressed as the national
 * significant number — i.e. what follows the 231 country code. Dialled
 * locally these are 055… and 088….
 *
 * Other Liberian operators (Orange on 077, for example) cannot receive a MoMo
 * collection request, so those numbers are rejected here rather than being
 * sent to MTN only to come back as an opaque failure minutes later.
 */
const MTN_PREFIXES = ["55", "88"];

const EXAMPLE = "e.g. 0555 123 456, 0881 234 567 or 231555123456";

/**
 * Normalise a phone number to Liberian MSISDN format (231 + 9 digits) and
 * verify it belongs to MTN.
 *
 * Accepts local (0555123456), national (555123456) and international
 * (+231 555 123 456) forms, including the common mistake of keeping the
 * trunk zero after the country code (+231 0555123456).
 *
 * @param {string} phone
 * @returns {{ success: boolean, phone?: string, error?: string }}
 */
export function formatLiberianPhone(phone) {
  if (!phone) {
    return { success: false, error: "Phone number is required" };
  }

  const digits = String(phone).replace(/\D/g, "");

  // Strip the national trunk prefix (leading zeros), whether it was typed on
  // its own or after the country code.
  const national = digits.startsWith("231")
    ? digits.slice(3).replace(/^0+/, "")
    : digits.replace(/^0+/, "");

  if (national.length !== 9) {
    return {
      success: false,
      error: `A Liberian mobile number has 9 digits after the country code — ${EXAMPLE}`,
    };
  }

  if (!MTN_PREFIXES.some((prefix) => national.startsWith(prefix))) {
    return {
      success: false,
      error: `That isn't an MTN Liberia number. Mobile Money numbers start with 055 or 088 — ${EXAMPLE}`,
    };
  }

  return { success: true, phone: `231${national}` };
}
