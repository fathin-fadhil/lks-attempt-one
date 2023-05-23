import { DataTypes } from "sequelize";
import db from '../config/database.js';

const FormsModel = db.define('forms', {
    isAnonymous: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    formTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    formDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    formColor: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    formQuestions: {
        type: DataTypes.JSON,
        allowNull: false    
    },
    createdByUserEmail: {
        type: DataTypes.STRING,
        allowNull: false
    }, createdByUserName: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

FormsModel.belongsTo(db.models.users, {
    foreignKey: {
        allowNull: false
    }
})

export default FormsModel;