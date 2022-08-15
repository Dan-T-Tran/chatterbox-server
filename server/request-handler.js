/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var _messages = {
  messages: [{username: 'Fred', text: 'no way'}]
};
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
  console.log('========================================')
  var headers = defaultCorsHeaders;

/*
Based on chatterbox-client...
  Ajax .get was invoked...
    Gets data that can be used in callback
    What does this data look like?
      Array of objects...
        Objects had like 8 properties...
          However, only 3 were determined by user. The rest were auto decided by server...
            Such as message_id, github_handle, date
          Where would the server save it then? How does it determine the other props?
            Current possibilities:
              As a variable on this file
              As variables on a different file that get overwritten each time
                Not on messages.js etc. since that data is based on a GET request from server
                <---------
  Hol' up, GLearn gives a link for the fs module...
    fs module allows writing into a file...
      Maybe reading as well?
    Could this be where data is saved? (At least in this local server style)
*/

  if (request.url === '/classes/messages') {
    if (request.method === 'GET') {
      var body = '';
      headers['Content-Type'] = 'application/json';
      response.writeHead(200, headers);
      // request.on('data', (chunk) => {
      //   body += chunk;
      // });
      // request.on('end', () => {
      //   console.log(body);
      //   response.end('hey');
      // })
      response.end(JSON.stringify(_messages));
      ////////////////////////////////////////////////////////////////
    } else if (request.method === 'POST') {
      var body = '';
      // What should body look like in the end?
      // An object? JSON'd object?
      //  {username: ###, text: ###, roomname: ###} ...
      // Might be taken care of in the ajax GET request (data object passed into it)
      headers['Content-Type'] = 'application/json';
      response.writeHead(201, headers);
      request.on ('data', (chunk) => {
        body += chunk;
      });
      request.on('end', () => {
        console.log(JSON.parse(body));
        console.log(typeof JSON.parse(body));
        body = JSON.parse(body);
        // fs.writeFile('./storage.js', body, function (err) {
        //   if (err) return console.log(err);
        //   console.log('Failed to write body');
        // });
        // a+ allows writing at end of file?
        //This works with {"name":"ya boi"}
        //What body comes out as is a string
        //Need to JSON.parse to make it into an object
        //Maybe then be able to push it into an array
        // _messages.push(body);
        response.end('201 post complete');
      })

      //Figure out how to get posted message, push into _messages, then try GET request to see if _messages updates
      // response.end(JSON.stringify())

      ////////////////////////////////////////////////////////////////
    } else {
      headers['Content-Type'] = 'application/json';
      response.writeHead(200, headers);
      response.end(`bro idk what's happening aaaaaaaaaaaa`)
    }
    /////////////////////////////////////////////////////////////////
  } else {
    headers['Content-Type'] = 'text/plain';
    response.writeHead(404, headers);
    response.end('failed')
  }
// Man I don't even know if the content type is right but w/e

  /*
  BELOW IS PROBABLY DEMONSTRATIONAL. USE AS EXAMPLES FOR CONDITIONALS?
  */
  // The outgoing status.
  // var statusCode = 200;

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World! C:');
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