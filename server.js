const express = require('express');
const app = express()
const bcrypt = require('bcrypt')

//for the sake of simplicity. not connecting to db. using a users array to populate
const users = []


app.set('view-engine', 'ejs')
//telling our app to take the forms in html to make them available inside of our routes
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('index.ejs', {name: "Kyle"})
})

app.get('/login', (req, res) =>{
    res.render('login.ejs')
})

app.get('/login', (req, res)=>{

})

app.get('/register', (req, res) =>{
    res.render('register.ejs')
})

app.post('/register', async (req, res) =>{
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
    console.log(users)
})


app.listen(3000)