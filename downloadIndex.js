const downloadIndex = async () => {
    const url = "https://www.jma.go.jp/jp/warn/";
    const d = await (await fetch(url)).text();
    await Deno.writeTextFile("temp/index.html", d);
};
export { downloadIndex };
