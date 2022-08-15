/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// var _messages = [];
// var _message_id = 0;

var fs = require('fs');

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var headers = defaultCorsHeaders;

  // fs.readFile('chatterbox.html', (err, html) => {
  //   headers['Content-Type'] = 'application/json';
  //   response.writeHeader(200, headers);
  //   if (err) {
  //     console.error(err);
  //   }
  //   response.write(html);
  // })
  // Attempt to make localhost:3000 render instead of having to use localhost:8080

  if (request.url === '/classes/messages') {
    if (request.method === 'GET') {
      var body = '';
      headers['Content-Type'] = 'application/json';
      response.writeHead(200, headers);
      fs.readFile("./messageStorage.txt", (err, data) => {
        if (err) {
          console.error(err);
        }
        body += data;
        response.end(body);
      })

      ////////////////////////////////////////////////////////////////
    } else if (request.method === 'POST') {
      var body = '';
      var tempStorage = '';
      headers['Content-Type'] = 'application/json';
      response.writeHead(201, headers);
      request.on ('data', (chunk) => {
        body += chunk; //combine posted message data as it comes in as chunks of data
      });
      request.on('end', () => {
        body = JSON.parse(body); //convert body string to object
        fs.readFile('./messageStorage.txt', (err, data) => { //read messageStorage which holds array of objects
          if (err) {
            console.error(err);
          }
          tempStorage += data; //converting messageStorage data into a string
          tempStorage = JSON.parse(tempStorage); //converting messageStorage string to array of objects
          body['message_id'] = tempStorage.length; //augment body object with message_id
          body['date'] = new Date(); //augment body object with date created
          tempStorage.push(body); //push body object into array of objects
          fs.writeFile("./messageStorage.txt", JSON.stringify(tempStorage), (err) => { //overwrite messageStorage
            if (err)
              console.error(err);
            else {
              response.end(JSON.stringify(tempStorage)); //return JSON new array of objects
              //writeFile has to benested in readFile...
              //  Asynchronous?
            }
          });
        });
      })

      //////////////////////////////////////////////////////////////// Other requests in valid url
    } else {
      headers['Content-Type'] = 'application/json';
      response.writeHead(200, headers);
      response.end(`bro idk what's happening aaaaaaaaaaaa`)
    }
    ///////////////////////////////////////////////////////////////// 404 on invalid url
  } else {
    headers['Content-Type'] = 'text/plain';
    response.writeHead(404, headers);
    response.end('failed')
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;