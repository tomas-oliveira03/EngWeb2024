const mongoose = require('mongoose')
const { modelName } = require("../models/compositor")
var Compositor = require("../models/compositor")


module.exports.list = () => {
    return Compositor
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = id => {
    return Compositor
        .findOne({id : id})
        .exec()
}

module.exports.insert = compositor => {
    if((Compositor.find({id : compositor.id}).exec()).length != 1){
        var newCompositor = new Compositor(compositor)
        return newCompositor.save()
    }
}

module.exports.update = (id, compositor) => {
    return Compositor
        .findOneAndUpdate({id : id}, compositor, {new : true})
        .exec()
}

module.exports.remove = id => {
    return Compositor
        .deleteOne({id : id})
        .exec()
}