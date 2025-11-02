import fs from "fs";
import crypto from "crypto";
import { resolvePath } from "../utils.js";

export function cmd_hash(file) {
  const p = resolvePath(file);
  const hash = crypto.createHash("sha256");
  const stream = fs.createReadStream(p);

  stream.on("data", (chunk) => hash.update(chunk));
  stream.on("end", () => console.log("SHA256 hash:", hash.digest("hex")));
  stream.on("error", (error) => {
    console.error("Error calculating hash:", error);
  });
}
