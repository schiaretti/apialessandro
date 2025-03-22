import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
import upload from '../config/multer.js'


// Rota de login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Verifica se o email e a senha foram fornecidos
        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
        }

        // Busca o usuário no banco de dados
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        // Compara a senha fornecida com a senha armazenada (hash)
        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            return res.status(400).json({ message: 'Senha inválida!' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                nivel: user.nivel, // Certifique-se de que o campo "nivel" está sendo incluído
            },
            JWT_SECRET,
            { expiresIn: '1d' } // Token expira em 1 dia
        );

        // Retorna o token e informações do usuário (opcional)
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                nivel: user.nivel,
            },
        });

    } catch (error) {
        console.error('Erro no login:', error); // Log para depuração
        res.status(500).json({ message: 'Erro no servidor. Tente novamente!' });
    }
});

router.post('/cadastro', upload.array('fotos', 10), async (req, res) => {
    try {
        console.log('Corpo da requisição:', req.body); // Log do corpo da requisição
        console.log('Arquivos recebidos:', req.files); // Log dos arquivos recebidos

        // Extrai os dados do formulário
        const {
            coords,
            cidade,
            endereco,
            numero,
            cep,
            isLastPost,
            localizacao,
            transformador,
            medicao,
            telecom,
            concentrador,
            poste,
            alturaposte,
            estruturaposte,
            tipoBraco,
            tamanhoBraco,
            quantidadePontos,
            tipoLampada,
            potenciaLampada,
            tipoReator,
            tipoComando,
            tipoRede,
            tipoCabo,
            numeroFases,
            tipoVia,
            hierarquiaVia,
            tipoPavimento,
            quantidadeFaixas,
            tipoPasseio,
            canteiroCentral,
            finalidadeInstalacao,
            especieArvore,
        } = req.body;

        // Extrai as fotos enviadas (se houver)
        const fotos = req.files ? req.files.map((file) => file.path) : [];

        // Dados a serem salvos no banco de dados
        const dadosCadastro = {
            coords,
            cidade,
            endereco,
            numero,
            cep,
            isLastPost: isLastPost === 'true', // Converte para booleano
            localizacao,
            transformador,
            medicao,
            telecom,
            concentrador,
            poste,
            alturaposte,
            estruturaposte,
            tipoBraco,
            tamanhoBraco,
            quantidadePontos,
            tipoLampada,
            potenciaLampada,
            tipoReator,
            tipoComando,
            tipoRede,
            tipoCabo,
            numeroFases,
            tipoVia,
            hierarquiaVia,
            tipoPavimento,
            quantidadeFaixas,
            tipoPasseio,
            canteiroCentral,
            finalidadeInstalacao,
            especieArvore,
        };

        // Adiciona as fotos ao objeto de dados (se houver)
        if (fotos.length > 0) {
            dadosCadastro.fotos = {
                create: fotos.map((foto) => ({ caminho: foto })),
            };
        }

        // Salva os dados no banco de dados
        const novoCadastro = await prisma.cadastro.create({
            data: dadosCadastro,
            include: {
                fotos: true, // Inclui as fotos na resposta (se houver)
            },
        });

        // Retorna a resposta
        res.status(201).json({
            message: 'Cadastro salvo com sucesso!',
            cadastro: novoCadastro,
        });

    } catch (error) {
        console.error('Erro ao salvar o cadastro:', error);
        res.status(500).json({ message: 'Erro no servidor. Tente novamente!' });
    }
});
// Exporta o router como padrão
export default router;