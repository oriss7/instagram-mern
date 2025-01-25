const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path');
const User = require(path.resolve(__dirname, './user.model'));
const Post = require(path.resolve(__dirname, '../post/post.model'));
const bcrypt = require('bcryptjs')
const config = require('../../config/index.js');
const cloudinary = require('../../config/cloudinary.js');

const userService = require('./user.service.js');

exports.register = async (req, res) => {
	const {name,username,password} = req.body
	try{
		let userDoc = await userService.register(name,username,password);
		res.json(userDoc)
	} catch(error) {
		if (error.code === 11000) {
            res.status(400).json({ message: 'Username already exists.' });
        } else {
            res.status(400).json(error);
        }
	}
}

exports.login = async (req, res) => {
	const {username,password} = req.body
	const userDoc = await User.findOne({username})
	if (!userDoc) {
        return res.status(400).json({ message: 'User not found' });
    }
	const passOk = bcrypt.compareSync(password, userDoc.password)
	if (passOk) {
		const { name,profilePic,bio,followers,following, _id } = userDoc;
		
		jwt.sign({username,name,profilePic,bio,followers,following,_id}, config.jwt.secret, {}, (err,token) => {
			if (err) throw err
			res.cookie('token', token, { httpOnly: true }).json({
				_id:userDoc._id,
				username,
				name,
				profilePic,
				bio,
				followers,
				following
			})
		})
	} else {
		return res.status(400).json({ message: 'User not found' })
	}
}

exports.getProfile = async (req, res) => {
	const {token} = req.cookies
	if (!token) {		
		return res.status(200).json(null);
	}
	jwt.verify(token, config.jwt.secret, {}, async (err, info) => {
		if (err) throw err		
		const user = await User.findById(info._id)
			.populate('followers', 'username profilePic')
			.populate('following', 'username profilePic')
		
        if (user) {
        	const validFollowers = user.followers.filter(follower => follower !== null);
        	const validFollowing = user.following.filter(followed => followed !== null);
            
            const userInfo = {
                _id: user._id,  // Use _id for MongoDB query
                name: user.name,
                username: user.username,
                profilePic: user.profilePic,
                bio: user.bio,
                followers: validFollowers,
 				following: validFollowing,
            };
            res.json(userInfo)
        }
	})
}

exports.getProfileById = async (req, res) => {
	const { userId } = req.params
	const userInfo = await userService.getProfileById(userId);
	res.json(userInfo)
}

exports.getUsers = async (req, res) => {
	const usersInfo = await userService.getUsers();
	res.json(usersInfo)
}

exports.logout = async (req, res) => {
	res.clearCookie('token').json('ok')
}
// const {originalname,path:tempPath} = req.file
	// const parts = originalname.split('.')
	// const ext = parts[parts.length - 1]
	// const newPath = tempPath +'.'+ext
	// fs.renameSync(tempPath, newPath)
	// profilePic = newPath

// const profilePicPath = path.join(__dirname, '../../uploads', path.basename(user.profilePic)); // Changed
	// const profilePicPath = path.join(__dirname, user.profilePic)
	// console.log(profilePicPath)

	// fs.unlink(profilePicPath, (err) => {
	// 	if (err) {
	// 		console.error('Error deleting profile picture:', err)
	// 	}
	// })
////////////////////////////////
exports.editProfile = async (req, res) => {
	const { token } = req.cookies
	try{
		await new Promise((resolve, reject) => {
            jwt.verify(token, config.jwt.secret, (err, decoded) => {
                if (err) return reject(err);
                resolve(); // Resolve without passing decoded info
            });
        });
		
		const {userId,name,username,bio} = req.body
		// let profilePic
		let uploadResult
		if (req.file) {
			// profilePic = req.file;
			const user = await User.findById(userId)
			if (user && user.profilePic) {
				const publicId = user.profilePic
						.split('/').slice(-2).join('/').split('.')[0];
				try {
					// Delete the file from Cloudinary
					await cloudinary.uploader.destroy(publicId);
					console.log('Cloudinary file deleted successfully');
				} catch (err) {
					console.error('Error deleting file from Cloudinary:', err);
				}
			}
			uploadResult = await new Promise((resolve, reject) => {
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
				stream.end(req.file.buffer); // Pass the file buffer to the stream
			});
		}
		const updatedFields = {
			name,
			username,
			// ...(profilePic && { profilePic }),
			...(uploadResult && { profilePic: uploadResult.secure_url }),
			bio
		};
		await User.findByIdAndUpdate(
			userId, // use ID from JWT payload for security
			updatedFields,
			{ new: true, runValidators: true } // ensure the updated data follows schema validation
		)
		res.json({ message: 'Profile edited successfully' })
	
	} catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//////////////////////////////////////////////
// const profilePicPath = path.join(__dirname, deleteUser.profilePic)
// const coverPath = path.join(__dirname, post.cover)
// const profilePicPath = path.join(__dirname, '../../uploads', path.basename(deleteUser.profilePic)); // Changed
// fs.unlink(profilePicPath, (err) => {
//     if (err) {
//         console.error('Error deleting profile picture:', err)
//     }
// });

// const coverPath = path.join(__dirname, '../../uploads', path.basename(post.cover))
// fs.unlink(coverPath, (err) => {
//     if (err) {
//         console.error('Error deleting cover image:', err)
//     }
// })
exports.removeUser = async (req, res) => {
	const {userId} = req.params
	const deleteUser = await User.findByIdAndDelete(userId)
	const postsToDelete = await Post.find({ author: userId })
	const deletePosts = await Post.deleteMany({ author: userId })
	const publicIds = [];

	if (deleteUser && deleteUser.profilePic) {
		const profilePicPublicId = deleteUser.profilePic
			.split('/').slice(-2).join('/').split('.')[0];
		publicIds.push(profilePicPublicId)
	}
	// postsToDelete.forEach(post => {
	for (const post of postsToDelete) {
        if (post.cover) {
			const postCoverPublicId = post.cover
				.split('/').slice(-2).join('/').split('.')[0];
			publicIds.push(postCoverPublicId)
        }
    }
	if (publicIds.length > 0) {
        try {
            const result = await cloudinary.api.delete_resources(publicIds);
            console.log('Deleted resources:', result);
        } catch (err) {
            console.error('Error deleting resources from Cloudinary:', err);
        }
    }
	res.json({ message: 'User and associated posts deleted successfully', deleteUser, deletePosts })
}
// const profilePicPath = path.join(__dirname, user.profilePic)
// console.log(profilePicPath)
// const profilePicPath = path.join(__dirname, '../../uploads', path.basename(user.profilePic))
// fs.unlink(profilePicPath, (err) => {
//     if (err) {
//         console.error('Error deleting profile picture:', err)
//     }
// })
exports.removeProfilePic = async (req, res) => {
	const {userId} = req.params
	const user = await User.findById(userId)
	if (user && user.profilePic) {
        
		const publicId = user.profilePic
                .split('/')
                .slice(-2) // Get the last two parts: folder and file name
                .join('/') 
                .split('.')[0]; // Remove the file extension
		try {
			// Delete the file from Cloudinary
			await cloudinary.uploader.destroy(publicId);
			console.log('Cloudinary profile picture deleted successfully');
		} catch (err) {
			console.error('Error deleting profile picture from Cloudinary:', err);
			return res.status(500).json({ message: 'Error deleting profile picture' });
		}
	    user.profilePic = null
	    await user.save()
	    res.json({ message: 'Profile picture deleted successfully' })
	} else {
		res.status(404).json({ message: 'Profile picture was not found' })
	}
}

exports.follow = async (req, res) => {
	const {connectedUserId,pageUserId} = req.body
	const {connectedUser, pageUser} = await userService.follow(connectedUserId,pageUserId);
	res.json({connectedUser, pageUser})
}

//////////////////////////////////////////
// The controller and service should be like this:
// exports.loginBetter = async (req, res) => {
// 	try {
// 		const {username,password} = req.body
// 		const loginRes = await serviceLogin({username,password});
// 		res.cookie('token', token, { httpOnly: true }).json(loginRes.user);
// 	} catch (err) {
// 		return res.status(400).json(err);
// 	}
// }

// function _rejetAuth() {
// 	throw new Error({ message: 'User not found' });
// }
// async function serviceLogin({username,password}) {
// 	const userDoc = await User.findOne({username});
// 	if (!userDoc) _rejetAuth();
// 	const isPassOk = bcrypt.compareSync(password, userDoc.password)
// 	if (!isPassOk) _rejetAuth();

// 	const { name,profilePic,bio,followers,following, _id } = userDoc;
// 	const token = await signToken({username, name, profilePic, bio, followers, following, _id});

// 	// delete userDoc.password;

// 	return {
// 		token,
// 		user: { name,profilePic,bio,followers,following, _id }
// 	}
// }

// function signToken(user) {
// 	return new Promise((resolve, reject) => {
// 		jwt.sign(user, secret, {}, (err, token) => {
// 			if (err) reject(err);
// 			else resolve(token);
// 		});
// 	})
// }