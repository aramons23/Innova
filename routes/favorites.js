const express = require("express")
const routerFav = express.Router()
const favorite = require("../controllers/favorites")
const { verifyToken } = require("../middleware/auth")

//Agregar Favorito
routerFav.post("/", verifyToken, async (req, res) => {
    try{
        const { TitleVideo, URLVideo, IdUser } = req.body

        if (!TitleVideo || !URLVideo || !IdUser) {
            return res.status(400).json({error: "Todos los campos son obligatorios"})
        }

        const result = await favorite.create({ TitleVideo, URLVideo, IdUser })
        res.status(201).json({
            message: "Accion Realizada",
            data: result
        })
    } catch(error){
        console.error(error)
        res.status(500).json({error: "Error al agregar a favoritos" })
    }
})

//Obtener favoritos
routerFav.get("/user/:IdUser", verifyToken, async (req, res) =>{
    try{
        const{ IdUser } = req.params
        const favorites = await favorite.getByUser(IdUser)

        console.log(favorites)
        res.status(200).json(favorites)
    }catch(error){
        console.error(error)
        res.status(506).json({ error: "Error al obtener favoritos"})
    }
})

// Eliminar favorito
routerFav.delete("/", verifyToken, async (req, res) => {
    try {
        const { IdVideo, IdUser } = req.body;
        const result = await Favorite.delete(IdVideo, IdUser);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Favorito no encontrado" });
        }
        
        res.status(200).json({ message: "Favorito eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar favorito" });
    }
});

module.exports = routerFav