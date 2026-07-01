// Server-only helper — signed Cloudinary asset deletion for the office
// (admin) delete routes. Mirrors the signing logic already used in
// /api/student/documents (student-initiated delete), factored out so the new
// admin routes don't duplicate the HMAC signing.

export async function deleteCloudinaryAsset(publicId?: string | null, resourceType = "image"): Promise<void> {
  if (!publicId) return;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return;

  const timestamp = Math.floor(Date.now() / 1000);
  const str = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-1", encoder.encode(str));
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0")).join("");

  const body = new URLSearchParams();
  body.append("public_id", publicId);
  body.append("timestamp", String(timestamp));
  body.append("api_key", apiKey);
  body.append("signature", signature);

  const type = ["image", "raw", "video"].includes(resourceType) ? resourceType : "image";
  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${type}/destroy`, {
    method: "POST", body,
  }).catch(() => {});
}
