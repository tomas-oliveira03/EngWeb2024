const mongoose = require('mongoose')
var Rua = require("../models/rua")

module.exports.list = () => {
    return Rua
        .find()
        .sort({_id : 1})
        .exec()
}

module.exports.findById = identificador => {
    return Rua.findOne({_id : identificador}).exec()
}

module.exports.insert = rua => {
    return Rua.create(rua)
}

module.exports.update = (id, rua) => {
    return Rua
        .findByIdAndUpdate(id, rua, {new : true})
        .exec()
}

module.exports.remove = id => {
    return Rua
        .deleteOne({_id : id})
        .exec()
}

// Ir buscar ruas por toponimia
module.exports.listToponimia = top => {
    return Rua
        .find({toponimia : top})
        .sort({_id : 1})
        .exec()
}

// Ir buscar ruas por freguesia
module.exports.listFreguesia = freg => {
    return Rua
        .find({freguesia : freg})
        .sort({_id : 1})
        .exec()
}