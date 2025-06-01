import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        requires: true
    },
    categoria:{
        type: Number,
        requires: true
    },
    precio:{
        type: Number,
        requires: true
    },
    stock:{
        type: Number,
        requires: true
    },
    descripcion: {
        type: String,
        requires: true
    },
    urlImage:{
        type: String,
        requires: true
    }

});

const Item = mongoose.model('Item', itemSchema)
export default Item;