import http from "http";

import fs from "fs/promises";
import { dataService } from "./dataService.js";

const cats = dataService.getCats();
// const cats = [];

const server = http.createServer(async (req, res) => {
    let contentType = "text/html";

    if (req.method === "POST") {
        let urlData = "";
        
        req.on("data", (chunk) => {
            urlData += chunk;
        })

        req.on("end", async () => {
            const newCatData = new URLSearchParams(urlData);
            const newCat = Object.fromEntries(newCatData.entries());
           
            await dataService.addCat(newCat);

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
            res.write(await homeView());
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

async function homeView() {
    
    let catsHtml = ""

    if (cats.length > 0) {
        catsHtml = cats.map((cat) => catTemplate(cat)).join("\n");
    } else {
        catsHtml = "<h1>There are no cats yet</h1>";
    }

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