const express = require("express")
const router = express.Router()

const {sucess, fail} = require("../helpers/resposta")
const UserDAO = require('../servico/UserDAO')

router.get("/", async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            let users = await UserDAO.list()
            res.json(sucess(users, "list"))
        }else{
            res.status(500).json(fail("Apenas adms podem fazer isso"))
        }
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

router.get("/:id", async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            let obj = await UserDAO.getById(req.params.id)
            if (obj)
                res.json(sucess(obj))
            else 
                res.status(500).json(fail("Não foi possível localizar o usuario"))
        }else{
            res.status(500).json(fail("Apenas adms podem fazer isso"))
        }
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

router.post("/", async (req, res) => {
    const {username, senha} = req.body

    //TODO validar os campos
    let obj = await UserDAO.save(username, senha, 0)
    if (obj)
        res.json(sucess(obj))
    else 
        res.status(500).json(fail("Falha ao salvar o novo usuario"))
})

router.put("/:id", async (req, res) => {
    if(req.session.user){
        const {id} = req.params
        let username = req.body.username
        let senha = req.body.senha
        let tipo = req.body.tipo
        //validar campos
        let user = await UserDAO.getById(id)
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(user){
            if(tipo == null){
                tipo = user.tipo
            }
            if(user.tipo != tipo ){
                if(!isAdmin){
                    res.status(500).json(fail("Apenas adms podem alterar o tipo do usuario"))
                } 
            }
        }

        if(req.session.user == user.username || isAdmin){
                console.log(id, username, senha, tipo)
                let [result] = await UserDAO.update(id, username, senha, tipo)
            if (result){
                req.session.user = username
                res.json(sucess(result))
            }else{
                res.status(500).json(fail("Falha ao alterar o usuario"))
            }
        } else{
        res.status(500).json(fail("Você não pode alterar esse usuario"))
        }
        
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

router.delete("/:id", async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            let result = await UserDAO.delete(req.params.id)
            if (result)
                res.json(sucess(result))
            else
                res.status(500).json(fail("Usuario não encontrado"))
        }else{
            res.status(500).json(fail("Apenas adms podem fazer isso"))
        }
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

module.exports = router