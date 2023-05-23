import { Router } from "express";
import { addForm, getFormsDetails, getFormById, updateForm } from "../controllers/formsController.js";
import { isAuthenticated } from "../middleware/checkAuthentication.js";
import { addAnswer, getAnswersByFormId } from "../controllers/answersController.js";

const router = Router()

router.get('/forms', async (req, res) => {
    const {searchQuery, page, size } = req.query

    const search = searchQuery || ''
    const pageNumber = Number(page) || 0
    const pageSize = Number(size) || 10

    const limit = pageSize
    const offset = pageNumber * pageSize

    try {
        const { count, rows } = await getFormsDetails(search, limit, offset)
        const totalItems = count 

        const totalPages = Math.ceil(totalItems / pageSize)

        res.json({
            totalItems,
            totalPages,
            currentPage: pageNumber,
            pageSize,
            formsArray: rows
        })

    } catch (error) {
        console.log("🚀 ~ file: api.js:31 ~ router.get ~ error:", error)
        res.sendStatus(500)
    }
})

router.post('/forms', isAuthenticated, async (req, res) => {
    const { isAnonymous, formTitle, formDescription, formQuestions, formColor } = req.body

    if (isAnonymous === undefined ||  !formTitle  || !formDescription || !formQuestions || !formColor) return res.sendStatus(400)

    try {
        await addForm({
            isAnonymous, formTitle, formDescription, formQuestions, formColor
        }, req.userId, req.email, req.userName)

        res.sendStatus(201)
    } catch (error) {
        console.log("🚀 ~ file: api.js:49 ~ router.post ~ error:", error)
        res.sendStatus(500)
    }
})

router.put('/forms/:id', isAuthenticated, async (req, res) => {
    const formId = Number(req.params.id)

    const { isAnonymous, formTitle, formDescription, formQuestions, formColor } = req.body

    if (isAnonymous === undefined ||  !formTitle  || !formDescription || !formQuestions || formQuestions === [] || !formColor) return res.sendStatus(400)

    try {
        await updateForm({
            isAnonymous, formTitle, formDescription, formQuestions, formColor
        }, formId)

        res.sendStatus(200)
    } catch (error) {
        console.log("🚀 ~ file: api.js:68 ~ router.put ~ error:", error)
        res.sendStatus(500)
    }

    
})

router.get('/forms/:id', async (req, res) => {
    const formId = Number(req.params.id)

    if(!formId) return res.sendStatus(400)

    try {
        const form = await getFormById(formId)
        if(!form) return res.sendStatus(404)

        res.json(form)
    } catch (error) {
        console.log("🚀 ~ file: api.js:65 ~ router.get ~ error:", error)
        res.sendStatus(500)
    }
})

router.post('/forms/answers', isAuthenticated, async (req, res) => {
    const { formId, answersArray } = req.body
    if (!formId || !answersArray) return res.sendStatus(400)

    const userId = req.userId
    const userName = req.userName
    const userEmail = req.email    

    try {
        await addAnswer(answersArray, formId, userId, userEmail, userName )
        res.sendStatus(201)
    } catch (error) {
        console.log("🚀 ~ file: api.js:72 ~ error:", error)
        res.sendStatus(500)
    }
})

router.post('/forms/answers/anonymous', async (req, res) => {
    const { formId, answersArray } = req.body
    if (!formId || !answersArray) return res.sendStatus(400)
    try {
        await addAnswer(answersArray, formId, null, null, null)
        res.sendStatus(201)
    } catch (error) {
        console.log("🚀 ~ file: api.js:72 ~ error:", error)
        res.sendStatus(500)
    }
})

router.get('/forms/answers/:id', async (req, res) => {
    const formId = Number(req.params.id)

    if (!formId) return res.sendStatus(400)

    try {
        const answers = await getAnswersByFormId(formId)
        const form = await getFormById(formId)

        if (!form) return res.sendStatus(404)

        const formQuestionIds = form.formQuestions.map(question => question.id)
        
        let questionAndTheChoicesWithWhoAnsweredIt = []
        for (let index = 0; index < form.formQuestions.length; index++) {
            const question = form.formQuestions[index];
            const { type, questionText, required, questionId, choices } = question

            let choicesAndWhoPickedIt = []
            if (type === 'checkbox') {
                for (let index = 0; index < choices.length; index++) {
                    const choice = choices[index];
                    
                    let usersWhoPickedIt = []          
                    for (let index = 0; index < answers.length; index++) {
                        const userAnswers = answers[index];
                        
                        for (let index = 0; index < userAnswers.answers.answerArray.length; index++) {
                            const userAnswerElement = userAnswers.answers.answerArray[index];
                                if (!userAnswers.answers.answerArray[index]) continue
                
                                if (userAnswerElement.questionId === questionId) {
                
                                const userSelectedTheChoice = userAnswerElement.answerArray.find(userChoice => userChoice.answer === choice)
                                if (userSelectedTheChoice) {
                                    usersWhoPickedIt.push(userAnswers.userName)
                                }
                            }
                        }            
                    }
                    choicesAndWhoPickedIt.push({choice, usersWhoPickedIt})
                  }

                let numberOfUsersThatAnsweredTheQuestion = 0
                for (let index = 0; index < answers.length; index++) {
                    const usersAnswers = answers[index];
                    
                    for (let index = 0; index < usersAnswers.answers.answerArray.length; index++) {
                        const individualAnswers = usersAnswers.answers.answerArray[index];
                        if (!usersAnswers.answers.answerArray[index]) continue
                        
                        if (individualAnswers.questionId === questionId) {
                            if (individualAnswers.answerArray.length > 0) {
                                numberOfUsersThatAnsweredTheQuestion++                                
                            }
                        }
                    }                    
                }
                questionAndTheChoicesWithWhoAnsweredIt.push({...question, numberOfUsersThatAnsweredTheQuestion, choicesAndWhoPickedIt})
            }

            if (type === 'multipleChoice') {
                for (let index = 0; index < choices.length; index++) {
                    const choice = choices[index];
                    
                    let usersWhoPickedIt =[]
                    for (let index = 0; index < answers.length; index++) {
                        const userAnswers = answers[index];
                        
                        for (let index = 0; index < userAnswers.answers.answerArray.length; index++) {
                            const userAnswerElement = userAnswers.answers.answerArray[index];
                            if (!userAnswers.answers.answerArray[index]) continue

                            if (userAnswerElement.questionId === questionId) {
                                if (userAnswerElement.answer === choice) {
                                    usersWhoPickedIt.push(userAnswers.userName)
                                }
                            }
                        }
                    }
                    choicesAndWhoPickedIt.push({choice, usersWhoPickedIt})                
                }
                questionAndTheChoicesWithWhoAnsweredIt.push({...question, choicesAndWhoPickedIt})
            }

            if (type === 'textInput') {
                let theAnswerAndTheUser = []
                for (let index = 0; index < answers.length; index++) {
                    const userAnswer = answers[index];
                    
                    for (let index = 0; index < userAnswer.answers.answerArray.length; index++) {
                        const userAnswerElement = userAnswer.answers.answerArray[index];
                        if (!userAnswer.answers.answerArray[index]) continue

                        if (userAnswerElement.questionId === questionId) {
                            theAnswerAndTheUser.push({answer: userAnswerElement.answer, userName: userAnswer.userName})
                        }
                    }
                }
                questionAndTheChoicesWithWhoAnsweredIt.push({...question, theAnswerAndTheUser})            
            }
        }

        const answeredBy = answers.map(answer => answer.userName)

        res.json({ ...form, answeredBy, questionAndTheChoicesWithWhoAnsweredIt })

    } catch (error) {
        console.log("🚀 ~ file: api.js:136 ~ error:", error)
        res.sendStatus(500)    
    }
})

export default router