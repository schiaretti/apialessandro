import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado! Token não fornecido.' });
    }

    try {
        // Remove o prefixo "Bearer " do token
        const tokenWithoutBearer = token.replace('Bearer ', '');

        // Decodifica o token
        const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log para depuração

        // Verifica se o usuário é um administrador
        if (decoded.nivel !== 'admin') {
            return res.status(403).json({ message: 'Acesso restrito a administradores!' });
        }

        // Adiciona o usuário decodificado ao objeto de requisição para uso posterior
        req.user = decoded;
        next();

    } catch (error) {
        console.error('Erro ao verificar o token:', error); // Log para depuração
        return res.status(401).json({ message: 'Token inválido!' });
    }
};

export default auth;