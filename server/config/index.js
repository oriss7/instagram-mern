const config = {
    mongo: {
        dbUrl: process.env.MONGO_URL
    },
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    },
    jwt: {
        secret : process.env.JWT_SECRET
    },
    server: {
        url: process.env.SERVER_URL
    }
}
module.exports = config;