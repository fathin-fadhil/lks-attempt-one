import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const UserModel = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false    
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false    
    }, 
    password: {
        type:  DataTypes.STRING,
        allowNull: false    
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false    
    }, 
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true
})

export default UserModel