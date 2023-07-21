//we create the package.json file using the npm init command in the command line
//this file contains dependencies, descriptions...etc (dependencies are like other files that we will need along with out node app)
//all node apps need this file!

const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
//const bootstrap = require('bootstrap');
const { MIMEType } = require('util');
//importing the necessary modules. 

const mimeTypes = {//types of files we are serving and their mime type
    html: 'text/html',
    jpeg: 'image/jpeg',
    jpg: 'image/jpg',
    png: 'image/png',
    js: 'text/javascript',
    css: 'text/css'
};

const server = http.createServer((req, res) => {
    const baseURl = `${req.protocol}://${req.headers.host}/`;//protocol relates to http...https...etc
    //host is sort of self explanatory but for this we are simply getting something like... http://localhost:3000/
    //remember req.url is only the query string so everything after the port (3000) in the case above
    let uri = new URL(req.url, baseURl).pathname;//creates a URL object and accesses the URL object property called pathname
    let fileName = path.join(process.cwd(), decodeURI(uri));//joins the current directory with the decoded uri/pathname -- decode the uri as it may contan non-standard ascii text 
    console.log('Loading ' + decodeURI(uri));
    let status;

    try {//check the status of whether the file exists, with try catch. if it doesn't exist then we throw a 404 
        status = fs.lstatSync(fileName);
    }
    catch(except){//outputs 404 error 
        res.writeHead(404, {'Content-Type': mimeTypes.html}).end(`<center><h1>404 Not Found</h1></center>`);
        return;
    }

    if (status.isFile()){//if we do find a file check that fileName is a file and not a dir
        let mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]];
        res.writeHead(200, {'Content-Type': mimeType});

        //creating a readStream that will pipe the data from the file to the response
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    }
    else if (status.isDirectory()){
        res.writeHead(302, {'Location': '/HTML/services.html'}).end();
    }
    else{
        res.writeHead(500, {'Content-Type': mimeTypes.html}).end(`<center><h1> 500 Internal Error</h1></center>`)
    }
});

server.listen('3000', '127.0.0.1', () =>{
    console.log(`The server is live at http://127.0.0.1:3000/`)
});
