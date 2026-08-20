/**
 * Server-only session utilities.
 *
 * Import only from Server Components, Server Actions, or Route Handlers.
 * These functions call supabase.auth.getUser() which validates the JWT
 * against Supabase's auth server on every call — never trusting a stale
 * local token. This is the correct pattern for production security.
 */
import { createClient } from "@/lib/supabase/server";
import { createClient as createBareClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Loads the caller's profile row using a client that carries their identity
 * (cookie session or Bearer token), so the users-table RLS applies as them.
 */
async function loadProfile(supabase, user) {
  const { data: profile } = await supabase
    .from("users")
    .select("id, first_name, last_name, email, phone, address, city, country, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Auth record exists but profile row is missing — return minimal identity.
    return { id: user.id, email: user.email, role: null };
  }

  return profile;
}

/**
 * Returns the authenticated user's full profile from the `users` table,
 * or null if the request is not authenticated.
 *
 * Two transports, checked in order:
 * 1. `Authorization: Bearer <jwt>` — used by the mobile app, which has no
 *    cookies. The token is validated against Supabase's auth server via
 *    getUser(token), and the same token is attached to the PostgREST client
 *    so RLS evaluates as that user.
 * 2. @supabase/ssr cookies — the web app's normal session.
 *
 * Both paths use getUser() (never getSession()) so the JWT is always
 * validated server-side — prevents privilege escalation via tampered
 * cookies or forged tokens.
 */
export async function getServerUser() {
  const hdrs = await headers();
  const authHeader = hdrs.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (bearer) {
    const bare = createBareClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${bearer}` } },
      },
    );

    const {
      data: { user },
      error,
    } = await bare.auth.getUser(bearer);

    // A valid Bearer wins; an invalid/expired one falls through to the cookie
    // path below rather than failing the request outright — so a browser
    // request that happens to carry a stray Authorization header (extension,
    // proxy, future webview) can still authenticate via its session cookies.
    if (!error && user) return loadProfile(bare, user);
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return loadProfile(supabase, user);
}

/**
 * Requires an authenticated session.
 * Redirects to /login (preserving the current path) if not authenticated.
 * Returns the user profile on success.
 */
export async function requireAuth(currentPath = "") {
  const user = await getServerUser();
  if (!user) {
    const to = currentPath ? `/login?from=${encodeURIComponent(currentPath)}` : "/login";
    redirect(to);
  }
  return user;
}

/**
 * Requires an authenticated admin session.
 * Redirects to /login if not authenticated.
 * Redirects to /unauthorized if authenticated but not an admin.
 * Returns the user profile on success.
 *
 * Always reads role from the DB — never trusts the JWT claim alone.
 */
export async function requireAdmin() {
  const user = await getServerUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/unauthorized");
  return user;
}
