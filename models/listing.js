const mongoose = require("mongoose");
const schema = mongoose.Schema;

const newschema = new schema({
    title:{
        type: String,
        required: true // it means mongo will not accted a document without title
    },
    description: String,
    image:{ //for image if user did not give the image for air bnb we have a functionality to use default image  
        type :String,
        default : "https://images.app.goo.gl/HQRxunQEz2jRLCWT6" ,
        set : (v)=> v=== "" ? "https://images.app.goo.gl/HQRxunQEz2jRLCWT6" : v 
    },
    price: Number,  // Also corrected the typo "prince" -> "price"
    location: String,
    country: String
});

//now exporrting
module.exports = mongoose.model("Listing", newschema);
