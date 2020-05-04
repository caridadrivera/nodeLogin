if(process.env.NODE_ENV !== 'production') {
//this will log in all of our environment variables and set them inside process.env
    require('dotenv').config()
}


const express = require('express');
const app = express()
const bcrypt = require('bcrypt')
const passport  = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

//for the sake of simplicity. not connecting to db. using a users array to populate
const users = []


app.set('view-engine', 'ejs')

//telling our app to take the forms in html to make them available inside of our routes
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
//initialize function inside of passport that sets up basic functionality.
app.use(passport.initialize())
//this one persists all variables across all the sessions of a user
app.use(passport.session())
app.use(methodOverride('_method'))


app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name})
})


app.get('/login', checkNotAuthenticated, (req, res) =>{
    res.render('login.ejs')
})


/* I use the passport.authenticate middleware, pass the the local strategy and list
a number of things we want to modify at login */
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
 successRedirect: '/',
 failureRedirect: '/login',
 failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) =>{
    res.render('register.ejs')
})

app.post('/register',checkNotAuthenticated, async (req, res) =>{
    /*since we're not using a database, I will create the hashed password
    these things are generated at the database, but since I'm doing it here, I will create an async function and await for bcrypt to return my password*/
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
    /* pushing the user information to the users array with the safe password*/
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
    //if the user has successfully registered, I want to redirect the user to the login page
        res.redirect('/login')
    } catch {
    //if anything fails, redirect them back to register
        res.redirect('/register')
    }
})


app.delete('/logout', (req,res) => {
    req.logOut();
    res.redirect('/login')
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}





app.listen(3000)