import fs from "fs/promises";

const dataJson = await fs.readFile("./src/data.json", { encoding: "utf-8" });
const data = JSON.parse(dataJson);

function getCats() {
    return data.cats;
}

async function addCat(newCat) {
    newCat.id = data.nextId;
    data.nextId++;
    data.cats.push(newCat);
    
    await saveData();
}

async function getCatById(catId) {
    const cat = data.cats.find((cat) => cat.id === catId);
    return cat;
}

async function updateCat(catId, catData) {
    data.cats = data.cats.map((cat) => cat.id === catId ? {id: catId, ...catData} : cat);
    
    await saveData();
}


async function getBreeds() {
    return data.breeds;
}

async function addBreed(newBreed) {
    data.breeds.push(newBreed);

    await saveData();
}

async function deleteCat(catId) {
    data.cats = data.cats.filter((cat) => cat.id !== catId);

    saveData();
}


async function saveData() {
    const dataStringified = JSON.stringify(data, null, 2);
    
    await fs.writeFile("./src/data.json", dataStringified, { encoding: "utf-8" });
}

async function searchCat(searchParams) {
    const result = data.cats.filter((cat) => cat.name.toLowerCase().includes(searchParams.toLowerCase()));


    return result;
}


export const dataService = {
    getCats,
    getCatById,
    addCat,
    getBreeds,
    addBreed,
    deleteCat,
    searchCat,
    updateCat
}