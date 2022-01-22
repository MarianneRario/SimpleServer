const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const { unescape } = require("querystring");

// Set the type of files to be served
const mimeTypes = {
  html: "text/html",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  js: "text/javascript",
  css: "text/css",
};

// Create a server

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  var uri = url.parse(req.url).pathname; // Gets and sets the path portion of the URL.
  var fileName = path.join(process.cwd(), unescape(uri)); // Get the current working directory of the node.js process.
  var stats;

  try {
    stats = fs.lstatSync(fileName); // if the fileName exists, e.g. "/about-us"
    console.log("URI: ", uri);
    console.log("File Name: ", fileName);
    console.log("Stats: ", stats);
  } catch (e) {
    // if it doesnt find the file, just send 404
    res.writeHead(404, { "Content-type": "text/plain" });
    res.write("404 Not Found\n");
    res.end();
    return;
  }

  if (stats.isFile()) {
    var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
    res.writeHead(200, { "Content-type": mimeType });

    // create read stream
    var fileStream = fs.createReadStream(fileName); // allow you to open up a file/stream and read the data present in it.
    console.log("File stream: ", fileStream);
    fileStream.pipe(res); // write the content of fileName to response
  } else if (stats.isDirectory()) {
    res.writeHead(302, { Location: "index.html" });
    res.end();
  } else {
    res.writeHead(500, { "Content-type": "text/plain" });
    res.write("500 Internal Error\n");
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
