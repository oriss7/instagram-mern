const path = require('path');
const Post = require(path.resolve(__dirname, './post.model.js'));
const User = require(path.resolve(__dirname, '../user/user.model.js'));
const jwt = require('jsonwebtoken')
// const fs = require('fs')
const config = require('../../config/index.js');
const cloudinary = require('../../config/cloudinary.js');

async function getPost(postId) {
    let post = await Post.findById(postId)
    .populate('author', ['username','profilePic'])
    .populate('likes', ['name','username','profilePic','followers'])
    .populate({path: 'comments',
      populate: [{path: 'user', select: 'username profilePic'},{path: 'likes', select: 'username'}]
    })
   
    post.likes = post.likes.filter(like => like);
    post.comments = post.comments.map(comment => {
        comment.likes = comment.likes.filter(like => like);
        return comment.user ? comment : null;
    }).filter(comment => comment);

    return post
}

async function getPosts(userId) {
    let posts = await Post.find({ author: userId })
		.populate('author', ['username','profilePic'])
		.populate('likes', ['username','profilePic'])
		.populate({path: 'comments',
	      populate: [{path: 'user', select: 'username profilePic'},{path: 'likes', select: 'username'}]
	    })
		.sort({createdAt: -1})
	posts = posts.map(post => {
        post.likes = post.likes.filter(like => like);
        post.comments = post.comments.map(comment => {
            comment.likes = comment.likes.filter(like => like);
            return comment.user ? comment : null;
        }).filter(comment => comment);
        return post;
    });

    return posts
}

async function getFollowingPosts(userId) {
    const user = await User.findById(userId).select('following');
	if (!user) {
    	return res.status(404).json({ message: 'User not found' });
  	}
	const followingList = user.following;
	let posts = await Post.find({ author: { $in: followingList } })
		.populate('author', ['username','profilePic'])
		.populate('likes', ['name','username','profilePic','followers'])
		.populate({path: 'comments',
	      populate: [{path: 'user', select: 'username profilePic'},{path: 'likes', select: 'username'}]
	    })
		.sort({createdAt: -1})
		.limit(20)

	posts = posts.map(post => {
        post.likes = post.likes.filter(like => like); 
        post.comments = post.comments.map(comment => {
            comment.likes = comment.likes.filter(like => like);
            return comment.user ? comment : null;
        }).filter(comment => comment);
        return post;
    });
    
    return posts
}
// const {originalname,path} = req.file
    // const parts = originalname.split('.')
	// const ext = parts[parts.length - 1]
	// const newPath = path+'.'+ext
	// fs.renameSync(path, newPath)
async function createPost(req) {
    const file = req.file;
    if (!file) {
        throw new Error('No file uploaded');
    }
    
	const { token } = req.cookies;
	if (!token) {
        throw new Error("No token provided");
    }
	const info = await new Promise((resolve, reject) => {
        jwt.verify(token, config.jwt.secret, {}, (err, decodedInfo) => {
            if (err) {reject(err)}
            else {resolve(decodedInfo)}
        });
    });
    const { content } = req.body;
    // Upload the file to Cloudinary
    // const uploadResult = await cloudinary.uploader.upload_stream({
    
    // const uploadResult = await cloudinary.uploader.upload(file, {
    //     folder: 'instagram_uploads', // Folder to organize uploads
    //     use_filename: true, // Use the original filename
    //     resource_type: 'image', // Specify that this is an image
    // });
    const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'instagram_uploads', // Folder to organize uploads
                use_filename: true, // Use the original filename
                resource_type: 'image', // Specify that this is an image
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(file.buffer); // Pass the file buffer to the stream
    });
    ///////////////////
    const postDoc = await Post.create({
        author: info._id,
        cover: uploadResult.secure_url, // Use the Cloudinary URL for the cover image
        content
    });
    return postDoc._id;
}
// cover: newPath,
async function likePost(postId,userId){
    const post = await Post.findById(postId)
	const index = post.likes.indexOf(userId)
	if (index === -1) {
		post.likes.push(userId)
	} else{
		post.likes.splice(index, 1);
	}
	await post.save()
}

async function likeComment(postId,commentId,userId){
    const post = await Post.findById(postId)
  	const comment = post.comments.id(commentId)
  	const index = comment.likes.indexOf(userId)
  	if (index === -1) {
  		comment.likes.push(userId)
  	} else {
  		comment.likes.splice(index, 1)
  	}
    await post.save()
}

async function createComment(postId,userId,text){
    const post = await Post.findById(postId)
	post.comments.push({ user: userId, text })
	await post.save()
}

async function editPost(req){
    const { token } = req.cookies
	jwt.verify(token, config.jwt.secret, {}, async (err, info) => {
        if (err) throw err
		const {postId,content} = req.body
       
		await Post.findByIdAndUpdate(
		    postId,
		    { content },
		    { new: true, runValidators: true }
		)
    })
}
// const fullPath = path.join(__dirname, '../../uploads', path.basename(deletePost.cover)); // Changed
        // const fullPath = path.join(__dirname, deletePost.cover)
	    // fs.unlink(fullPath, (err) => {
	    //     if (err) {
	    //         console.error('Error deleting cover image:', err)
	    //     }
	    // });
        /////////////
async function deletePost(postId){
    const deletePost = await Post.findByIdAndDelete(postId)
	if (deletePost && deletePost.cover) {
        
        // Extract the public_id from the Cloudinary URL
        // const publicId = deletePost.cover.split('/').pop().split('.')[0]; // Extract public_id
        const publicId = deletePost.cover
                .split('/').slice(-2).join('/').split('.')[0];
        try {
            // Delete the file from Cloudinary
            await cloudinary.uploader.destroy(publicId);
            console.log('Cloudinary file deleted successfully');
        } catch (err) {
            console.error('Error deleting file from Cloudinary:', err);
        }
	}
    return deletePost
}

async function deleteComment(postId,commentId){
    const post = await Post.findById(postId)
	post.comments.pull(commentId);
	await post.save()
    console.log('deleteComment service')
}

module.exports = {
	getPost,
    getPosts,
    getFollowingPosts,
    createPost,
    likePost,
    likeComment,
    createComment,
    editPost,
    deletePost,
    deleteComment
}