import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabase";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-LR", {
    style: "currency",
    currency: "LRD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPrice(amount) {
  return new Intl.NumberFormat("en-LR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

// lib/utils.js

export async function getPublicImageUrls(productId) {
  const { data: imageRecords } = await supabase
    .from("product_images")
    .select("url")
    .eq("product_id", productId);

  return (
    imageRecords?.map(
      (img) =>
        supabase.storage.from("product-images").getPublicUrl(img.url).data
          .publicUrl
    ) || []
  );
}
