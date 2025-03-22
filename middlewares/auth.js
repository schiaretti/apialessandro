import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        console.error('Token não fornecido no cabeçalho.'); // Log para depuração
        return res.status(401).json({ message: 'Acesso negado! Token não fornecido.' });
    }

    try {
        // Remove o prefixo "Bearer " do token
        const tokenWithoutBearer = token.replace('Bearer ', '');
        console.log('Token recebido:', tokenWithoutBearer); // Log para depuração

        // Verifica se o JWT_SECRET está definido
        if (!JWT_SECRET) {
            console.error('JWT_SECRET não está definido!'); // Log para depuração
            return res.status(500).json({ message: 'Erro no servidor. Tente novamente!' });
        }

        // Decodifica o token
        const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET);
        console.log('Token decodificado:', decoded); // Log para depuração

        // Verifica se o usuário é um administrador
        if (decoded.nivel !== 'admin') {
            console.error('Acesso negado. Nível do usuário:', decoded.nivel); // Log para depuração
            return res.status(403).json({ message: 'Acesso restrito a administradores!' });
        }

        // Adiciona o usuário decodificado ao objeto de requisição para uso posterior
        req.user = decoded;
        next();

    } catch (error) {
        console.error('Erro ao verificar o token:', error); // Log para depuração
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado! Faça login novamente.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido!' });
        } else {
            return res.status(500).json({ message: 'Erro no servidor. Tente novamente!' });
        }
    }
};

export default auth;