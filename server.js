import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import 'dotenv/config';
import expressEjsLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'node:url';
import routerView from './src/routers/viewRoutes.js';
import i18n from 'i18n';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de i18n
i18n.configure({
    locales: ['en', 'es'],
    directory: path.join(__dirname, '/locales'),
    defaultLocale: 'en',
    cookie: 'lang',
    queryParameter: 'lang',
});

// Configuración de middleware
app.disable('x-powered-by');

const apiLimit = rateLimit({
    windowMs: 25 * 60 * 1000,
    limit: 100,
    message: 'Too many requests from this host',
});

// Middleware general
app.use(cookieParser());
app.use(i18n.init);
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:8000', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(expressEjsLayouts);
app.use('/api', apiLimit);

app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"], // Allow Bootstrap and Google Fonts
        fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow Google Fonts
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], // Allow Bootstrap JS from CDN
        connectSrc: ["'self'"], // If using fetch or AJAX requests
        imgSrc: ["'self'", "data:"], // Allow images
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );


// Configuración de vistas
app.set('views', path.join(__dirname, '/view'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(express.static(path.join(__dirname, '/public')));

// Rutas
app.use('/', routerView);

// Servidor
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
