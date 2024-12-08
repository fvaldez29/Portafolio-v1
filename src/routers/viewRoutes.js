import { Router } from "express";

const routerView = Router()

routerView.get('/home', (req, res) => {
    res.render('index', {title: 'Portfalio Web', user: req.user, layouts: 'layouts/main'})
})

export default routerView
