// import our dependencies, middleware and models 
const express = require('express')
const passport = require('passport')

// pull in our model
const Pet = require('../models/pet')

// helps us detect certain situations and send custom errors
const customErrors = require('../../lib/custom_errors')
// this function sends a 404 when non-existent document is requested
const handle404 = customErrors.handle404
// middleware that can send a 401 when a user tries to access something they do not own
const requireOwnership = customErrors.requireOwnership
// requireToken is passed as a second arg to router.<verb> 
// makes it so that a token MUST be passed for that route to be available --> also sets 'req.user'
const requireToken = passport.authenticate('bearer', { session: false })
// this middleware removes any blank fields from req.body
const removeBlanks = require('../../lib/remove_blank_fields')

// instantiate our router
const router = express.Router()

// ROUTES GO HERE

// INDEX
// GET /pets

router.get('/pets', (req, res, next) => {
    // we will allow access to view all the pets, by skipping 'requireToken'
    // if we wanted to make this a protect resource, we'd just need to add that middleware as the second arg to our get (like we did in create post)
    Pet.find()
        .populate('owner')
        .then(pets => {
            // pets will be an array of mongoose documents
            // so we want to turn them in POJO (plain ol' js objects)
            // remember that map returns a new array
            return pets.map(pet => pet.toObject())
        })
        .then(pets => res.status(200).json({ pets }))
        .catch(next)
})

// SHOW
//GET /pets/62446725d7a2d5782164d165

router.get('/pets/:id', (req, res, next) => {
    // we get the id from req.params.id -> :id
    Pet.findById(req.params.id)
        .then(handle404)
        // if its successful, respond with an object as json
       .then(pet => res.status(200).json({ pet: pet.toObject() }))
        // otherwise pass to error handler
        .catch(next)

})

// CREATE
// POST  /pets

router.post('/pets', requireToken, (req, res, next) => {
    // we brought in requireToken, so we can have access to req.user
    req.body.pet.owner = req.user.id

    Pet.create(req.body.pet)
        .then(pet => {
            // send a successful response like this
            res.status(201).json({ pet: pet.toObject() })
        })
        // if an error occurs, pass it to the error handler
        .catch(next)
})

// UPDATE
// REMOVE

// ROUTES ABOVE HERE

// keep at bottom of file
module.exports = router










