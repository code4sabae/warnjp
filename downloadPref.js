import { CSV } from "https://code4sabae.github.io/js/CSV.js";
import { sleep } from "https://code4sabae.github.io/js/sleep.js";

const downloadPref = async () => {
    const didx = await Deno.readTextFile("temp/index.html.csv");
    const json = CSV.toJSON(CSV.decode(didx));
    for (const a of json) {
        const d = await (await fetch(a.url)).text();
        await Deno.writeTextFile("temp/" + a.id + ".html", d);
        console.log(a.id);
        await sleep(500);
    }
};

export { downloadPref };
