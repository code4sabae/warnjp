import { downloadIndex } from "./downloadIndex.js";
import { parseIndex } from "./parseIndex.js";
import { downloadPref } from "./downloadPref.js";
import { parsePrefAll } from "./parsePref.js";
import { getDateByHour } from "./getDateByHour.js";

let bkdt = null;
const update = async () => {
    const nowdt = getDateByHour();
    console.log(nowdt, bkdt);
    if (nowdt != bkdt) {
        try {
            await Deno.mkdir("temp/csv", { recursive: true });
            await downloadIndex();
            await parseIndex();
            await downloadPref();
            await parsePrefAll();
            console.log("updated!", nowdt);
            bkdt = nowdt;
        } catch (e) {
            console.log(e);
        }
    }
};
setInterval(update, 1000 * 60 * 10); // 10min
//await update();
