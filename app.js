const express = require('express')
const app = express()

require('./index')(app);
require('./facebookExtract')(app);
require('./youtubeExtract')(app);
require('./instagramExtract')(app);
require('./ogExtract')(app);

app.listen(process.env.PORT || 80, function () {
  console.log('Example app listening on port 80!')
})

app.use(express.static('www'))
app.use('/bower', express.static('bower_components'))