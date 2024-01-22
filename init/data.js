const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/megaproject");
}

main()
  .then(res => {
    console.log("Connected");
  })
  .catch(err => {
    console.log(err);
  });


const rentalDataArray = [
  {
    title: "Cozy Apartment in the City Center",
    description: "Charming one-bedroom apartment with modern amenities.",
    image:
      "https://a0.muscache.com/im/pictures/miso/Hosting-1008372338753715795/original/bc2bde05-8764-4e0f-a6b0-a3e4d8c95270.jpeg?im_w=720",
    price: 1200,
    location: "City Center",
    country: "United States"
  },
  {
    title: "Spacious House with Garden View",
    description: "Beautiful three-bedroom house with a scenic garden view.",
    image:
      "https://a0.muscache.com/im/pictures/miso/Hosting-988223878398035237/original/c4797dab-fae4-44e2-af3e-081201ec0083.jpeg?im_w=720",
    price: 2500,
    location: "Suburbia",
    country: "Canada"
  },
  {
    title: "Luxurious Villa by the Beach",
    description: "Stunning five-bedroom villa with direct beach access.",
    image:
      "https://a0.muscache.com/im/pictures/miso/Hosting-979248094322509011/original/ba6db6f3-dedc-4810-9e6f-bf5d9344c4d5.jpeg?im_w=720",
    price: 5000,
    location: "Beachfront",
    country: "Spain"
  },
  {
    title: "Downtown Loft with City Skyline Views",
    description: "Modern loft apartment with breathtaking city skyline views.",
    image:
      "https://a0.muscache.com/im/pictures/miso/Hosting-1009185997788436885/original/70270f9d-d11e-423b-bd47-70214334c702.jpeg?im_w=720",
    price: 1800,
    location: "Downtown",
    country: "United Kingdom"
  },
  {
    title: "Mountain Retreat Cabin",
    description:
      "Cozy cabin nestled in the mountains, perfect for nature lovers.",
    image:
      "https://a0.muscache.com/im/pictures/miso/Hosting-973032311639221581/original/c532a3f2-b67c-49ec-8b68-ca926c93ef0f.jpeg?im_w=720",
    price: 1500,
    location: "Mountainside",
    country: "Switzerland"
  }
];

Listing.insertMany(rentalDataArray)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
