const bcrypt = require("bcrypt")
const db = require("../config/connection.js");
const { generateToken } = require("../middleware/auth.js");

const createUser = async(req, res) => {
    try {
        const{ NameUser, LastNameUser, EmailUser, PasswordUser } = req.body
        if (!NameUser || !LastNameUser || !EmailUser || !PasswordUser){
            return res.status(400).json({error: "Campos Obligatorios"})
        }

        // Verificar si el email ya existe
        const [existingUser] = await db.query('SELECT * FROM Users WHERE EmailUser = ?', [EmailUser]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Este usuario ya esta registrado' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(PasswordUser, saltRounds);

        const [result] = await db.query(
            "INSERT INTO Users(NameUser, LastNameUser, EmailUser, PasswordUser) VALUES(?, ?, ?, ?);",
            [NameUser, LastNameUser, EmailUser, hashedPassword]
        )

        // Generar token
        const newUser = { IdUser: result.insertId, EmailUser };
        const token = generateToken(newUser);

        res.status(201).json({
            message: "Usuario Creado", 
            token,
            id: result.insertId,
            user: newUser
        })
    }catch(error){
        console.log(db.query)
        console.error(error);
        res.status(500).json({ error: "Error al crear usuario" });
    }
}

// Login de usuario
const login = async (req, res) => {
    try {
        const { EmailUser, PasswordUser } = req.body;

        // 1. Buscar usuario (CORRECCIÓN CLAVE)
        const [rows] = await db.query('SELECT * FROM Users WHERE EmailUser = ?', [EmailUser]);
        if (!rows || rows.length === 0) {  // rows es el array de resultados
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const user = rows[0];  // Primera fila de resultados

        // 2. Verificar contraseña
        const passwordMatch = await bcrypt.compare(PasswordUser, user.PasswordUser);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 3. Generar token
        const token = generateToken({
            IdUser: user.IdUser,
            EmailUser: user.EmailUser
        });

        // 4. Respuesta exitosa
        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                IdUser: user.IdUser,
                NameUser: user.NameUser,
                EmailUser: user.EmailUser
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

module.exports = {
    createUser,
    login
}