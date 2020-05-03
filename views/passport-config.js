//to use the local version of passport
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail){
    const authenticateUser = (email, password, done) => {
       const user = getUserByEmail(email)
       if(user == null){
           return done(null, false, { message: "No user with that email"})
       }

       try { 
         if(await bcrypt.compare(password, user.password)){
            return done(null, user)
         } else {
             //return "null" for no error and false for user not found
             return done(null, false, {message: "{assword incorrect"})
         }
       } catch(e){
        return done(e)
       }
    }


    passport.use(new LocalStrategy({usernameField: 'email'}), 
    authenticateUser)
    passport.serializeUser((user,done) => {    })
    passport.deserializeUser((id, done)=> {    })
}

module.exports = initialize;