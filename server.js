// A static file server for development use.
// By Curran Kelleher 4/26/2014
//
// Run in the background with the shell command "node server.js &".
// Install express with "npm install"
var port = 8000,
    express = require('express'),
    app = express();

app.use('/', express.static(__dirname + '/'));
app.listen(port);
console.log('Now serving http://localhost:'+port);
