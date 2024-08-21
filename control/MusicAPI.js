const express = require("express")
const router = express.Router()

const validator = require("../helpers/validator")

const {sucess, fail} = require("../helpers/resposta")
const MusicDAO = require("../servico/MusicDAO")
const GenreDAO = require("../servico/GenreDAO")

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
                let { musics, total } = await MusicDAO.list(limit, offset);

                let totalPages = Math.ceil(total / limit);

                res.json(sucess({ musics, totalPages, currentPage: page, total }, "list"));
            } catch (error) {
                res.status(500).json(fail("Erro ao listar as musicas"));
            }
        }else{
            res.status(500).json(fail("Limite de paginação não existe"));
        }
    } else {
        res.status(500).json(fail("Você não tem permissão para isso"));
    }

});

router.get("/:id", (req, res) => {
    if(req.session.user){
        MusicDAO.getById(req.params.id).then(music => {
            res.json(sucess(music))
        }).catch(err => {
            consol.elog(err)
            res.status(500).json(fail("Não foi possível localizar a musica"))
        })
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

router.post("/", validator.validaNome, validator.validaArtista, validator.validaGenero, async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            if(req.session.user){
                let isAdmin = await UserDAO.isAdmin(req.session.user)
                if(isAdmin){
                    const {nome, artista, genero} = req.body

                    MusicDAO.save(nome, artista, genero).then(music => {
                        res.json(sucess(music))
                    }).catch(err => {
                        console.log(err)
                        res.status(500).json(fail("Falha ao salvar a nova musica"))
                    })
                }else{
                    res.status(500).json(fail("Apenas adms podem fazer isso"))
                }
            }else{
                res.status(500).json(fail("Você não tem permissão para isso"))
            }
        }else{
            res.status(500).json(fail("Apenas adms podem fazer isso"))
        }
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

router.put("/:id", validator.validaNome, validator.validaArtista, validator.validaGenero, async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            const {id} = req.params
            const {nome, artista, genero} = req.body
            let obj = {}

            obj.nome = nome
            obj.artista = artista
            obj.genero= genero

            if (obj == {}) {
                return res.status(500).json(fail("Nenhum atributo foi modificado"))
            }

            MusicDAO.update(id, obj).then(music => {
                if (music)
                    res.json(sucess(music))
                else
                    res.status(500).json(fail("Musica não encontrada"))
            }).catch(err => {
                console.log(err)
                res.status(500).json(fail("Falha ao alterar a musica"))
            })
        }else{
            res.status(500).json(fail("Apenas adms podem fazer isso"))
        }
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

router.delete("/:id",async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            MusicDAO.delete(req.params.id).then(music => {
                if (music)
                    res.json(sucess(music))
                else
                    res.status(500).json(fail("Musica não encontrada"))
            }).catch(err => {
                console.log(err)
                res.status(500).json(fail("Falha ao excluir a musica"))
            })
        }else{
            res.status(500).json(fail("Apenas adms podem fazer isso"))
        }
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

router.get("/genre/:id", async (req, res) => {
    if (req.session.user) {
        const genreId = req.params.id;
        
        try {
            const genre = await GenreDAO.getById(genreId);

            if (!genre) {
                return res.status(404).json(fail("Genero não encontrado"));
            }

            const { musics, total } = await MusicDAO.listByGenre(genreId);

            if (total === 0) {
                return res.json(sucess([], "Nenhuma musica encontrada para este genero"));
            }

            res.json(sucess({ musics, total }, "listByGenre"));
        } catch (error) {
            console.error(error);
            res.status(500).json(fail("Erro ao listar as musicas por genero"));
        }
    } else {
        res.status(500).json(fail("Voce não tem permissão para isso"));
    }
});


module.exports = router