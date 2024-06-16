var mongoose = require("mongoose")

var commentsSchema = new mongoose.Schema({
    user : String,
    content : String,
    date : Date
}, { versionKey: false })

var postsSchema = new mongoose.Schema({
    ruaID : String,
    likes : Number,
    title : String,
    comments : [commentsSchema],
    postText : String,
    postedBy : String,
    date : Date,
    peopleLikes: [String]
}, { versionKey: false })

module.exports = mongoose.model('posts', postsSchema, 'posts')