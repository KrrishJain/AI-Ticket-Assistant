import mongoose from 'mongoose';

const ticketScehema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        default: "TODO"
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    priority: String,
    deadline: Date,
    helpfulNotes: String,
    realtedSkills: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Ticket", ticketScehema)