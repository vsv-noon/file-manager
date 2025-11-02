import { createReadStream, createWriteStream } from "fs";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { access, constants } from "fs/promises";
import { pipeline } from "stream/promises";
import { resolvePath } from "../utils.js";
import { operationFailedMessage } from "../messages.js";

export async function cmd_compress(src, dest) {
  try {
    await access(resolvePath(src), constants.F_OK);

    await pipeline(
      createReadStream(resolvePath(src)),
      createBrotliCompress(),
      createWriteStream(resolvePath(dest))
    );
  } catch (error) {
    console.error(error.message);
    operationFailedMessage();
  }
}

export async function cmd_decompress(src, dest) {
  try {
    await access(resolvePath(src), constants.F_OK);

    await pipeline(
      createReadStream(resolvePath(src)),
      createBrotliDecompress(),
      createWriteStream(resolvePath(dest))
    );
  } catch (error) {
    console.error(error.message);
    operationFailedMessage();
  }
}
