const express = require("express")
const router = express.Router()

const {sucess, fail} = require("../helpers/resposta")
const GenreDAO = require('../servico/GenreDAO')

router.get("/", async (req, res) => {
    if(req.session.user){
        let genres = await GenreDAO.list()
        res.json(sucess(genres, "list"))
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

router.get("/:id", async (req, res) => {
    if(req.session.user){
        let obj = await GenreDAO.getById(req.params.id)
        if (obj)
            res.json(sucess(obj))
        else 
            res.status(500).json(fail("Não foi possível localizar o genero"))
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

router.post("/", async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            const {nome} = req.body
            //TODO validar os campos
            let obj = await GenreDAO.save(nome)
            if (obj)
                res.json(sucess(obj))
            else 
                res.status(500).json(fail("Falha ao salvar o novo genero"))
        }else{
            res.status(500).json(fail("Apenas adms podem fazer isso"))
        }
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

router.put("/:id", async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            const {id} = req.params
            const {nome} = req.body

            //TODO validar os campos

            let [result] = await GenreDAO.update(id, nome)
            console.log(result)
            if (result)
                res.json(sucess(result))
            else
                res.status(500).json(fail("Falha ao alterar o genero"))
        }else{
            res.status(500).json(fail("Apenas adms podem fazer isso"))
        }
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

router.delete("/:id", async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            let result = await GenreDAO.delete(req.params.id)
            if (result)
                res.json(sucess(result))
            else
                res.status(500).json(fail("Genero não encontrado"))
        }else{
            res.status(500).json(fail("Apenas adms podem fazer isso"))
        }
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

module.exports = router