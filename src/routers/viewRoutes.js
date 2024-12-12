import { Router } from "express";
import { getProjectController } from "../controllers/projectController.js";

const routerView = Router()

routerView.get('/', getProjectController)

routerView.get('/change-lang', (req, res) => {
    const lang = req.query.lang
    res.cookie('lang', lang)
    res.redirect('/')
})


export default routerView
