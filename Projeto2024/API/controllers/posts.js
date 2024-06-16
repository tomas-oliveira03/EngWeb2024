const mongoose = require('mongoose')
var Posts = require("../models/posts")

// Devolve a lista de todos os posts
module.exports.list = () => {
    return Posts
        .find()
        .sort({date : -1})
        .exec()
}

// Encontra um post por id
module.exports.lookUp = id => {
    return Posts
        .findOne({_id : id})
        .exec()
}

// Encotra um post por nome de utilizador
module.exports.findByPoster = nomePoster => {
    return Posts
        .find({postedBy : nomePoster})
        .sort({date : -1})
        .exec()
}

// Encontra os posts acerca de uma rua
module.exports.findByRua = idRua => {
    return Posts
        .find({ruaID : idRua})
        .sort({date : -1})
        .exec()
}

// Insere um novo post
module.exports.insert = n => {
    var newPosts = new Posts(n)
    return newPosts.save()
}

// Atualiza um post
module.exports.update = (id, n) => {
    return Posts
        .findByIdAndUpdate(id, n, {new : true})
        .exec()
}

// Remove um post
module.exports.remove = id => {
    return Posts
        .deleteOne({_id : id})
        .exec()
}

module.exports.comment = (id, c) => {
    return Posts
        .findByIdAndUpdate(id, {$push : {comments : c}}, {new : true})
        .exec()
}

module.exports.like = (id, u) => {
    return Posts
        .findByIdAndUpdate(
            id,
            {
                $push: { peopleLikes: u },
                $inc: { likes: 1 }
            },
            { new: true }
        )
        .exec();
}

module.exports.unlike = (id, u) => {
    return Posts
        .findByIdAndUpdate(
            id,
            {
                $pull: { peopleLikes: u },
                $inc: { likes: -1 }
            },
            { new: true }
        )
        .exec();
}

module.exports.userPosts = username => {
    return Posts
        .find({postedBy : username})
        .sort({date : -1})
        .exec()
}

module.exports.removeAll = id => {
    return Posts
        .deleteMany({ruaID : id})
        .exec()
}