API POST: localhost:8080/api/v1/property
Authorization : Bearer Token

Example FORM DATA
{
    "name" : "adpropxxx",
    "address" : "Some data",
    "eircode" : "Some data",
    "description" : "Some data",
    "postalCode" : "Dublin Code",
    "rent" : 600,
    "deposit" : 2000,
    "area" : 500,
    "availableFrom" : "2024-03-22",
    "energyRatings" : "A1",
    "bedrooms" : 4,
    "bathrooms" : 2,
    "amenities" : ["wifi", "tv", "parking"],
    "images" : ["link1", "link2", "link3"],
    "propertyType" : "apartment"
}