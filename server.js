import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'node:path'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import 'dotenv/config'
import expressEjsLayouts from 'express-ejs-layouts'
import { fileURLToPath } from 'node:url'
import routerView from './src/routers/viewRoutes.js'

const app = express()

const PORT = process.env.PORT || 3000

app.disable('x-powered-by')

const apiLimit = rateLimit({
    windowMs: 25 * 60 * 1000,
    limit: 100,
    message: 'Too many request from this host'
})

//Middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cors({
    origin: ['http:localhost:8000', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(expressEjsLayouts)
app.use('/api', apiLimit)
app.use(helmet())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.set('views', path.join(__dirname, '/view'));
app.use(express.static(path.join(__dirname, '/public')))

app.set('view engine', 'ejs')
app.set('layout', 'layouts/main')


app.use('/', routerView)

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`)
})