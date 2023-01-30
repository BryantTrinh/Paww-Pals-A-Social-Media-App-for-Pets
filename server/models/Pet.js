const { Schema, model } = require("mongoose");

const petSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  species: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  pictures: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Pet", petSchema);
