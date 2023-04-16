import { Schema, model } from 'mongoose';

let itemSchema = new Schema({
    name: String,
    price: Number
});

export default Item = model('Item', itemSchema);