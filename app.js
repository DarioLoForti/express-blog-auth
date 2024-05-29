require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const morgan = require('morgan');
const postsRouter = require('./routers/posts');
const authRouter = require('./routers/auth');

const auth = require('./controllers/auth');

app.use(express.urlencoded({ extended: true }));

const errorsFormatter = require('./middlewares/errorsFormatter');
const routersNotFound = require('./middlewares/routersNotFound');


app.use(express.static('public/images'));
app.use(morgan('dev'));

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send('<h1>Benvenuto nel mio blog!</h1><h1>I miei <a href="http://localhost:3000/posts">Post</a></h1><style>body{background-color: black; color: white;} a{text-decoration: none; color: white;}</style>');
});



app.use('/posts', postsRouter);


app.use(routersNotFound);

app.use(errorsFormatter);

app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
});