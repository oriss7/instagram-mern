const userController = require('./user.controller.js');
const multer = require('multer');
// const uploadMiddleware = multer({ dest: 'uploads/'})

// Configure Multer to store the file in memory
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage });

module.exports.connectUserRoutes = (app) => {
	const endPoint = 'profile';

	app.post('/register', userController.register);
	app.post('/login', userController.login);
	app.post('/logout', userController.logout)
	// app.post('/auth/register', userController.register);
	// app.post('/auth/login', userController.login);
	// app.post('/auth/logout', userController.logout)

	app.get(`/${endPoint}`, userController.getProfile);
	app.get(`/${endPoint}/:userId`, userController.getProfileById);
	app.get('/users', userController.getUsers);
	app.put(`/${endPoint}`, uploadMiddleware.single('file') , userController.editProfile);
    app.delete('/deleteUser/:userId', userController.removeUser);
    app.delete('/deleteProfilePic/:userId', userController.removeProfilePic);
    app.post('/follow', userController.follow);
}