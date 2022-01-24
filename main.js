var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var compKey = require('./compareKeyword');
const path = require('path');
var webPage = require('./webPage');




var app = http.createServer((req, res)=>{
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var keyword1 = queryData.first;
    var keyword2 = queryData.second;
    var pathname = url.parse(_url, true).pathname;
    console.log(`connected, pathname: ${pathname}`);
    if (pathname == '/uzzultibi'){
        if((keyword1 != undefined) || (keyword2 != undefined)){
            console.log(`keyword1: ${keyword1}, keyword2: ${keyword2}`);
            compKey.compareKeywords(keyword1, keyword2).then((result)=>{
                res.writeHead(200);
                res.end(result.toString());
            });
        }else{
            res.writeHead(200);
            res.end(webPage.webPage());
        }
    }
    else if(pathname == '/favicon.ico'){
        fs.readFile('favicon.ico', (err,icon)=>{
            res.writeHead(200);
            res.end(icon);
            
        });
    }
    else if(pathname == '/'){
        res.writeHead(302,
            {
                'Location' : '/uzzultibi'
            });
        res.end();
    }

})
app.listen(3000);