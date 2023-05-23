import FormsModel from "../models/formsModel.js";
import { Op } from "sequelize";

export async function getForms() {
    const formsData = await FormsModel.findAll();
    const forms = await formsData.map(form => form.dataValues)
    return forms;
}

export async function getFormsDetails(query, limit, offset) {
    const rawFormsData = await FormsModel.findAndCountAll({
        where: {
            [Op.or]: [
                {
                    formTitle: {[Op.like]: `%${query}%`}
                }, {
                    formDescription: {[Op.like]: `%${query}%`}
                }
            ]
        },
        attributes: {
            exclude: ['formQuestions']
        },
        order: [
            ['createdAt', 'DESC']
        ],
        limit,
        offset
    });
    //const forms = formsData.map( form => form.dataValues)
    return rawFormsData;
}

export async function getFormById(formId) {
    const formData = await FormsModel.findByPk(formId);
    
    if (!formData) {
        return null
    } 

    const {id, formTitle, formDescription, formColor, formQuestions, userId, createdAt, updatedAt, isAnonymous, createdByUserEmail} = formData.dataValues;
    const form = {
        isAnonymous,
        formId: id,
        formTitle,
        formDescription,
        formColor,
        formQuestions: (await JSON.parse(formQuestions)).formQuestionsArray,
        createdAt,
        updatedAt,
        createdByUserId: userId,
        createdByUserEmail
    }
    
    return form;
}

export async function addForm(formData, userId, userEmail) {
    const {isAnonymous, formTitle, formDescription, formColor, formQuestions} = formData
    await FormsModel.create({
        isAnonymous,
        formTitle,
        formDescription,
        formColor,
        formQuestions: {
            formQuestionsArray: formQuestions
        },
        userId,
        createdByUserEmail: userEmail
    })
}

export async function updateForm(formData, formId) {
    const {formTitle, formDescription, formColor, formQuestions} = formData
    await FormsModel.update({
        formTitle,
        formDescription,
        formColor,
        formQuestions: {
            formQuestionsArray: formQuestions
        }
    }, {
        where: {
            id: formId
        }
    })
} 

export async function deleteForm(formIdToBeDeleted) {
    await FormsModel.destroy({
        where:{
            id: formIdToBeDeleted
        }
    })
}