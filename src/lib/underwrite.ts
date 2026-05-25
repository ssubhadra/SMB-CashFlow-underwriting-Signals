// src/lib/underwrite.ts
const deployedUnderwriteUrl =
  "https://smb-credit-signal-with-j90ab2ttt-subha-ss-projects-04b497d2.vercel.app/api/underwrite";

function getUnderwriteUrl() {
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "localhost" &&
    window.location.port !== "3000"
  ) {
    return deployedUnderwriteUrl;
  }

  return "/api/underwrite";
}

export async function underwrite(payload: object) {
  const res = await fetch(getUnderwriteUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    // Vercel Functions already return 4xx/5xx with JSON ↘
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "API error");
  }

  return res.json(); // returns the full {status, business, analysis, …}
}
