const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 2000 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // postId // NEXT STEP;
}, { timestamps: true })

const PostSchema = new Schema({
	author:{type:Schema.Types.ObjectId, ref:'User', required: true},
	cover: {type: String, required: true},
	content: {type: String, required: true, maxlength: 2000},
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	comments: [CommentSchema],
}, { timestamps: true })

const PostModel = model('Post', PostSchema)

module.exports = PostModel