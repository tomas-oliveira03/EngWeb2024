var mongoose = require("mongoose")

var sugestaoSchema = new mongoose.Schema({
    feitaPor: String,
    data: String,
    ruaID: Number,
    alteracoes: String,
    justificacao: String,
    important: Boolean
}, { versionKey: false })


module.exports = mongoose.model('sugestoes', sugestaoSchema, 'sugestoes')