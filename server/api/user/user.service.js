const path = require('path');
const User = require(path.resolve(__dirname, './user.model'));
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

async function register(name,username,password){
    const hashedPassword = bcrypt.hashSync(password, salt)
    const userDoc = await User.create({
        name,
        username,
        password: hashedPassword
    })
    return userDoc
}

async function getProfileById(userId) {
    const user = await User.findById(userId)
		.populate('followers', 'name username profilePic followers')
		.populate('following', 'name username profilePic followers')
	if (user) {
		const validFollowers = user.followers.filter(follower => follower !== null);
        const validFollowing = user.following.filter(followed => followed !== null);

        const userInfo = {
            _id: user._id,
            name: user.name,
            username: user.username,
            profilePic: user.profilePic,
            bio: user.bio,
            followers: validFollowers,
 			following: validFollowing,
        };
        return userInfo
    }
}

async function getUsers(){	
    const users = await User.find({}, 'name username profilePic followers')
        .populate('followers', 'username profilePic')
    
    const usersInfo = users.map(user => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        profilePic: user.profilePic,
    }))
    return usersInfo
}

async function follow(connectedUserId,pageUserId) {	
    const connectedUser = await User.findById(connectedUserId)
    const pageUser = await User.findById(pageUserId)

    const index = connectedUser.following.indexOf(pageUserId)
    if (index === -1) {
        connectedUser.following.push(pageUserId)
    } else{
        connectedUser.following.splice(index, 1)
    }
    await connectedUser.save()
    await connectedUser.populate({ path: 'following', select: 'name username profilePic' })

    const index2 = pageUser.followers.indexOf(connectedUserId)
    if (index2 === -1) {
        pageUser.followers.push(connectedUserId)
    } else{
        pageUser.followers.splice(index2, 1)
    }
    await pageUser.save()
    await pageUser.populate({ path: 'followers', select: 'name username profilePic followers' });
    await pageUser.populate({ path: 'following', select: 'name username profilePic followers' });

    return {connectedUser, pageUser}
}

module.exports = {
    register,
    getProfileById,
    getUsers,
    follow
}