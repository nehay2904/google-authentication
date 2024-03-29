// importing the requirements

const express = require('express')
const app = express()
app.use(express.json())
const session = require('express-session')
const passport = require('passport')

const OAuthStrategy = require('passport-google-oauth2')
const userModel = require('./User')

const mongoose = require("mongoose")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const cors = require('cors')
app.use(cors({
  origin:"https://65b51a971cb913a2fce8c389--phenomenal-axolotl-9b72d3.netlify.app/",
  methods:"GET, POST, PUT, DELETE",
  credentials:true
}))

require('dotenv').config();


const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const CLIENTID = process.env.CLIENTID;
const CLIENTSECRET  = process.env.CLIENTSECRET;
//connection of mongoose
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('connection is success')
}).catch((err) => {
  console.log(err)
})


app.use(session({
  secret:"040702",
  resave:false,
  saveUninitialized:true
}))

app.use(passport.initialize())
app.use(passport.session())
//  PASSPORT
passport.use(
  new OAuthStrategy({
      clientID : CLIENTID,
      clientSecret : CLIENTSECRET,
      callbackURL :"/auth/google/callback",
      scope: ['profile', 'email']
  },
  async(accessToken, refreshToken, profile, done)=>{
    console.log('profile',profile)
    try {
       let user = await userModel.findOne({google_id:profile.id})
             if(!user){
                user = new userModel({
                  google_id :profile.id,
                  given_name:profile.given_name,
                  email : profile.email
                });

                await user.save();
             }


             return done(null, user)
      } catch (error) {
       return done(error, null)
    }
  })
)



passport.serializeUser((user,done) =>{
  done(null, user)
})
passport.deserializeUser((user,done) =>{
  done(null, user)
})

app.get('/auth/google', passport.authenticate("google", {scope:['profile', 'email']}))

app.get('/auth/google/callback',passport.authenticate("google",{
  successRedirect:"https://65b51a971cb913a2fce8c389--phenomenal-axolotl-9b72d3.netlify.app/",
  failureRedirect:"https://65b51a971cb913a2fce8c389--phenomenal-axolotl-9b72d3.netlify.app/"
}))

app.get("/login/success", (req,res) =>{
  if(req.user){
    res.status(200).json({message:"user is logged in", user:req.user})
  }else{
    res.status(400).json({message:"user is not authorized"})

  }
})
// 
app.get('/', (req, res) => {
  res.send("hello world")
})

app.listen(PORT, (req, res) => {
  console.log(`server is responding on ${PORT}`)
})