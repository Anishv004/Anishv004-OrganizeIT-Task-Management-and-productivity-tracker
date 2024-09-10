const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: [true, "Name of Tag is mandatory"]
    },
    priority: {
        type: String,
        required: [true, "Please assign a priority level"]
    }
});

const Tags = new mongoose.model("Tags", tagsSchema);
module.exports = Tags;