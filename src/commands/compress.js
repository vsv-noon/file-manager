import { createReadStream, createWriteStream } from "fs";
import zlib from "zlib";
import { access, constants } from "fs/promises";
import { pipeline } from "stream/promises";
import { resolvePath } from "../utils.js";
import { operationFailedMessage } from "../messages.js";

export async function cmd_compress(src, dest) {
  const srcPath = resolvePath(src);
  const input = createReadStream(resolvePath(src));
  const output = createWriteStream(resolvePath(dest));
  const brotli = zlib.createBrotliCompress();

  try {
    await access(srcPath, constants.F_OK);
    await input.pipe(brotli).pipe(output);
  } catch (error) {
    console.error(error.message);
    operationFailedMessage();
  }
}

export async function cmd_decompress(src, dest) {
  const srcPath = resolvePath(src);
  const input = createReadStream(resolvePath(src));
  const output = createWriteStream(resolvePath(dest));
  const brotli = zlib.createBrotliDecompress();

  try {
    await access(srcPath, constants.F_OK);
    await input.pipe(brotli).pipe(output);
  } catch (error) {
    console.error(error.message);
    operationFailedMessage();
  }
}
