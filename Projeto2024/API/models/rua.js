var mongoose = require("mongoose")


var figuraSchema = new mongoose.Schema({
    _id: false,
    idImage: String,
    path: String,
    legenda: String
}, { versionKey: false })


var casaSchema = new mongoose.Schema({
    _id: false,
    numero_porta: String,
    enfiteuta: String,
    foro: String,
    descricao: String
}, { versionKey: false })


var ruaSchema = new mongoose.Schema({
    _id: Number,
    nome: String,
    texto: String,
    figuras: [figuraSchema],
    casas: [casaSchema],
    imagens_atuais: [String],
    toponimia: String,
    freguesia: String
}, { versionKey: false })


module.exports = mongoose.model('ruas', ruaSchema, 'ruas')