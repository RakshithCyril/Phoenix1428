const dot = require('dotenv')
dot.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const bcrypt = require('bcrypt')
const methodOverride = require('method-override')

    mongoose.connect('mongodb+srv://@testdb.k9yiz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/test',{
    dbName:process.env.dbname,
    user:process.env.user,
    pass:process.env.password,
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
app.use(session({secret:process.env.SESSION}))

const requirelogin = (req,res,next)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
    }
    next()
 }

app.get('',requirelogin ,(req,res)=>{
    res.redirect('/login')
})
app.get('',(req,res)=>{
    res.render('register')
})
app.post('',async (req,res)=>{
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
        console.log('done')
    }).catch(err =>{
        console.log("ERROR")
    }) 
    const login = await User.findOne({user:username})
    const validPass = await bcrypt.compare(password, user.password)
    if(validPass){
        req.session.user_id = user._id  
        res.redirect('/allyards')
    }else{
        res.redirect('/login')
    }
})
app.get('',(req,res)=>{ 
    if(!req.session.user_id ){
        res.render('login')
       
    }else{
        res.redirect('/allyards')
    }
})
app.post('',async(req,res)=>{
    const {username,password} = req.body
    const user = await User.findOne({user:username})
    const validPass = await bcrypt.compare(password, user.password)
    if(validPass){
        req.session.user_id = user._id  
        res.redirect('/allyards')
    }else{
        res.redirect('/login')
    }
   
})
app.get('',(req,res)=>{
    res.redirect('/login')
})
app.post('',(req,res)=>{
    req.session.user_id = null 
    return res.redirect('/login')
})

app.get('', requirelogin, async(req,res)=>{
        const test = await yards.find({},{'Yard_Name' :1 , '_id' : 1 })
        res.render('all_yards',{test})
})
app.get('', requirelogin,async(req,res,next)=>{
    const {id} = req.params
    const test = await yards.findById(id)
    res.render('yard_details',{test})
})
app.get('',requirelogin,async(req,res)=>{
    const {id} = req.params
    const test = await yards.findByIdAndUpdate(id)
    res.render('DNC',{test})
})
app.patch('',requirelogin, async(req,res)=>{
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
app.get('',requirelogin,async(req,res)=>{
    const {id} = req.params
    const test = await yards.findById(id)   
    res.render("yard_edit",{test})
})
app.patch('',requirelogin,async(req,res,)=>{
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
app.get('*', function(req, res){
    res.status(404).render('error');
  })
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`connected to ${port}`)
})
