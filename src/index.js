import http from "http";

import fs from "fs/promises";
import siteCss from "./content/styles/site.css.js";
// import homeHtml from "./views/home.html.js";

const server = http.createServer(async (req, res) => {

    if (req.url === "/content/styles/site.css") {
        res.writeHead(200, {
            "content-type": "text/css"
        })

        res.write(siteCss);
        res.end();
        return;
    }


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
    const html = await fs.readFile(path, { encoding: "utf-8" });
    return html;
}

function homeView() {
    const result = read("./src/views/home.html");
    return result;
}

function addCatView() {
    const result = read("./src/views/addCat.html");
    return result;
}

function addBreedView() {
    return read("./src/views/addBreed.html");
}

server.listen(5000, () => console.log("Server is listening on http://localhost:5000"))