import http from "http";

import fs from "fs/promises";

const server = http.createServer(async (req, res) => {
    let contentType = "text/html";

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

function homeView() {
    return read("./src/views/home.html");
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

server.listen(5000, () => console.log("Server is listening on http://localhost:5000"))