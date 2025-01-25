const { v2: cloudinary } = require('cloudinary');
const config = require('./index.js'); // Your existing config file

cloudinary.config({ 
    cloud_name: config.cloudinary.cloud_name, 
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

module.exports = cloudinary;