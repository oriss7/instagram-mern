const express = require('express')
const path = require('path');
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
require('dotenv').config(); // Load environment variables

const config = require('./config/index.js'); // Import your config file
const cloudinary = require('./config/cloudinary.js'); // Import configured Cloudinary

const app = express()

// app.use(cors({credentials:true, origin:'http://localhost:3000'}))
app.use(cors({credentials:true, origin: config.server.url}))
app.use(express.json())
app.use(cookieParser())
// app.use('/uploads', express.static(__dirname + '/uploads'))
mongoose.connect(config.mongo.dbUrl)

require('./api/post/post.routes.js').connectPostRoutes(app);
require('./api/user/user.routes.js').connectUserRoutes(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Serve static files from the React app
// app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all handler to serve the React app for any unmatched route
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });

app.listen(4000)