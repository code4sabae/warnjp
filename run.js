import { downloadIndex } from "./downloadIndex.js";
import { parseIndex } from "./parseIndex.js";
import { downloadPref } from "./downloadPref.js";
import { parsePrefAll } from "./parsePref.js";
import { getDateByTenMinutes } from "./getDate.js";

let bkdt = null;
const update = async () => {
    const nowdt = getDateByTenMinutes();
    console.log(nowdt, bkdt);
    if (nowdt != bkdt) {
        bkdt = nowdt;
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
    }
};
setInterval(update, 1000 * 60 * 1); // 1min
//await update();
