import http from "http";

import fs from "fs/promises";
import { dataService } from "./dataService.js";

const server = http.createServer(async (req, res) => {
    let contentType = "text/html";

    const data = await dataService.getCats();

    if (req.url === "/content/styles/site.css") {
        contentType = "text/css"

        res.writeHead(200, {
            "content-type": contentType
        })

        res.write(await css());
        res.end();
        return;
    }

    res.writeHead(200, {
        "content-type": contentType
    })


    switch (req.url) {
        case "/":
            res.write(await homeView(data));
            break;
        case "/cats/add-cat":
            res.write(await addCatView());
            break;
        case "/cats/add-breed":
            res.write(await addBreedView());
            break;
    }

    res.end();
})

async function read(path) {
    return await fs.readFile(path, { encoding: "utf-8" });
}

async function homeView(data) {
    const catsHtml = data.map((cat) => catTemplate(cat));
    
    const html = await read("./src/views/home.html");
    const result = html.replaceAll("{{cats}}", catsHtml);

    return result;
}

function addCatView() {
    return read("./src/views/addCat.html");
}

function addBreedView() {
    return read("./src/views/addBreed.html");
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
            <li class="btn edit"><a href="">Change Info</a></li>
            <li class="btn delete"><a href="">New Home</a></li>
        </ul>
    </li>
    `
}

server.listen(5000, () => console.log("Server is listening on http://localhost:5000..."))