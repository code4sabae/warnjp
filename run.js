import { downloadIndex } from "./downloadIndex.js";
import { parseIndex } from "./parseIndex.js";
import { downloadPref } from "./downloadPref.js";
import { parsePrefAll } from "./parsePref.js";
import { getDateByTenMinutes } from "./getDate.js";

await Deno.mkdir("temp/csv", { recursive: true });

const nowdt = getDateByTenMinutes();

await downloadIndex();
await parseIndex();
await downloadPref();
await parsePrefAll(nowdt);
