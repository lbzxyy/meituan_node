import mongoose from 'mongoose'
const Schema = mongoose.Schema

let City = new Schema({
  id: {
    type: String,
    require: true
  },
  value: {
    type: Array,
    require: true
  }
})