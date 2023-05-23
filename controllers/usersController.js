import UserModel from "../models/usersModel.js";

export async function getUserByEmail(email) {
    const user = await UserModel.findOne({ 
        where: {
            email: email
        }
        })

    if (!user) {
        return null
    }

    return user['dataValues']
}

export async function getuserById(id) {
    const user = await UserModel.findOne({
        where: {
            id: id
        }
    })

    if (!user) {
        return null
    }

    return user['dataValues']
}

export async function setUser( name, email, password, isAdmin) {
    await UserModel.create({
        name: name,
        email: email,
        password: password,
        is_admin: isAdmin
    })    
}

export async function updateRefreshToken(email, refreshToken) {
    await UserModel.update({
        refresh_token: refreshToken
    }, {
        where: {
            email: email
        }
    })
}

export async function getUserByRefreshToken(refreshToken) {
    const user = await UserModel.findOne({ 
        where: {
            refresh_token: refreshToken
        }
        })

    if (!user) {
        return null
    }

    return user['dataValues']  
}

export async function deleteRefreshToken (email) {
    await UserModel.update({
        refresh_token: null
    }, {
        where: {
            email: email
        }
    })
}