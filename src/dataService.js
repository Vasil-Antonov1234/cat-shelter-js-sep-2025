import fs from "fs/promises";

async function getCats() {
    const castsDataJSON = await fs.readFile("./src/data.json");
    const catsDataParsed = JSON.parse(castsDataJSON);

    return catsDataParsed.cats;
}

export const dataService = {
    getCats
}