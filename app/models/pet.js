// PET -> has many toys & has owner that is user

const mongoose = require('mongoose')

const toySchema = require('./toy')

const { Schema, model } = mongoose

const petSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        adoptable: {
            type: Boolean,
            required: true
        },
        toys: [toySchema],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }

    }, {
        timestamps: true,
        // we're going to add virtuals to our model
        // these lines ensure that the virtual will be included
        // whenever we turn our document to an object or JSON
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)

// virtuals go here(we'll build these later)
// a virtual is a virtual property, that use the data that's saved in the database to add a property whenever we retrieve that document and convert it to an object
petSchema.virtual('fullTitle').get(function () {
    // we can do whatever javascript things we want in here
    // we just to make sure we return some value
    // fullTitle is going to combine the name and type to build a title
    return `${this.name} the ${this.type}`
})

petSchema.virtual('isABaby').get(function() {
    if (this.age < 5) {
        return 'yeah theyre just a baby'
    } else if (this.age >= 5 && this.age < 10) {
        return 'not really a baby, but still a baby'
    } else {
        return 'a good ol pet (definitely still a baby)'
    }
})

module.exports = model('Pet', petSchema)