const mongoose = require("mongoose");
const schema = mongoose.Schema;

const newschema = new schema({
    title:{
        type: String,
        required: true // it means mongo will not accted a document without title
    },
    description: String,
    image: { 
        filename: String,
        url: String
    },
    price: Number,  // Also corrected the typo "prince" -> "price"
    location: String,
    country: String
});

//now exporrting
module.exports = mongoose.model("Listing", newschema);
