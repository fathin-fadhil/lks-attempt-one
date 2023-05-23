import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function isAuthenticated(req, res, next) {
    try {
        const tokenFromHeader = req.headers['authorization']
        const token = tokenFromHeader && tokenFromHeader.split(' ')[1]

        if (!token) return res.sendStatus(401)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(401)

            req.userId = decoded.userId
            req.email = decoded.email
            req.userName = decoded.name
            console.log("🚀 ~ file: checkAuthentication.js:18 ~ jwt.verify ~ decoded.name:", decoded.name)
            next()
        
        })        
    } catch (error) {
        console.log("🚀 ~ file: checkAuthentication.js:21 ~ isAuthenticated ~ error:", error)
        res.sendStatus(500)
    }
}