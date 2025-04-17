const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    clubName: {
        type: String,
        required: true,
    },
    clubDescription: {      
        type: String,
        required: true,
    },
    clubImages: {
        type: [String],
        default: [] 
    },
    branch: {
        type: String,
        required: true
    },
    studentCoordinators: [
        {
            name: { type: String },
            role: { type: String }
        }
    ],
    facultyCoordinators: [
        {
            name: { type: String },
            role: { type: String }
        }
    ],
    contactEmail: {
        type: String
    },
    contactPhone: {
        type: Number
    },
    created_at: {
        type: Date,
        required: true,
    },
});

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
