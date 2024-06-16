const mongoose = require('mongoose')
var Sugestao = require("../models/sugestoes")

module.exports.list = () => {
    return Sugestao
        .find()
        .sort({_id : 1})
        .exec()
}

module.exports.findById = identificador => {
    return Sugestao.findOne({_id : identificador}).exec()
}

module.exports.insert = sugestao => {
    return Sugestao.create(sugestao)
}

module.exports.update = (id, sugestao) => {
    return Sugestao
        .findByIdAndUpdate(id, sugestao, {new : true})
        .exec()
}

module.exports.remove = id => {
    return Sugestao
        .deleteOne({_id : id})
        .exec()
}

// Ver todas as sugestões de uma determinada rua
module.exports.listByRua = ruaID => {
    return Sugestao
        .find({ruaID : ruaID})
        .sort({_id : 1})
        .exec()
}

// Ver todas as sugestões de um determinado utilizador
module.exports.listByUser = user => {
    return Sugestao
        .find({feitaPor : user})
        .sort({_id : 1})
        .exec()
}

module.exports.count = () => {
    return Sugestao.countDocuments().exec();
};


module.exports.removeAll = id => {
    return Sugestao
        .deleteMany({ruaID : id})
        .exec()
}