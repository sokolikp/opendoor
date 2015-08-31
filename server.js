
var express = require('express');
var port = process.env.PORT || 8080;
var app = express();
var Lazy    = require("lazy");
var fs  = require("fs");
var Baby = require("babyparse");

var allListings = [];
var minBed=Number.MAX_VALUE, maxBed=Number.MAX_VALUE, minPrice=Number.MAX_VALUE;
var maxPrice=0, minBath=0, maxBath=0;

Lazy(fs.createReadStream('./listings.csv'))
  .lines
  .forEach(function(line){
    var newLine = line.toString().split(',');
    var info = {
      id: newLine[0],
      street: newLine[1],
      status: newLine[2],
      price: newLine[3],
      bedrooms: newLine[4],
      bathrooms: newLine[5],
      sq_ft: newLine[6],
      lat: newLine[7],
      lng: newLine[8]
    };
    if(info.bedrooms < minBed) {
      minBed = info.bedrooms;
    } else if(info.bedrooms > maxBed) {
      maxBed = info.bedrooms;
    }
    if(info.price < minPrice) {
      minPrice = info.price;
    } else if(info.price > maxPrice) {
      maxPrice = info.price;
    }
    if(info.bathrooms < minBath) {
      minBath = info.bathrooms;
    } else if(info.bathrooms > maxBath) {
      maxBath = info.bathrooms;
    }
    allListings.push(info);
  }
);


app.get('/listings', function(req, res) {
  console.log(req.query);
  // var params = req.query;
  var min_price = req.query.min_price || minPrice;
  var max_price = req.query.max_price || maxPrice;
  var min_bed = req.query.min_bed || minBed;
  var max_bed = req.query.max_bed || maxBed;
  var min_bath = req.query.min_bath || minBath;
  var max_bath = req.query.max_bath || maxBath;
  var results = allListings.filter(function(listing) {
    // console.log(listing.price, listing.bathrooms, listing.bedrooms);
    // console.log(min_price, max_price, min_bed, max_bed, min_bath, max_bath);
    return (listing.price >= min_price && listing.price <= max_price)
       &&  (listing.bathrooms >= min_bath && listing.bathrooms <= max_bath)
       &&  (listing.bedrooms >= min_bed && listing.bedrooms <= max_bed);
  });
  res.status(200).send(results);
});

app.listen(port);

console.log('Server now listening on port ' + port);

module.exports = app;
