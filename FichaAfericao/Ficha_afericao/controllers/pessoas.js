const mongoose = require('mongoose')
const { modelName } = require("../models/pessoas")
var Pessoa = require("../models/pessoas")


module.exports.list = () => {
    return Pessoa
        .find()
        .sort()
        .exec()
}

module.exports.findById = id => {
    return Pessoa
        .findOne({id : id})
        .exec()
}

module.exports.insert = pessoa => {
    if((Pessoa.find({id : pessoa.id}).exec()).length != 1){
        var newPessoa = new Compositor(pessoa)
        return newPessoa.save()
    }
}

module.exports.update = (id, pessoa) => {
    return Pessoa
        .findOneAndUpdate({id : id}, pessoa, {new : true})
        .exec()
}

module.exports.remove = id => {
    return Pessoa
        .deleteOne({id : id})
        .exec()
}