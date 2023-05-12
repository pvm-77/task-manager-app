import express from 'express';
import fetch from 'node-fetch';
import axios from 'axios';
const webUserRouter = express();

webUserRouter.get('/', (req, res) => {
    // check if the user is logged in i.e the token cookie is present
    if (req.cookies.token) {
        // render home page with the user name
        res.render('index', { user: req.cookies.user ,title:'home'});

    } else {
        res.render('index',{title:'jome'});
    }

})


webUserRouter.get('/login', (req, res) => {
    res.render('login', { title: 'Login' })

});

webUserRouter.post('/login', async (req, res) => {

    try {
        // make an API call to the backend server
        const response = await fetch('http://localhost:3005/api/users/login', {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // check if the API call was successful
        if (response.ok) {
            // extract the user and token data from the API response
            const data = await response.json();
            const { user, token } = data;
            console.log('user is', user);
            res.cookie('token', token);
            res.cookie('user', user);
            res.redirect('/');
        } else {
            // render the login page with an error message
            res.redirect('login', { title: 'Login', error: 'Invalid username or password' });
        }
    } catch (error) {
        
        res.render('login', { title: 'Login', error: 'Something went wrong. Please try again later.' });
    }

});

webUserRouter.post('/logout', async (req, res) => {
    try {
        // Retrieve the token from the cookie
        let token = req.cookies.token;
        // Make a request to the API endpoint to logout the user
        await fetch('http://localhost:3005/api/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // Clear the cookie
        res.clearCookie('token');
        res.clearCookie('user');

    
        res.redirect('/');
    } catch (error) {
       
        console.error(error);
        
    }
})

webUserRouter.get('/register', (req, res) => {
    res.render('register', { title: 'Register' })

});
export default webUserRouter;

