const db = require("../config/connection")

class Favorite {
    static async create({ TitleVideo, URLVideo, IdUser }) {
        try {

            const [existingVideo] = await db.query('SELECT * FROM Favorites WHERE URLVideo = ? AND IdUser = ?', [URLVideo, IdUser])
            if (existingVideo.length > 0){
                //Manda llamar el endpoint de DELETE
                await this.delete(existingVideo[0].IdVideo, IdUser);
                return { 
                    action: "Borrado de favoritos", 
                    deletedId: existingVideo[0].IdVideo
            }
            }

            const [result] = await db.query(
                "INSERT INTO Favorites(TitleVideo, URLVideo, IdUser) VALUES(?, ?, ?);",
                [TitleVideo, URLVideo, IdUser]
            )
            return result
        } catch(error) {
            console.error(error)
            throw error
        }
    }

    static async getByUser(IdUser) {
        try {
            const [favorites] = await db.query(
                "SELECT * FROM Favorites WHERE IdUser = ?",
                [IdUser]
            );
            return favorites
        } catch (error) {
            throw error
        }
    }

    static async delete(IdVideo, IdUser) {
        try {
            const [result] = await db.query(
                "DELETE FROM Favorites WHERE IdVideo = ? AND IdUser = ?",
                [IdVideo, IdUser]
            );
            return result
        } catch (error) {
            throw error
        }
    }
}

module.exports = Favorite;