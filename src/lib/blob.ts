export function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
