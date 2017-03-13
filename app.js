const http = require('http');
const https = require('https');
const fs = require('fs');
const zlib = require('zlib');

const options = {
  key: fs.readFileSync('cert/key.pem'),
  cert: fs.readFileSync('cert/cert.pem'),
};

module.exports = () => {
  http.createServer((req, res) => {
    console.log(req.headers);
    
    res.writeHead(302, {
      'Location': 'https://localhost:8443'
    });
    res.end();
  }).listen(8080);
  
  let routes = {};

  https.createServer(options, (req, res) => {
    console.log(req.url);
    //res.writeHead(200);
    res.writeHead(200, { 'content-encoding': 'gzip' });

    let url = req.url;
    if(!url || url == '/') url = '/index.html';

    fs.readFile('www' + url, (err, buffer)=>{
      zlib.gzip(buffer, (err, buffer)=>{
        if(err) throw err;
        res.end(buffer);
      });
    });
  }).listen(8443);
};