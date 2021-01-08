import HTMLParser from "https://dev.jspm.io/fast-html-parser";
import { CSV } from "https://code4sabae.github.io/js/CSV.js";
import { fix0 } from "https://code4sabae.github.io/js/fix0.js";
import IMIMojiConverter from "https://code4sabae.github.io/imi-moji-converter-es/IMIMojiConverter.mjs";
import { getDateByHour } from "./getDateByHour.js";

const parseDate = (date) => {
    // 最新発表：令和　３年　１月　８日０７時３２分
    const s = IMIMojiConverter.toHalfWidth(date).replace(/\s/g, "");
    const n = s.match(/令和(\d+)年(\d+)月(\d+)日(\d+)時(\d+)分/);
    if (!n) {
        throw new Error("can't parse time");
    }
    const y = parseInt(n[1]) + 2018;
    const m = parseInt(n[2]);
    const d = parseInt(n[3]);
    const h = parseInt(n[4]);
    const min = parseInt(n[5]);
    return y + "-" + fix0(m, 2) + "-" + fix0(d, 2) + "T" + fix0(h, 2) + ":" + fix0(min, 2);
};

const parsePref = async (area) => {
    // console.log(area);
    const id = parseInt(area.id);
    const fn = "temp/" + id + ".html";
    const d = await Deno.readTextFile(fn);
    const d2 = d.replace(/<tr><tr>/g, "<tr>");
    const d3 = d2.replace(/<\/tr><\/tr>/g, "</tr>");
    const root = HTMLParser.parse(d3);
    
    const lastUpdate = parseDate(root.querySelector("#time").text);
    // console.log(lastUpdate);

    const json = {};

    const trs = root.querySelectorAll("#WarnTableTable tr");
    const list = [];
    trs.forEach(tr => {
        const ths = tr.querySelectorAll("th");
        if (ths.length > 0) {
            const head = [];
            ths.forEach(th => {
                head.push(th.text);
                const colspan = parseInt(th.attributes.colspan);
                //console.log(colspan);
                if (colspan) {
                    for (let i = 1; i < colspan; i++) {
                        head.push("");
                    }
                }
            });
            list.push(head);
        }
        const tds = tr.querySelectorAll("td");
        if (tds.length > 0) {
            const body = tds.map(td => td.text.replace("●", 1));
            list.push(body);
        }
    });
    let maxlen = 0;
    for (const d of list) {
        if (maxlen < d.length)
            maxlen = d.length;
    }
    for (const d of list) {
        const dlen = maxlen - d.length;
        for (let i = 0; i < dlen; i++) {
            d.unshift("");
        }
    }
    
    for (let i = 0; i < list.length; i++) {
        const d = list[i];
        if (d[2] == "") {
            continue;
        }
        for (let j = 0; j < 2; j++) {
            if (d[j] == "") {
                d[j] = list[i - 1][j];
            }
        }
    }
    // console.log(list[0].length);

    const csv = [];
    const head = ["id", "ISO3166-2", "pref", "area1", "area2", "city"];
    let level = null;
    for (let i = 3; i < list[1].length; i++) {
        if (list[0][i] != "") {
            level = list[0][i];
        }
        list[1][i] += level;
        head.push(list[1][i]);
    }
    head.push("lastUpdate");
    head.push("url");
    csv.push(head);
    let idx = 1;
    for (let i = 0; i < list.length; i++) {
        const d = list[i];
        if (d[2] == "") {
            continue;
        }
        d.unshift([id * 100 + idx++, area["ISO3166-2"], area.pref]);
        d.push(lastUpdate);
        d.push(area.url);
        csv.push(d)
    }
    await Deno.writeTextFile("temp/csv/" + id + ".csv", CSV.encode(csv));
    return csv;
};
const parsePrefAll = async () => {
    const didx = await Deno.readTextFile("temp/index.html.csv");
    const json = CSV.toJSON(CSV.decode(didx));

    let first = true;
    const csvall = [];
    for (const a of json) {
        //console.log(a);
        const csv = await parsePref(a);
        if (first) {
            first = false;
        } else {
            csv.shift();
        }
        csvall.push(...csv);
        /*
        console.log(csv);
        csv.forEach(line => csvall.push(line));
        */
    }
    const dt = getDateByHour();
    await Deno.writeTextFile("data/latest.csv", CSV.encode(csvall));
    const path = "data/" + dt.substring(0, 6);
    await Deno.mkdir(path, { recursive: true });
    await Deno.writeTextFile(path + "/" + dt + ".csv", CSV.encode(csvall));
};

export { parsePrefAll };
// parsePrefAll();
//parsePref(352);
