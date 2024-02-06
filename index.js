const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schemaValidation.js");
const { reviewSchema } = require("./schemaValidation.js");
const Review = require("./models/reviews.js");
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
app.engine("ejs", ejsMate);

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      401,
      error.details[0].message.split(".")[1].split('"').join("").toUpperCase()
    );
  } else {
    next();
  }
};
const validateReviews = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      401,
      error.details[0].message.split(".")[1].split('"').join("").toUpperCase()
    );
  } else {
    next();
  }
};

//root route
app.get("/", (req, res) => {
  res.send("Root is wroking fine");
});

//listing route
app.get("/listings", (req, res) => {
  Listing.find({})
    .then(listings => {
      res.render("./listings/index", { listings });
    })
    .catch(err => {
      next(new ExpressError(500, "Server Connection Failed -_-"));
    });
});

//create new route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new");
});

//show route
app.get("/listings/:id", (req, res) => {
  let { id } = req.params;
  if (!id) {
    throw new ExpressError(400, "Provide valid data");
  }
  Listing.findById(id)
    .then(list => {
      res.render("./listings/show", { card: list });
    })
    .catch(err => {
      next(new ExpressError(401, "No user found"));
    });
});

//create route
app.post(
  "/listings",
  validateListing,
  /*
  wrapAsync(async (req, res, next) => {
    await Listing.insertMany([req.body]);
    res.redirect("/listings");
  })
  */
  (req, res, next) => {
    Listing.insertMany([req.body.listing])
      .then(result => {
        res.redirect("/listings");
      })
      .catch(err => {
        next(new ExpressError(400, `Be sure to fill up the form properly`));
      });
  }
);

//update route

app.get("/listings/edit/:id", (req, res, next) => {
  let { id } = req.params;
  if (!id) {
    next(new ExpressError(400, "No valid info"));
  }
  Listing.findById(id)
    .then(list => {
      res.render("./listings/edit", { list });
    })
    .catch(err => {
      next(err);
    });
});

app.put("/listings/:id", validateListing, (req, res, next) => {
  let { id } = req.params;
  if (!id) {
    next(new ExpressError(400, "Please provide some information about user"));
  }
  Listing.findByIdAndUpdate(id, { ...req.body.listing })
    .then(result => {
      res.redirect("/listings");
    })
    .catch(err => {
      next(
        new ExpressError(400, "Changes failed, check form before submitting")
      );
    });
});

//DELETE ROUTE

app.delete("/listings/:id", (req, res, next) => {
  let { id } = req.params;
  if (!id) {
    next(new ExpressError(400, "Please provide some information about user"));
  }
  Listing.findByIdAndDelete(id)
    .then(result => {
      res.redirect("/listings");
    })
    .catch(err => {
      next(new ExpressError(400, "Bad request, please try again"));
    });
});

//reviews ROUTE

app.post("/listings/:id/reviews", validateReviews, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${req.params.id}`);
});

app.get("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 501, message = "Unknown Error" } = err;
  res.status(status).render("./listings/error", { status, message });
});

app.listen(3000, () => {
  console.log("Server on port 3000");
});
