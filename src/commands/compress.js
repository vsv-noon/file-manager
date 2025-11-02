import { createReadStream, createWriteStream } from "fs";
import zlib from "zlib";
import { resolvePath } from "../utils.js";

export function cmd_compress(src, dest) {
  const input = createReadStream(resolvePath(src));
  const output = createWriteStream(resolvePath(dest));
  const brotli = zlib.createBrotliCompress();

  input.pipe(brotli).pipe(output);
}

export function cmd_decompress(src, dest) {
  const input = createReadStream(resolvePath(src));
  const output = createWriteStream(resolvePath(dest));
  const brotli = zlib.createBrotliDecompress();

  input.pipe(brotli).pipe(output);
}
