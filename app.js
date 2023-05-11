import express from 'express';
import mongoose from 'mongoose';
import taskRouter from './controllers/tasks.js';
import userRouter from './controllers/users.js'
import config from './utils/config.js';
import logger from './utils/logger.js';
// for views

import path from 'path';
import hbs from 'hbs';

const app=new express();
app.use(express.json())
// database connection 
mongoose.connect(config.MONGODB_URI).then(()=>logger.info('database connected')).catch(e=>logger.error(e))
app.use('/api/tasks',taskRouter);
app.use('/api/users',userRouter);

// set path for pulic folder
const publicPath=path.join(process.cwd(),'./public');
console.log(process.cwd())  
app.use(express.static(path.join(publicPath)))

app.set('view engine','hbs');
// set pages and partials path
const viewsPath=path.join(process.cwd(),'views','pages');
app.set('views',viewsPath);
const partialsPath = path.join(process.cwd(), 'views', 'partials');
hbs.registerPartials(partialsPath);


// home page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
       
    });
}
);
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',

    });
}
);
app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',

    });
}
);
app.get('/taskView', (req, res) => {
    res.render('taskView', {
        title: 'Task View',

    });
}

);



export default app;