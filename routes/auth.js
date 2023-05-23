import { Router } from "express";
import { setUser, getUserByEmail, updateRefreshToken, getUserByRefreshToken, deleteRefreshToken } from "../controllers/usersController.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const{ name, email, password, confPassword } = req.body

        // check that name , email, password, and confpassword is not null or undefined. 
        if (!name || !email || !password || !confPassword) return res.status(400).json({ message: 'Field tidak boleh kosong' })

        // check that password and confpassword is same.
        if (password !== confPassword) return res.status(400).json({ message: 'Password tidak sama' })

        // check that email is already registered.
        const getUser = await getUserByEmail(email)
        if (getUser) return res.status(400).json({ message: 'Email sudah terdaftar' })

        // hash password
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        // create user
        await setUser(name, email, hashedPassword, 0)
        res.status(201).json({ message: 'Berhasil daftar' })
    } catch (error) {
        console.log("🚀 ~ file: auth.js:62 ~ error:", error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const getUser = await getUserByEmail(email)
        if (!getUser) return res.status(401).json({ message: 'Email tidak ditemukan' })

        const passMatch = await bcrypt.compare(password, getUser.password)
        if (!passMatch) return res.status(401).json({ message: 'Password salah' })

        const userDetails = { userId: getUser.id, name: getUser.name,  email: getUser.email, isAdmin: getUser.is_admin }

        const accessToken = jwt.sign(userDetails, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
        const refreshToken = jwt.sign(userDetails, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

        await updateRefreshToken(email, refreshToken)

        res.cookie('refreshToken', refreshToken, {
            httpOnly:  true,
            sameSite: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.json({ accessToken, ...userDetails }).status(200)
    } catch (error) {
        console.log("🚀 ~ file: auth.js:36 ~ router.post ~ error:", error)
        res.status(500).json({ message: 'Internal Server Error' })        
    }
})

router.get('/token', async (req, res) => {
    try {
        const { refreshToken } = req.cookies
        if (!refreshToken) return res.sendStatus(401)

        const db_refreshToken = await getUserByRefreshToken(refreshToken)

        if (!db_refreshToken) return res.sendStatus(401)

        if (db_refreshToken.refresh_token !== refreshToken) return res.sendStatus(401)

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(401)
            const accessToken = jwt.sign({ userId: user.userId, name: user.name,  email: user.email, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
            res.json({ ...user, accessToken  }).status(200)
        })
    } catch (error) {
        console.log("🚀 ~ file: auth.js:52 ~ router.post ~ error:", error)        
        res.sendStatus(500)
    }
})

router.post('/logout', async (req, res) => {
    console.log('logout hit!')
    const email = req.body?.email
    try {
        if (email) {
            await deleteRefreshToken(email)
        }        
        res.clearCookie('refreshToken')
        res.sendStatus(200)
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

export default router