let validaNome = (req, res, next) => {
    let {nome} = req.body;
    if (nome == undefined || nome == "") {
        return res.status(400).json({status: false, error:"Nome nao informado"});
    }
    if (nome.length < 3) {
        return res.status(400).json({status: false, error:"O nome precisa ter mais do que 3 caracteres"});
    }
    req.nome = nome.toUpperCase();
    next();
};

let validaArtista = (req, res, next) => {
    let {artista} = req.body
    if (artista == undefined || artista == "") {
        return res.status(400).json({status: false, error:"Artista nao informado"})
    }
    req.artista = artista.toUpperCase()
    next()
}

let validaGenero = (req, res, next) => {
    let {genero} = req.body
    if (genero == undefined || genero == "") {
        return res.status(400).json({status: false, error:"Genero nao informado"})
    }
    req.genero = genero.toUpperCase()
    next()
}

module.exports = {
    validaNome,
    validaArtista,
    validaGenero
};