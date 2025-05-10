const jwt = require('jsonwebtoken');
const db = require('../config/connection');

// Middleware para verificar el token JWT
const verifyToken = async (req, res, next) => {
    try {
        // Obtener el token del header 'Authorization'
        const token = req.headers['authorization']?.split(' ')[0];
        
        if (!token) {
            return res.status(401).json({ error: 'Acceso no autorizado: Token no proporcionado' });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SecretKey2310');
        
        // Verificar si el usuario aún existe en la base de datos
        const [user] = await db.query('SELECT IdUser FROM Users WHERE IdUser = ?', [decoded.IdUser]);
        
        if (!user.length) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Añadir el ID de usuario al request para uso en las rutas
        req.user = { IdUser: decoded.IdUser };
        next();
    } catch (error) {
        console.error('Error en verifyToken:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        
        res.status(500).json({ error: 'Error en la autenticación' });
    }
};

// Middleware para generar token (usado durante el login)
const generateToken = (user) => {
    return jwt.sign(
        { IdUser: user.IdUser, EmailUser: user.EmailUser },
        process.env.JWT_SECRET || 'tu_secreto_secreto',
        { expiresIn: '24h' } // El token expira en 24 horas
    );
};

module.exports = {
    verifyToken,
    generateToken
};