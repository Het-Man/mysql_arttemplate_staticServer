let http = require("http");
let fs = require("fs");
let path = require("path");
// 导入mime
let mime = require("mime");
// 引入模板引擎
let template = require("art-template");
// mysql
let mysql = require("mysql");

// 使用querystring进行转码
let qs = require('querystring');

// 网站根目录的 绝对路径
let rootPath = path.join(__dirname, "www");

// 开启服务
http.createServer((request,response) => {

  filePath = path.join(rootPath, qs.unescape(request.url));
  
  if(filePath.indexOf('index.html') != -1){
    //链接数据库
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database : 'test'
    });
     
    connection.connect();
     
    connection.query('SELECT * from manyhero', function (error, results, fields) {
      if (error) throw error;
      //通过模板引擎渲染数据
      var html = template(__dirname + "/www/index.html", {
        results
      });

      response.end(html);

    });
     
    connection.end();

  }else{
    //来什么读什么
    fs.readFile(filePath,(err,data) =>{
      response.writeHead(200,{
        'content-type': mime.getType(filePath)
      })

      response.end(data);
    })
  }

}).listen(80,'127.0.0.1',() => {
  console.log('success');
})