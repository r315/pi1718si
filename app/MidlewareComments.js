'use strict'

const router = require('express').Router()

const logger = (msg) => {console.log('Comments: ' + msg); return msg;}

router.get('/', (req,resp,next) => { 
    logger(req.baseUrl)    
    next() 
})


module.exports = router