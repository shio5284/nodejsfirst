var express = require("express");
var multer = require("multer");
var crypto = require("crypto");
var path = require ("path");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var Post = require("../../models/post");

var router =express.Router();

var storage = multer.diskStorage({
  destination:'./uploads/images/', 

  filename:function(req,file,cb){
    crypto.pseudoRandomBytes(16,function(err,raw){
    cb(null,raw.toString('hex') + Date.now()+ path.extname(file.originalname));
 
  });
}

})

var upload = multer({storage:storage})

router.get("/", async (req, res) => {
    try {
        const search = (req.query.search || "").trim();

        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { model: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }

        const cars = await Car.find(filter)
            .sort({ createdAt: -1 })
            .limit(50);

        res.render("index", {
            cars,
            search
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error searching for cars.");
    }
});

router.get("/cars/:id", async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).send("Car not found.");
        }

        res.render("details", { car });

    } catch (error) {
        res.status(400).send("Invalid car listing.");
    }
});







module.exports = router;