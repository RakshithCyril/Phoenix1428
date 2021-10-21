const dot = require('dotenv')
dot.config()
const express = require('express')
const app = express()
const User = require('./models/users')
const mongoose = require('mongoose')
const path = require('path')
const excelToJson = require('convert-excel-to-json');
const bcrypt = require('bcrypt')
const yards= require('./models/validate')
const methodOverride = require('method-override')
const appError = require('./appError')
const session = require('express-session')

    mongoose.connect('mongodb+srv://cyril:sS5dGq4D9UY4iag@testdb.k9yiz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/test',{
    dbName:'phoenix',
    user:'cyril',
    pass:'sS5dGq4D9UY4iag',
    useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() => {
        console.log('mongo Connected')
    })
    .catch(() => {
        console.log('Connection Error')
    })
    mongoose.set('useFindAndModify',false);
    
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'options')))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(session({secret:'changeit'}))
const requirelogin = (req,res,next)=>{
    if(!req.session.user_id){
        return res.redirect('login')
    }else{
        res.redirect('/allyards')
    }
    next()
 }

app.get('/',requirelogin ,(req,res)=>{
    res.redirect('/register')
})
app.get('/register',(req,res)=>{
    res.render('register')
})
app.post('/register',async (req,res)=>{
    const {password ,username,email,phone} = req.body
    const hash = await bcrypt.hash(password,12)
    const user = new User({
        user:username,
        password:hash,
        email:email,
        phone:phone,
    })
    await user.save()
    .then(dat =>{
        consol.log('done')
    }).catch(err =>{
        res.redirect('/allyards')
    })
    res.render('all_yards')

})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/login',async(req,res)=>{
    const {username,password} = req.body
    const user = await User.findOne({user:username})
    console.log(user)
    const validPass = await bcrypt.compare(password, user.password)
    console.log(validPass)
    if(validPass){
        req.session.user_id = user._id  
        res.redirect('/allyards')
    }else{
        res.send('error')
    }
   
})
app.get('/logout',(req,res)=>{
    res.redirect('/login')
})
app.post('/logout',(req,res)=>{
    req.session.user_id = null
    res.redirect('/login')
})

app.get('/allyards', async(req,res)=>{
    const test = await yards.find({},{'Yard_Name' :1 , '_id' : 1 })
    res.render('all_yards',{test})
})
app.get('/yards/:id', async(req,res,next)=>{
    const {id} = req.params
    const test = await yards.findById(id)
    if(!test){
      return next(new appError('yard cannot not found',404))
    }
    res.render('yard_details',{test})
})
app.get('/DNC/:id',async(req,res)=>{
    const {id} = req.params
    const test = await yards.findByIdAndUpdate(id)
    res.render('DNC',{test})
})
app.patch('/DNC/:id', async(req,res)=>{
    const {id} = req.params
    const update = await yards.findByIdAndUpdate(id,req.body,{runValidators:true , new:true})
    .then(()=>{
        console.log('done')
    })
    .catch(async()=>{
        const {id} = req.params
    const test = await yards.findById(id)
    res.render('yard_details',{test})
    })
})
app.get('/edit/:id',async(req,res)=>{
    const {id} = req.params
    const test = await yards.findById(id)   
    res.render("yard_edit",{test})
})
app.patch('/edit/:id',async(req,res,)=>{
    const {id} = req.params
    const update = await yards.findByIdAndUpdate(id,req.body,{runValidators:true , new:true})
    .then(()=>{
        console.log('done')
    })
    .catch(async()=>{
        const {id} = req.params
    const test = await yards.findById(id)
    res.render('yard_details',{test})
    })
})
app.use((err,req,res,next)=>{
    const {message = 'Something went wrong' ,status = 500} = err;
    res.status(status).render('error')
})
app.use((req,res)=>{
    res.status(404).render('not found')
})
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`connected to ${port}`)
})


