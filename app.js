import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './__dirname.js'
import cartsRouter from './src/routes/carts.router.js';
import productsRouter from './src/routes/products.router.js';
import viewsRouter from './src/routes/views.router.js';
import './src/persist/dbConfig.js';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import MongoStore from 'connect-mongo';
import routes from './src/routes/index.js';


const app = express();
const PORT = 8080

app.use(cookieParser());
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: 'mongodb+srv://JereMarcelo:Jeremias98@cluster0.fbfpvfe.mongodb.net/?retryWrites=true&w=majority',
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            ttl: 15,
        }),
        secret: "123",
        resave: true,
        saveUninitialized: true,
    }))


app.use(express.static(__dirname + '/src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine({
    extname: 'handlebars',
    defaultLayout: 'main',
    
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/src/views');


app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);
app.use('/api', routes)


const httpServer = app.listen(8080, () => {
    console.log(`Servidor en el puerto ${8080}.`)
});

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
    console.log(`Usuario conectado con el ID ${socket.id}.`);
    socket.emit('fetchProducts');
    socket.on('updateProducts', () => {
        socket.emit('fetchProducts')
    });
    socket.on('disconnect', () => {
        console.log(`Usuario con ID ${socket.id} se ha desconectado.`)
    })
})