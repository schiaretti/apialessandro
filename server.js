import express from 'express';
import publicRoutes from './routes/public.js';
import privateRoutes from './routes/private.js';
import auth from './middlewares/auth.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000; // Usa a porta da Vercel ou 3000 localmente

app.use(express.json());
app.use(cors());

// Rotas públicas
app.use('/', publicRoutes);

// Rotas privadas (protegidas pelo middleware de autenticação)
app.use('/cadastro_user', auth, privateRoutes);
app.use('/listar-usuarios', auth, privateRoutes);


// Endpoint de saúde
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Inicia o servidor
app.listen(port, () => console.log(`Servidor rodando na porta ${port}!`));