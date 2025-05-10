const express = require("express")
const db = require("./config/connection") // Importar la conexión
const userRoutes = require("./routes/users")
const FavoritesRoutes = require("./routes/favorites")

const app = express();

//Rutas
app.use(express.json())
app.use("/api", userRoutes)
app.use("/api/favorites", FavoritesRoutes)


// Iniciar servidor
PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})