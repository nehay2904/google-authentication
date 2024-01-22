const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    given_name: {
        type: String
    },
    email: {
        type: String
    },
    google_id: {
        type: String
    },
    dateField: {
        type: Date,
        default: Date.now,
        required: true,
        auto: true,
      }
})


// 

const userModel = mongoose.model("user_info", UserSchema)


module.exports = userModel;
