const express = require("express")
const router = express.Router()

const {sucess, fail} = require("../helpers/resposta")
const MusicDAO = require("../servico/MusicDAO")

router.get("/", (req, res) => {
    if(req.session.user){
        MusicDAO.list().then((musics) => {
            res.json(sucess(musics, "list"))
        })
    }else{
        res.status(500).json(fail("Você não tem permissão para isso"))
    }
})

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

router.post("/", async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            if(req.session.user){
                let isAdmin = await UserDAO.isAdmin(req.session.user)
                if(isAdmin){
                    const {nome, artista, genero} = req.body

                    //TODO validar os campos

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

router.put("/:id", async (req, res) => {
    if(req.session.user){
        let isAdmin = await UserDAO.isAdmin(req.session.user)
        if(isAdmin){
            const {id} = req.params
            const {nome, artista, genero} = req.body

            //TODO validar os campos
            let obj = {}
            if (nome) obj.nome = nome
            if (artista) obj.artista = artista
            if (genero) obj.genero= genero

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

module.exports = router