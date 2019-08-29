/**
 * Creates SHA-256 HashBuffer as Base64-String
 */
String.prototype.getHash = async function() {
  const encoded = new TextEncoder().encode(this);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = new Uint8Array(hashBuffer);

  let binary = '';
  for (let i = 0; i < hashArray.byteLength; i++) {
    binary += String.fromCharCode(hashArray[i]);
  }

  return btoa(binary);
};
