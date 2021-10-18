const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
   
 Yard_Name:String,
    address:{
    type:mongoose.Schema.Types.Mixed,
     },
    city:{
        type:mongoose.Schema.Types.Mixed,
    },
    state:String,
    ZIP:{
    type:mongoose.Schema.Types.Mixed,     
    },
    Contact:{
    type:mongoose.Schema.Types.Mixed,
    default:' ',
    },
    Phone:{
    type:mongoose.Schema.Types.Mixed,
    default:' ',
    },
    FAX:{
        type:mongoose.Schema.Types.Mixed,
        default:' '
    },
    Email:{
        type:mongoose.Schema.Types.Mixed,
        default:' '
    },
    DNC:{
        type:mongoose.Schema.Types.Mixed,
        default:' '
    },
    Warranty:{
        type:mongoose.Schema.Types.Mixed,
        default:' '
    },
    Rating:{
        type:Number,
        default:' '
    },
    Reviews:{
        type:mongoose.Schema.Types.Mixed,
    },
})
const yards = mongoose.model('yards',productSchema)  

module.exports = yards;