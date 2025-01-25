const postController = require('./post.controller.js');
const multer = require('multer');
// const uploadMiddleware = multer({ dest: 'uploads/'})

// Configure Multer to store the file in memory
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage });

module.exports.connectPostRoutes = (app) => {
	const endPoint = 'post';

	app.get(`/${endPoint}/:postId`, postController.getPost);
	app.get('/posts/:userId', postController.getPosts);
	app.get('/followingPosts/:userId', postController.getFollowingPosts);
	// app.post(`/${endPoint}`, uploadMiddleware.single('file'), postController.createPost);
    // app.post(`/${endPoint}`, postController.createPost)
	// Apply the Multer middleware for the create post route
    app.post(`/${endPoint}`, uploadMiddleware.single('file'), postController.createPost);
	app.post('/likepost/:postId', postController.likePost);
    app.post('/likecomment/:postId/:commentId', postController.likeComment);
    app.post('/commentpost/:postId', postController.createComment);
    app.put(`/${endPoint}`, postController.editPost);
	app.delete('/deletePost/:postId', postController.deletePost);
	app.delete('/deleteComment/:postId/:commentId', postController.deleteComment);
}