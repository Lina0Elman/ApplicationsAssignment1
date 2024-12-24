const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: String,
    owner: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User',
        required: true 
    },
}, { strict: true });


postSchema.set('toJSON', {
    transform: (doc, ret) => {
        return {
            id: ret._id,
            title: ret.title,
            content: ret.content,
            owner: ret.owner
        };
    }
});

const postModel = mongoose.model("Posts", postSchema);



module.exports = postModel;