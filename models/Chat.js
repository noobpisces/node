const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    contents :[{
        content:{
            type: String
        },
        author:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        at: {
            type: Date,
            default: Date.now
        }

    }],
     
 
});


module.exports = mongoose.model('Chat', chatSchema);