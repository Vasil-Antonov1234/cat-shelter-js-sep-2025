import fs from "fs/promises";

const dataJson = await fs.readFile("./src/data.json", { encoding: "utf-8" });
const data = JSON.parse(dataJson);

async function getCats() {
    return data.cats;
}

async function addCat(newCat) {
    newCat.id = data.cats.length + 1;
    data.cats.push(newCat);
    const dataStringified = JSON.stringify(data);
    
    await fs.writeFile("./src/data.json", dataStringified, { encoding: "utf-8" });
}

export const dataService = {
    getCats,
    addCat
}