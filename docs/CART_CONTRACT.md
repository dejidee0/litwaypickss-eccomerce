# Cart item contract (v1)

The Supabase `carts` table (`{ user_id, items: jsonb[] }`) is shared between
this web app and the mobile app. Both write and read the same `items` array,
so it needs one agreed shape. This document describes that shape (the
"canonical contract") and how it's enforced. The source of truth in code is
`lib/cart-contract.js`.

## Canonical shape

```js
{
  id: string,              // product id (products.id, TEXT)
  slug: string,
  name: string,
  brand: string,
  price: number,           // LIST price
  sale_price: number|null, // effective price = sale_price ?? price
  stock: number,
  quantity: number,        // integer >= 1
  cartKey: string,         // [id, selectedSize, selectedColor].filter(Boolean).join('::') || id
  selectedSize: string|null,
  selectedColor: string|null,
  images: string[],        // >=1 absolute URL when available; UI uses images[0]
}
```

These are exactly the fields the web cart/checkout UI reads (verified by
grep across `app/(site)/cart`, `app/(site)/checkout`, `components/Cart`,
`app/api/momo/pay`, `app/actions/orders.js`), plus `slug` so the mobile app
can link back to the product. Nothing else is persisted to a `carts` row —
in particular, full product records (description, keywords, video_url,
ratings, category, sizes, colors, …) are never spread into a cart item.

## Field semantics

- **`price` / `sale_price`** — `price` is always the pre-discount list
  price. `sale_price` is either the discounted price or `null`. Every
  reader (web UI, mobile) computes the effective/displayed price the same
  way: `sale_price ?? price`. This rule is why `sale_price` must be `null`
  rather than omitted or equal to `price` when there's no discount.
- **`cartKey`** — composite identity for a cart line, since the same
  product can appear multiple times with different size/color selections.
  Built by `makeCartKey(id, size, color)`:
  `[id, size, color].filter(Boolean).join('::') || id`. This is the
  pre-existing web format; `lib/cart-contract.js` is now the single place
  that computes it, so `addItem` and the normalizer can never drift apart.
- **`selectedSize` / `selectedColor`** — `null` when the product has no
  variant selection for that axis (never `undefined` or `''`).
- **`images`** — always an array; the UI reads `images[0]` with a fallback
  placeholder if empty. Prefer `product.images`, then `product.image_urls`,
  then (for tolerant reads of mobile-shaped rows) a single-entry array from
  `imageUrl`.

## Who writes to `carts.items`

Both apps write this table:

- **Web** (`lib/cart-context.jsx`) — `addItem` builds a canonical item via
  `buildCartItem(product, { size, color, quantity })` and never spreads the
  full product object. Loads from `localStorage` and from Supabase both run
  through `normalizeCartItems` before landing in React state, so `items` in
  memory is always canonical regardless of what's actually stored.
- **Mobile** (`store/cart.ts`) — historically wrote (and still writes, as of
  this doc) a superset shape (`productId`, `imageUrl`, `size`/`color`,
  plus a spread of whatever raw fields it last read) via its own
  `toWire`/`fromWire` adapters. Migrating mobile onto this same
  `lib/cart-contract.js`-equivalent shape is a follow-up, tracked
  separately; it is not required for this contract to be safe, because of
  the tolerant-reader rule below.

## Tolerant-reader rule — no data migration required

`normalizeCartItem`/`normalizeCartItems` in `lib/cart-contract.js` accept
any of the shapes that exist in the wild today and produce a canonical item
(or `null`, filtered out, for anything unusable — no id, or quantity <= 0):

- **Canonical** (this contract).
- **Legacy web** (pre-`cartKey` full product spread): `id`, `image_urls`
  and/or `images`, no `cartKey`/`selectedSize`/`selectedColor`. `cartKey` is
  derived; `selectedSize`/`selectedColor` default to `null`.
- **Mobile superset**: `productId` instead of `id`, `imageUrl` instead of
  `images`, `size`/`color` instead of `selectedSize`/`selectedColor`.

Because every read path (localStorage, Supabase, and the merge-on-login
logic that combines them) goes through this normalizer, existing rows
written before this change remain valid as-is — **no backfill or data
migration is required**. The row only becomes canonical in storage the next
time it's saved (e.g. the next cart mutation), since saves now write
whatever is in (already-normalized) React state.

## Changelog

- **v1** (this change) — web stops spreading full product objects into cart
  items; introduces `lib/cart-contract.js` as the single source of truth for
  the canonical shape, `cartKey` derivation, and tolerant normalization of
  legacy/mobile-shaped rows.
