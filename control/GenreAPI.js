const express = require("express")
const router = express.Router()

const validator = require("../helpers/validator")

const {sucess, fail} = require("../helpers/resposta")
const GenreDAO = require('../servico/GenreDAO')


router.get("/", async (req, res) => {
    if (req.session.user) {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        if (page == null || page < 1 || limit < 1) {
            res.status(500).json(fail("Pagina inexistente"));
        }

        if (limit == 10 || limit ==  15 || limit == 30){

            let offset = (page - 1) * limit;

            try {
                let { genres, total } = await GenreDAO.list(limit, offset);

                let totalPages = Math.ceil(total / limit);

                res.json(sucess({ genres, totalPages, currentPage: page, total }, "list"));
            } catch (error) {
                res.status(500).json(fail("Erro ao listar os generos"));
            }
        }else{
            res.status(500).json(fail("Limite de paginação não existe"));
        }
    } else {
        res.status(500).json(fail("Você não tem permissão para isso"));
    }

});

router.get("/summary", async (req, res) => {
    console.log(req.query)
    if (req.session.user) {
        let { page = 1, limit = 10 } = req.query;
        
        page = parseInt(page);
        limit = parseInt(limit);
        
        if (page == null || page < 1 || limit < 1) {
            res.status(500).json(fail("Pagina inexistente"));
        }

        if (limit == 10 || limit ==  15 || limit == 30){

            let offset = (page - 1) * limit;

            try {
                let { genres, total } = await GenreDAO.listQuantityMusicByGenre(limit, offset);
                let totalPages = Math.ceil(total / limit);

                res.json(sucess({ genres, totalPages, currentPage: page, total }, "listQuantityMusicByGenre"));
            } catch (error) {
                res.status(500).json(fail("Erro ao listar os generos"));
            }
        }else{
            res.status(500).json(fail("Limite de paginação não existe"));
        }
    } else {
        res.status(500).json(fail("Você não tem permissão para isso"));
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

router.post("/", validator.validaNome, async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            const {nome} = req.body
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

router.put("/:id", validator.validaNome, async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            const {id} = req.params
            const {nome} = req.body

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