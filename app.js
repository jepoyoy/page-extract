const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

require('./routes/index')(app);
require('./routes/facebookExtract')(app);
require('./routes/youtubeExtract')(app);
require('./routes/instagramExtract')(app);
require('./routes/ogExtract')(app);

require('./routes/graphCMS')(app);

app.use(express.static('www'))
app.use('/bower', express.static('bower_components'))

var port = process.env.PORT || 80

server.listen(port, function() {
    console.log("App is running on port " + port);
});