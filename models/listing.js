const mongoose = require("mongoose");
const Reviews = require("./reviews.js");

const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxLength: 150
  },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYxCT-DFuo1EHQbG30Q97GjQ6I8Skh1t3Q-w&usqp=CAU",
    set: v =>
      v == ""
        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYxCT-DFuo1EHQbG30Q97GjQ6I8Skh1t3Q-w&usqp=CAU"
        : v
  },
  price: {
    type: Number,
    min: 1
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews"
    }
  ]
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
