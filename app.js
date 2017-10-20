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

app.listen(process.env.PORT || 80, function () {
  console.log('Example app listening on port 80!')
})

app.use(express.static('www'))
app.use('/bower', express.static('bower_components'))

