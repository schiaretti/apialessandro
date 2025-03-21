import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/listar-usuarios', async (req, res) => {

    try {

          // Verifica se o usuário é um administrador (opcional, já que o middleware faz isso)
          if (req.user.nivel !== 'admin') {
            return res.status(403).json({ message: 'Acesso restrito a administradores!' });
        }

        const users = await prisma.user.findMany()

        res.status(200).json({ message: 'Usuários listados com sucesso!', users })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "falha no servidor!" })
    }

})

//rota de cadastro

router.post('/cadastro-user', async (req, res) => {
    try {
        const user = req.body
        const salt = await bcrypt.genSalt(10)
        const hashSenha = await bcrypt.hash(user.senha, salt)
        const userDb = await prisma.user.create({
            data: {
                nome: user.nome,
                email: user.email,
                nivel: user.nivel,
                senha: hashSenha,
            },
        })
        res.status(201).json(userDb)
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor!' })
    }
})


export default router


