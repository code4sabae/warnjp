import HTMLParser from "https://dev.jspm.io/fast-html-parser";
import { JAPAN_PREF, JAPAN_PREF_ISO } from "https://code4sabae.github.io/js/JAPAN_PREF.js";
import { CSV } from "https://code4sabae.github.io/js/CSV.js";

const parseIndex = async () => {
    const fn = "data/index.html";
    const d = await Deno.readTextFile(fn);
    const root = HTMLParser.parse(d);

    const json = {};

    const areas = root.querySelectorAll("map area");
    for (const a of areas) {
        const att = a.attributes;
        //console.log(att);
        const title = att.title;
        const href = att.href;
        const id = href.match(/javascript:openPref\(\'(\d+)\'\)/)[1];
        json[title] = id;
    }
    console.log(json);

    const list = [];
    for (const name in json) {
        const v = json[name];
        let area = "";
        let pref = name;
        if (name.endsWith("地方")) {
            area = name;
            pref = parseInt(v) >= 350 ? "沖縄県" : "北海道";
        }
        const iso = JAPAN_PREF_ISO[JAPAN_PREF.indexOf(pref)];
        const url = "https://www.jma.go.jp/jp/warn/" + v + "_table.html";
        list.push([v, iso, pref, area, url]);
    }
    list.sort((a, b) => {
        return parseInt(a[0]) - parseInt(b[0]);
    })

    list.unshift(["id", "ISO3166-2", "pref", "area", "url"]);
    console.log(list);

    await Deno.writeTextFile(fn + ".csv", CSV.encode(list));
};

// parseIndex();
export { parseIndex };
