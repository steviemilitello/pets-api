// import our dependencies, middleware and models 

const express = require('express')
const passport = require('passport')
const Pet = require('../models/pet')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')
const { findById } = require('../models/pet')
const router = express.Router()

// ROUTES GO HERE

// POST -> create a toy
//  POST /toys/<pet_id>

router.post('/toys/:petId', (req, res, next) => {
    // get our toy from req.body
    const toy = req.body.toy
    // get our petId from req.params.id
    const petId = req.params.petId 
    // find the pet 
    Pet.findById(petId)
        // handle what happens if no pet is found
        .then(handle404)
        .then(pet => {
            console.log('this is the pet', pet)
            console.log('this is the toy', toy)
             // push the toy to the toys array
             pet.toys.push(toy)

            // save the pet
             return pet.save()
        })
        // then we send the pet as json
        .then(pet => res.status(201).json({ pet: pet }))
        // catch errors and send to the handler
        .catch(next)
})

// PATCH -> to update a toy
// PATCH -> /toys/<pet_id>/<toy_id>

// DELETE -> to delete a toy
// DELETE -> /toys/<pet_id>/<toy_id>
router.delete('/toys/:petId/:toyId', requireToken, (req, res, next) => {
    // saving both ids to variables for easy ref later 
    const toyId = req.params.toyId
    const petId = req.params.petId
    // find the pet in db
    Pet.findById(petId)
        // if pet not found throw 404
        .then(handle404)
        .then(pet => {
            // get the specific subdocument by its id
            const theToy = pet.toys.id(toyId)
            // require that the deleter is the owner of the pet
            requireOwnership(req, pet)
            // call remove on the toy we got on the line above requireOwnership
            theToy.remove()

            // return the saved pet
            return pet.save()
        })
        // send 204 no content
        .then(() => res.sendStatus(204))
        .catch(next)
})

module.exports = router