'use strict'

let router = require('express').Router()
let bodyparser = require('body-parser')
let cookieParser = require('cookie-parser')
let passport = require('passport')

router.use(cookieParser())

router.get('/', (req, resp, next)=>{
    resp.render('login',{'title':'Title'})
})
router.post('/', bodyparser.urlencoded({ extended: false }), (req, resp, next)=>{
    resp.render('login',{'title':'Title'})
})

module.exports = router