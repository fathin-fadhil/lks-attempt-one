import AnswerModel from "../models/answersModel.js";

export async function getAnswersByUserId(userId) {
    const rawData = await AnswerModel.findAll({
        where: {
            userId: userId
        }
    })

    if (!rawData) {
        return null
    }

    const answers = rawData.map( answers => {answers.dataValues})
    return answers
}

export async function getAnswersByFormId(formId) {
    const rawData = await AnswerModel.findAll({
        where: {
            formId: formId
        }
    })

    if (!rawData) {
        return null
    }

    const unprocessedAnswers = rawData.map( answers => answers.dataValues)

    const answers = unprocessedAnswers.map(answer => {
        return {
            ...answer,
            answers: JSON.parse(answer.answers)
        }
    })

    return answers
}

export async function addAnswer(answerArray, formId, userId, userEmail, userName) {
    await AnswerModel.create({
        answers: {
            answerArray: answerArray,
        },
        userEmail,
        formId,
        userId,
        userName
    })
}

export  async function deleteAnswerWithFormId(formId) {
    await AnswerModel.destroy({
        where: {
            formId: formId
        }
    })

}