# frontend-data
## [DEMO](https://vibrant-carson-b5e193.netlify.com/)  

## Introduction
In this project I am working together with the Openbare Bibliotheek Amsterdam(OBA). I am using data that was scraped by [maanlamp](https://github.com/maanlamp). In his connection with the dataset he was able to take aproximately 5000 books. 

## Table of content

* [Visualisation](#visualisation)
* [Exploring the API](#exploring-the-api)
* [Research question](#research-question)
* [Early drawings of the visualisation](#early-drawings-of-the-visualisation)
* [Process](#process)
* [Still to do](#still-to-do)
* [Visualisation](#visualisation)
* [Exploring the API](#exploring-the-api)
* [Research question](#research-question)
* [Early drawings of the visualisation](#early-drawings-of-the-visualisation)
* [Process](#process)
* [Still to do](#still-to-do)  

## Installation

1 Open terminal  
2 cd to the map where you will save the project  
3 Run `git clone https://github.com/JimvandeVen/frontend-data.git`  
4 Run `cd /frontend-data`
5 Run `npm install` Install dependencies  
6 Run `npm run build` build and minify static files  
7 Run `http-server &` runs server on `http://127.0.0.1:8080`  
6 have fun :) 

## My concept and proces

In the drawing below you can see what my early concept is of my data visualisation. I have to first learn about d3 before I make too many assumptions in the design. Even so, this is roughly my vision in the design. I am still debating about foreign books.
![Early Drawing](/images/early_drawing.jpg)  
After seeing the project of [Leon van Zijl](https://github.com/LeonvanZijl/fe3-assessment-3) I decided the best way forward was to get to know mapbox. I was, to my regret, sick for a couple of days. Because of this I had to rethink my planning for the few fays I had left. In the wireframe below you can see what my somewhat less ambitious plans. I will be showing the place of publication af all the books as well as filtered by decenium. I found out while working on the d3 aspects of the graph that the lower numbers were quite hard to read. So I decided to include a zoom functionality that lets you adjust the x-axis.
![Wireframe](/images/schets.jpg) 

## Cleaning the data

Here I load in the raw data and for each book create an object in the `makeBookObject` function that I push in an array.
``` js
let books = []
rawData.forEach(function(book){
  let bookObject = makeBookObject(book)
    books.push(bookObject)
})
```

This is the `makeBookObject` function where I take the desired data and make it into a manageable object. I remove all the dirty bits from the data.

``` js 
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
```
In this function I use d3 to create the dataset needed for my graph. I engineered it in such a way that in my d3 functions I get the value.length of the different decades to create the width of my bars

``` js 
function placeObjectMaker(filteredBooks){
  let data = d3.nest()
    .key(filteredBook => filteredBook.place)
    .entries(filteredBooks)
  return data.map(item => {
      return {
        place: item.key,
        bookCount: item.values.length,
        books: {
          all: item.values,
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
```

## Early drawings of the visualisation

