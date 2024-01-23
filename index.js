const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//Setting up databases
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

//Intialising middlewires
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.listen(3000, () => {
  console.log("Server on port 3000");
});

//root route
app.get("/", (req, res) => {
  res.send("Root is wroking fine");
});

//listing route
app.get("/listings", (req, res) => {
  Listing.find({}).then(listings => {
    res.render("./listings/index", { listings });
  });
});

//create new route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new");
});

//show route
app.get("/listings/:id", (req, res) => {
  let { id } = req.params;
  Listing.findById(id)
    .then(list => {
      res.render("./listings/show", { list });
    })
    .catch(err => {
      console.log(err);
    });
});

//create route
app.post("/listings", (req, res) => {
  Listing.insertMany([req.body])
    .then(result => {
      res.redirect("/listings");
    })
    .catch(err => {
      console.log(err);
    });
});

//update route

app.get("/listings/edit/:id", (req, res) => {
  let { id } = req.params;
  Listing.findById(id).then(list => {
    res.render("./listings/edit", { list });
  });
});

app.put("/listings/:id", (req, res) => {
  let { id } = req.params;
  Listing.findByIdAndUpdate(id, { ...req.body.listing })
    .then(result => {
      res.redirect("/listings");
    })
    .catch(err => {
      console.log(err);
    });
});

//DELETE ROUTE

app.delete("/listings/:id", (req, res) => {
  let { id } = req.params;
  Listing.findByIdAndDelete(id)
    .then(result => {
      res.redirect("/listings");
    })
    .catch(err => {
      console.log(err);
    });
});
