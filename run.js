import { downloadIndex } from "./downloadIndex.js";
import { parseIndex } from "./parseIndex.js";
import { downloadPref } from "./downloadPref.js";
import { parsePrefAll } from "./parsePref.js";
import { getDateByTenMinutes } from "./getDate.js";

const update = async () => {
    const nowdt = getDateByTenMinutes();
        try {
            await Deno.mkdir("temp/csv", { recursive: true });
            await downloadIndex();
            await parseIndex();
            await downloadPref();
            await parsePrefAll(nowdt);
            console.log("updated!", nowdt);
        } catch (e) {
            console.log(e);
        }
};
await update();
