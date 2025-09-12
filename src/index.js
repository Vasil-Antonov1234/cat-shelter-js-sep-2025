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
            const homeHtml = await fs.readFile("./src/views/home.html", { encoding: "utf-8" });
            res.write(homeHtml);
            break;
        case "/cats/add-cat":
            const addCatHtml = await fs.readFile("./src/views/addCat.html", { encoding: "utf-8" });
            res.write(addCatHtml);
            break;
    }

    res.end();
})


function readFile(path) {
    return fs.readFile(path, { encoding: "utf-8" });
}

async function homeView() {

    const html = readFile("./src/views/home.html");
    return html;
}

server.listen(5000, () => console.log("Server is listening on http://localhost:5000"))