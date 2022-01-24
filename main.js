var http = require('http');
var fs = require('fs');
var url = require('url');
var compKey = require('./compareKeyword');
const path = require('path');


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
            compKey.serverAttack(keyword1, keyword2, (result)=>{
                console.log(`result: ${result}`);
                res.writeHead(200);
                res.end(result.toString());
            });
        }else{
            fs.readFile('webPage.html', (err, Page)=>{
                res.writeHead(200);
                res.end(Page);
            })
            
            
            
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