
var express = require('express');
var port = process.env.PORT || 8080;
var app = express();
var Lazy    = require("lazy");
var fs  = require("fs");
var Baby = require("babyparse");

var allListings = [];
var minBed=Number.MAX_VALUE, minBath=Number.MAX_VALUE, minPrice=Number.MAX_VALUE;
var maxBed=0, maxBath=0, maxPrice=0;

Lazy(fs.createReadStream('./listings.csv'))
  .lines
  .forEach(function(line){
    var newLine = line.toString().split(',');
    var info = {
      id: Number(newLine[0]),
      street: newLine[1],
      status: newLine[2],
      price: Number(newLine[3]),
      bedrooms: Number(newLine[4]),
      bathrooms: Number(newLine[5]),
      sq_ft: Number(newLine[6]),
      lat: Number(newLine[7]),
      lng: Number(newLine[8])
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
  // console.log('bed:', minBed, maxBed, 'bath:', minBath, maxBath, 'price:', minPrice, maxPrice);

  var GeoJSON = {"type": "FeatureCollection", features: []};
  var min_price = req.query.min_price || minPrice;
  var max_price = req.query.max_price || maxPrice;
  var min_bed = req.query.min_bed || minBed;
  var max_bed = req.query.max_bed || maxBed;
  var min_bath = req.query.min_bath || minBath;
  var max_bath = req.query.max_bath || maxBath;

  allListings.forEach(function(listing) {
    if ((listing.price >= min_price && listing.price <= max_price)
    &&  (listing.bathrooms >= min_bath && listing.bathrooms <= max_bath)
    &&  (listing.bedrooms >= min_bed && listing.bedrooms <= max_bed)) {
      var listingInfo = {
        type: "Feature",
        geometry: {"type": "Point", "coordinates": [listing.lat, listing.lng]},
        properties: {
          "id": listing.id, 
          "price": listing.price,
          "street": listing.street,
          "bedrooms": listing.bedrooms,
          "bathrooms": listing.bathrooms,
          "sq_ft": listing.sq_ft
        }
      }
      GeoJSON.features.push(listingInfo);
    }
  });

  res.status(200).send(GeoJSON);
});

app.listen(port);

console.log('Server now listening on port ' + port);

module.exports = app;
