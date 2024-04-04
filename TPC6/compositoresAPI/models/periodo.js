var mongoose = require("mongoose")

var periodoSchema = new mongoose.Schema({
    id : String,
    nome : String
}, { versionKey: false })

module.exports = mongoose.model('periodos', periodoSchema)