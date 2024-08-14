const express = require('express')
const UserDAO = require('../servico/UserDAO')
const router = express.Router()


const {sucess, fail} = require("../helpers/resposta") 

let logout = function(req, res, next) {
    req.session.user = null;
    res.json(sucess("Deslogado"))
    
}

router.post("/", async (req, res, next) => {
    let {username, senha} = req.body
    let usuario = await UserDAO.checkLogin(username, senha)
    if (usuario == false) {
        req.session.messages = ["Falha ao realizar o login."] 
        res.status(500).json(fail("Falha ao realizar o login.")) 
    } else {
        req.session.user = username
        res.json(sucess("Logado como " + req.session.user))
    }
})
router.get("/logout", logout)

module.exports = router