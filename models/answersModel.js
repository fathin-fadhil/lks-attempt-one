import db from '../config/database.js'
import { DataTypes } from 'sequelize'

const AnswersModel = db.define('answers', {
    answers: {
        type: DataTypes.JSON,
        allowNull: false
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    userName: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

AnswersModel.belongsTo(db.models.forms, {
    foreignKey: {
        allowNull: false
    }
})

AnswersModel.belongsTo(db.models.users, {
    foreignKey: {
        allowNull: true
    }
})

export default AnswersModel