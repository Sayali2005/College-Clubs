const mongoose = require('mongoose');

// Define the schema for the event
const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventImages: {
        type : [String],
        default: [] 
    },
    detailedDescription: {
        type: String,
        required: true
    },
    clubId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the club model
        ref: 'Club', // Assuming there is a Club model in your system
        required: true
    }
});

// Create the Event model based on the schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
