import { Router } from "express";

const routerView = Router()

routerView.get('/', (req, res) => {
    res.render('index', {
        title: 'Portfalio Web',
        user: req.user,
        layouts: 'layouts/main'
    })
})

routerView.get('/change-lang', (req, res) => {
    const lang = req.query.lang
    res.cookie('lang', lang)
    res.redirect('/')
})

export default routerView
