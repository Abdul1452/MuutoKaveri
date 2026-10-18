// Security headers sent with every response. The Vercel deployment sends the same list from vercel.json;
// test/headers.test.ts fails if the two drift apart.
// The app loads nothing from other origins and has no inline scripts or styles, so the policy can be strict.
// The web font is self-hosted, so fonts may come from the app's own origin only.
export const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; " +
    "font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; " +
    "manifest-src 'self'; worker-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};
