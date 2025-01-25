const postService = require('./post.service.js');

exports.getPost = async (req, res) => {
	const { postId } = req.params
	let post = await postService.getPost(postId);    
	res.json(post)
}

exports.getPosts = async (req, res) => {
	const { userId } = req.params
	let posts = await postService.getPosts(userId);
	res.json(posts)
}

exports.getFollowingPosts = async (req, res) => {
	const { userId } = req.params
	let posts = await postService.getFollowingPosts(userId);
	res.json(posts)
}

exports.createPost = async (req, res) => {
	const postDocId = await postService.createPost(req)
	res.json(postDocId)
}

exports.likePost = async (req, res) => {
	const { postId } = req.params
	const userId = req.body.userId
	await postService.likePost(postId,userId)
	res.json({ message: 'Post liked successfully' })	
}

exports.likeComment = async (req, res) => {
	const { postId, commentId } = req.params
  	const userId = req.body.userId
	await postService.likeComment(postId,commentId,userId)
    res.json({ message: 'Comment liked successfully' })
}

exports.createComment = async (req, res) => {
	const { postId } = req.params
	const {userId,text} = req.body
	await postService.createComment(postId,userId,text)
	res.json({ message: 'Post commented successfully' })
}

exports.editPost = async (req, res) => {
	await postService.editPost(req)
	res.json({ message: 'Post edited successfully' })
}

exports.deletePost = async (req, res) => {
	const {postId} = req.params
	const deletePost = await postService.deletePost(postId)
	console.log(deletePost)
	res.json({ message: 'Post deleted successfully', deletePost })
}

exports.deleteComment = async (req, res) => {
	const { postId, commentId } = req.params
	await postService.deleteComment(postId,commentId)
	res.json({ message: 'Comment deleted successfully' })
}