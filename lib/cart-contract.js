/**
 * Canonical shape for one entry in the shared Supabase `carts` table
 * (`{ user_id, items: jsonb[] }`), written by both this web app and the
 * mobile app. See docs/CART_CONTRACT.md for the full contract and rationale.
 *
 * This module is the single source of truth for:
 *   - which fields get persisted (CART_ITEM_FIELDS)
 *   - how a cartKey is derived (makeCartKey)
 *   - how a product becomes a cart item on add (buildCartItem)
 *   - how any row read off the wire — canonical, legacy web full-spread, or
 *     mobile superset — becomes a canonical item (normalizeCartItem/s)
 */

export const CART_ITEM_FIELDS = [
  "id",
  "slug",
  "name",
  "brand",
  "price",
  "sale_price",
  "stock",
  "quantity",
  "cartKey",
  "selectedSize",
  "selectedColor",
  "images",
];

/**
 * Composite cart key: [id, size, color] joined by '::', falling back to the
 * bare id when there's no size/color. Existing web format — single source
 * of truth so addItem/normalizeCartItem never drift apart.
 */
export function makeCartKey(id, size, color) {
  return [id, size, color].filter(Boolean).join("::") || id;
}

/**
 * Builds a canonical cart item from a product (as loaded by the web app,
 * which may carry `images` and/or `image_urls`) plus the add-to-cart
 * options. No product fields beyond the canonical 12 are copied — this
 * replaces the old `{ ...product, ... }` full spread.
 */
export function buildCartItem(product, { size = null, color = null, quantity = 1 } = {}) {
  const id = product.id;
  const images = product.images?.length
    ? product.images
    : product.image_urls?.length
      ? product.image_urls
      : [];

  return {
    id,
    slug: product.slug ?? "",
    name: product.name ?? "",
    brand: product.brand ?? "",
    price: Number(product.price) || 0,
    sale_price: product.sale_price != null ? Number(product.sale_price) : null,
    stock: Number(product.stock) || 0,
    quantity: Number(quantity) || 1,
    cartKey: makeCartKey(id, size, color),
    selectedSize: size || null,
    selectedColor: color || null,
    images,
  };
}

/**
 * Normalizes one raw `carts.items[]` entry — canonical, legacy web
 * full-spread (pre-cartKey, `{ ...product, quantity }`), or mobile superset
 * (`{ productId, imageUrl, size, color, ... }`) — into a canonical item, or
 * `null` if it's unusable (no id, or quantity <= 0). Unknown/extra fields
 * (description, keywords, video_url, ratings, category, …) are stripped.
 */
export function normalizeCartItem(raw) {
  if (raw == null || typeof raw !== "object") return null;

  const id = raw.id ?? raw.productId;
  if (!id) return null;

  const quantity = Number(raw.quantity);
  if (!(quantity > 0)) return null;

  const selectedSize = raw.selectedSize || raw.size || null;
  const selectedColor = raw.selectedColor || raw.color || null;

  const images = raw.images?.length
    ? raw.images
    : raw.image_urls?.length
      ? raw.image_urls
      : raw.imageUrl
        ? [raw.imageUrl]
        : [];

  // If the row carries a sale_price, it's list price + sale price (web's
  // own rule: effective price = sale_price ?? price). Otherwise treat
  // `price` as the only price we know (mobile rows already store the
  // effective price in `price` with no sale_price).
  const price = Number(raw.price) || 0;
  const sale_price = raw.sale_price != null ? Number(raw.sale_price) : null;

  const cartKey = raw.cartKey || makeCartKey(id, selectedSize, selectedColor);

  return {
    id,
    slug: raw.slug ?? "",
    name: raw.name ?? "",
    brand: raw.brand ?? "",
    price,
    sale_price,
    stock: Number(raw.stock ?? 0),
    quantity,
    cartKey,
    selectedSize,
    selectedColor,
    images,
  };
}

/** Normalizes a raw `carts.items` array, dropping anything unusable. */
export function normalizeCartItems(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizeCartItem).filter(Boolean);
}
