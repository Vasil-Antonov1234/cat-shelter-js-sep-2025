import http from "http";

import fs from "fs/promises";
import { dataService } from "./dataService.js";


const server = http.createServer(async (req, res) => {
    let contentType = "text/html";

    if (req.method === "POST") {
        let urlData = "";

        req.on("data", (chunk) => {
            urlData += chunk;
        })

        req.on("end", async () => {
            const newCatData = new URLSearchParams(urlData);
            const catDataResult = Object.fromEntries(newCatData.entries());

            if (req.url === "/cats/add-cat") {
                await dataService.addCat(catDataResult);
            } else if (req.url.startsWith("/cats/edit-cat/")) {
                const segments = req.url.split("/");
                const catId = Number(segments[3]);

                await dataService.updateCat(catId, catDataResult)
            }


            res.writeHead(302, {
                "location": "/"
            });

            res.end();
        });

        return;
    }

    if (req.url === "/content/styles/site.css") {
        contentType = "text/css"

        res.writeHead(200, {
            "content-type": contentType,
            "cache-control": "max-age=10"
        })

        res.write(await css());
        res.end();
        return;
    }

    res.writeHead(200, {
        "content-type": contentType
    })

    if (req.url === "/" && req.method === "GET") {
        res.write(await homeView());
    }

    if (req.url === "/cats/add-cat" && req.method === "GET") {
        res.write(await addCatView());
    }

    if (req.url === "/cats/add-breed" && req.method === "GET") {
        res.write(await addBreedView());
    }

    if (req.url.startsWith("/cats/edit-cat/") && req.method === "GET") {
        const segments = req.url.split("/");
        const catId = Number(segments[3]);


        res.write(await editCatView(catId));
    }


    res.end();
})

async function read(path) {
    return await fs.readFile(path, { encoding: "utf-8" });
}

async function homeView() {

    let catsHtml = ""

    const cats = await dataService.getCats();
    // const cats = [];

    if (cats.length > 0) {
        catsHtml = cats.map((cat) => catTemplate(cat)).join("\n");
    } else {
        catsHtml = "<h1>There are no cats yet</h1>";
    }

    const html = await read("./src/views/home.html");
    const result = html.replaceAll("{{cats}}", catsHtml);

    return result;
}

async function addCatView() {
    const breeds = await dataService.getBreeds();
    
    const html = await read("./src/views/addCat.html");
    const breedHtml = breeds.map((breed) => breedTemplate(breed)).join("\n");

    const result = html.replaceAll("{{breeds}}", breedHtml);
    return result;
}

function addBreedView() {
    return read("./src/views/addBreed.html");
}

async function editCatView(catId) {
    const cat = await dataService.getCatById(catId);
    let html = await read("./src/views/editCat.html");

    html = html.replaceAll("{{name}}", cat.name);
    html = html.replaceAll("{{description}}", cat.description);
    html = html.replaceAll("{{imageUrl}}", cat.imageUrl);

    return html;
}

function css() {
    return read("./src/content/styles/site.css");
}


function catTemplate(cat) {
    return `
    <li>
        <img src="${cat.imageUrl}">
        <h3>${cat.name}</h3>
        <p><span>Breed: </span>${cat.breed}</p>
        <p><span>Description: </span>${cat.description}</p>
        <ul class="buttons">
            <li class="btn edit"><a href="/cats/edit-cat/${cat.id}">Change Info</a></li>
            <li class="btn delete"><a href="">New Home</a></li>
        </ul>
    </li>
    `
}

function breedTemplate(breed) {
    return `
        <option value="${breed}">${breed}</option>
    `
}

server.listen(5000, () => console.log("Server is listening on http://localhost:5000..."))