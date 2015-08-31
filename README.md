# opendoor

##The API

This repo builds the API end-point to filter property listings by price, number of bedrooms, and number of bathrooms. The API exists at http://secret-coast-1480.herokuapp.com with end-point /listings. Example GET request with parameters can be found below.

```GET /listings?min_price=100000&max_price=200000&min_bed=2&max_bed=2&min_bath=2&max_bath=2```

min_price: The minimum listing price in dollars.

max_price: The maximum listing price in dollars.

min_bed: The minimum number of bedrooms.

max_bed: The maximum number of bedrooms.

min_bath: The minimum number of bathrooms.

max_bath: The maximum number of bathrooms.

The response is a [GeoJSON](http://geojson.io) object in the form:

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "feature",
      "geometry": {"type": "Point", "coordinates"},
      "properties": {
  "id": "123ABC", # CSV id
  "price": 200000, # Price in Dollars
  "street": "123 Walnut St",
        "bedrooms": 3, # Bedrooms
        "bathrooms": 2, # Bathrooms
        "sq_ft": 1500 # Square Footage
    },
    ...
  ]
}
```

##Getting Started

Install [node](https://nodejs.org/) if you don't already have it.

```
npm install
npm start
```

Served on port 8080

##Future Improvements

If this project were to scale into something larger, I would certainly want to add a database with a schema that would help with fast queries. For the provided dataset a MongoDB schema could work, and it would provide quick lookups and filtering. If more columns were added, I would likely consider a relational schema to help with the table complexity. Adding a simple database would prevent the need to loop through all records at each request to the API to filter the results. A simple query would be written that would provide faster lookups and reduce computation on the server. As the dataset grows, looping through each record is not an elegant solution. Currently, all records are held in memory in an object/hash table.

Another improvement would be to modularize the server file into different helper and utility functions as new end-points are added. The dataset is rather simple now, but if I wanted more filter options or end points that gave additional information, it would be nice to separate the logic. This would also add closure to variables that are currently in the global server scope.
