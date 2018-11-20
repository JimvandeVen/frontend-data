// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
// const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1IjoiamltdmFuZGV2ZW4iLCJhIjoiY2pvNzZmZmtzMG9jMTN2bzFmcG12MHlrZiJ9.WRiELqCFy3TaCQAWaXxSHA' })

const fs = require('fs')
const d3 = require("d3")
var rawData = require("./rawData.json")

require('dotenv').config()
let books = []
rawData.forEach(function(book){
  let bookObject = makeBookObject(book)
    books.push(bookObject)
})

let filteredBooks = books.filter(book =>{
  return book !== undefined
})

let newData = placeObjectMaker(filteredBooks)
fs.writeFile(
  './src/data.json',
  JSON.stringify(newData),
  'utf8',
  err => console.error('write file kan niet', err)
)
// console.log(filteredBooks)
// let placeObjects = placeObjectMaker(books)
    // fs.writeFile(
    //   './src/data.json',
    //   JSON.stringify(placeObjects),
    //   'utf8',
    //   err => console.error('write file kan niet', err)
    // )


function makeBookObject(book) {
  let publisherPlace = typeof book.publication.place == undefined ? "Geen plaats van uitgave" : book.publication.place
  let publisherYear = typeof book.publication.year == undefined  ? "Geen jaar van uitgave" : book.publication.year

  let year = []
  let place = []

  if (publisherPlace != "Geen plaats van uitgave" && publisherYear != "Geen jaar van uitgave"){
    if (publisherPlace != undefined && publisherPlace.endsWith(" [etc.]")){
      place.push(publisherPlace.slice(0,-7))
    } else if (publisherPlace != undefined && publisherPlace.endsWith(" [etc.].")){
      place.push(publisherPlace.slice(1, -8))
    } else if (publisherPlace != undefined && publisherPlace.startsWith("[") && publisherPlace.endsWith("]")){
      place.push(publisherPlace.slice(1, -1))
    } else if(publisherPlace != undefined && publisherPlace.startsWith("[")){
      place.push(publisherPlace.slice(1))
    } else if(publisherPlace != undefined){
      place.push(publisherPlace)
    }
    if (publisherYear != undefined && publisherYear.startsWith("[") && publisherYear.endsWith("]")){
      year.push(publisherYear.slice(1, -1))
    }else if (publisherYear != undefined && publisherYear.includes("cm")) {
      year.push(publisherYear.slice(0,4))
    }else if (publisherYear != undefined && publisherYear.includes("-")) {
      year.push(publisherYear.slice(-4))
    }else if (publisherYear != undefined) {
      year.push(publisherYear.slice(0,4))
    }
  }
  bookObject = {
    place: place[0],
    year: Number(year[0]),
  }
  if (bookObject.place != undefined && bookObject.year != undefined && bookObject != undefined ){
    return bookObject
  }

}

function placeObjectMaker(filteredBooks){
  let data = d3.nest()
    .key(filteredBook => filteredBook.place)
    .entries(filteredBooks)
  return data.map(item => {
      return {
        place: item.key,
        bookCount: item.values.length,
        books: {
          "1950": filteredBooks.filter(book => book.place == item.key && book.year < 1950),
          "19501960": filteredBooks.filter(book => book.place == item.key && 1960 > book.year && 1950 <= book.year),
          "19601970": filteredBooks.filter(book => book.place == item.key && 1970 > book.year && 1960 <= book.year),
          "19701980": filteredBooks.filter(book => book.place == item.key && 1980 > book.year && 1970 <= book.year),
          "19801990": filteredBooks.filter(book => book.place == item.key && 1990 > book.year && 1980 <= book.year),
          "19902000": filteredBooks.filter(book => book.place == item.key && 2000 > book.year && 1990 <= book.year),
          "20002010": filteredBooks.filter(book => book.place == item.key && 2010 > book.year && 2000 <= book.year),
          "2010": filteredBooks.filter(book => book.place == item.key && 2010 <= book.year),
        }
      }
    })
}

// function coordinateGetter(data){
//
//   data.map(city =>{
//     geocodingClient
//         .forwardGeocode({
//           query: city.place,
//           limit: 1
//         })
//         .send()
//         .then(response => {
//             // match is a GeoJSON document with geocoding matches
//           coordinates.push(response.body.features[0].center)
//           console.log(coordinates)
//         })
//         .catch(err => {
//           if (err.response) {
//             console.log(err.response.status, err.response.statusText)
//           } else {
//             console.log(err)
//           }
//         })
//     })
//   // return coordinates
// }

// let coordinates = []
