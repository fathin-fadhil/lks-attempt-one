import { Router } from "express";
import { getFormsDetails } from "../controllers/formsController.js";

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

export default router