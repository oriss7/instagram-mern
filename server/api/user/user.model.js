const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const UserSchema = new Schema({
	name: {type: String, required: true, minlength: 3, maxlength: 15},
	username: {type: String, required: true, unique: true, minlength: 3, maxlength: 15},
	password: {type: String, required: true},
	profilePic: {type: String},
	bio: {type: String, maxlength: 150},
	followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

const UserModel = model('User', UserSchema)

module.exports = UserModel

// profilePic: String,
// default: 'defaultProfilePic/default-profile-icon.jpg'