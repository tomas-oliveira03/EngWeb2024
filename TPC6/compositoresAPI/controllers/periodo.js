const mongoose = require('mongoose')
const { modelName } = require("../models/periodo")
var Periodo = require("../models/periodo")


module.exports.list = () => {
    return Periodo
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = id => {
    return Periodo
        .findOne({id : id})
        .exec()
}

module.exports.insert = periodo => {
    if((Periodo.find({id : periodo.id}).exec()).length != 1){
        var newPeriodo = new Periodo(periodo)
        return newPeriodo.save()
    }
}

module.exports.update = (id, periodo) => {
    return Periodo
        .findOneAndUpdate({id : id}, periodo, {new : true})
        .exec()
}

module.exports.remove = id => {
    return Periodo
        .deleteOne({id : id})
        .exec()
}