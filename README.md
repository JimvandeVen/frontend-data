# Frontend-data
## [DEMO](https://vibrant-carson-b5e193.netlify.com/)

![Screenshot](/images/screenshot.png) 

## Introduction
In this project I am working together with the Openbare Bibliotheek Amsterdam(OBA). I am using data that was scraped by [maanlamp](https://github.com/maanlamp). In his connection with the dataset he was able to take approximately 5000 books. The visualisation I made represents the different books and the place where they were published 

## Table of content

* [Installation](#Installation)
* [Used data](#Used-data)
* [My concept and process](#My-concept-and-process)
* [Cleaning the data](#Cleaning-the-data)
* [Creating the graph](#Creating-the-graph)
* [Updating the graph](#Updating-the-graph)
* [What I learned](#What-I-learned)
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

## Used data

In this visualisation I use the data of 5000 books that are in the OBA. From this data I use the publication year and the city of publication.

## My concept and process

In the drawing below you can see what my early concept is of my data visualisation. I have to first learn about d3 before I make too many assumptions in the design. Even so, this is roughly my vision in the design. I am still debating about foreign books.
![Early Drawing](/images/early_drawing.jpg)  
After seeing the project of [Leon van Zijl](https://github.com/LeonvanZijl/fe3-assessment-3) I decided the best way forward was to get to know mapbox. I was, to my regret, sick for a couple of days. Because of this I had to rethink my planning for the few fays I had left. In the wireframe below you can see what my somewhat less ambitious plans. I will be showing the place of publication af all the books as well as filtered by decade. I found out while working on the d3 aspects of the graph that the lower numbers were quite hard to read. So I decided to include a zoom functionality that lets you adjust the x-axis.
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
In this function I use d3 to create the dataset needed for my graph.  For each entry of `filteredBooks` I return an object with the place, the total books and the books per decade. I engineered it in such a way that in my d3 functions I get the `value.length` of the different decades to create the width of my bars.

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

## Creating the graph

In this piece of code I create the graph with the cleaned data. Because I want the user to be able to filter the books in the different decades I use `getSelectedYear()` to get the value from the dropdown selector. I `append()` all the things I need for my graph When I call `createGraph()`. Included are the graph, the bars, the axis, the text inside the bars and the text next to the axis. Also I Sort the data so that the graph looks a bit nicer.

``` js
d3.json("../src/data.json").then(function(data){
  window.data = data
  createGraph(data)
})

let margin = {
  top: 100,
  right: 20 ,
  bottom: 0,
  left: 150
}

let width = 1800 - margin.left - margin.right
let height = 3000 - margin.top - margin.bottom

function createGraph(data){

  let sortedData = data.sort(function (a, b) {
  return b.bookCount- a.bookCount;
  })

  let svg = d3.select("#chart")
    .append("svg")
    .attr("width", `${width}`)
    .attr("height", `${height}`)

  let x = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.books[getSelectedYear()].length)])
    .range([margin.left, width - margin.right])

  let y = d3.scaleBand()
    	.domain(sortedData.map(d => d.place))
      .range([margin.top, height - margin.bottom])
      .padding(0.01)

  let xAxis = g => g
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(width/80))
    .call(g => g.select(".domain").remove())

  let yAxis = g => g
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))

  svg.append("g")
    .attr("class", "graph")
    .selectAll("rect")
    .data(data)
    .enter().append("rect")
      .attr("x", x(0))
      .attr("rx", 4)
      .attr("y", d => y(d.place))
      .transition()
      .duration(1000)
      .attr("width", d => x(d.books[getSelectedYear()].length) - x(0))
      .attr("height", y.bandwidth())
      .attr("fill", "#008B8B")

  svg.append("g")
    .attr("class", "text")
    .attr("fill", "white")
    .attr("text-anchor", "end")
    .style("font", "12px sans-serif")
    .selectAll("text")
    .data(data)
    .enter().append("text")
      .attr("x", d => x(d.books[getSelectedYear()].length) - 4)
      .attr("y", d => y(d.place) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d.books[getSelectedYear()].length)

  svg.append("g")
      .attr("class", "xAxis")
      .call(xAxis)

  svg.append("text")
      .attr("x", d3.max(sortedData, d => d.books[getSelectedYear()].length))
      .attr("y", 50 )
      .style("text-anchor", "middle")
      .text("Aantal boeken");

  svg.append("g")
      .attr("class", "yAxis")
      .call(yAxis)

  svg.append("text")
      .text("Steden")
      .attr("transform", "translate(50,300) rotate(270)")

}

function getSelectedYear(){
  return document.querySelector("#yearsSelector").value
}
```
## Updating the graph

In this function I update the graph. I call this function in an eventlistner that passes on the value of the event and the data needed. `updateGraph` works pretty much the same way as `createGraph`. It checks what the value of the selector and selects the data that corresponds with the selection. I have a similar function `rescale`. The only real difference is that it checks whether the value of the slider is lower than the width of a bar. If so it will remove that bar from the graph to increase readability of the graph.

``` js
function updateGraph(data, value){

  let sortedData = data.sort(function (a, b) {
    return b.bookCount- a.bookCount;
  })

  let x = d3.scaleLinear()
    .domain([0, value])
    .range([margin.left, width - margin.right])

  let xAxis = g => g
    .call(d3.axisTop(x).ticks(width/80))
    .call(g => g.select(".domain").remove())

  let y = d3.scaleBand()
      .domain(sortedData.map(d => d.place))
      .range([margin.top, height - margin.bottom])
      .padding(0.01)

  let yAxis = g => g
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))

  let text = d3.select(".text")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .style("font", "12px sans-serif")
      .selectAll("text")
      .data(data)

  let graph = d3.select(".graph")
      .selectAll("rect")
      .data(data)

  text.transition()
      .duration(500)
      .attr("x", d => x(d.books[getSelectedYear()].length) - 4)
      .attr("y", d => y(d.place) + y.bandwidth() / 2)
      .text(d => d.books[getSelectedYear()].length)

  text.exit()
      .remove()

  graph.selectAll("rect")
      .attr("width", d => {
        if (value > d.books[getSelectedYear()].length){
          return x(d.books[getSelectedYear()].length) - x(0)
        }
      })

  graph.transition()
      .duration(500)
      .attr("width", d => x(d.books[getSelectedYear()].length) - x(0))

  graph.exit()
      .remove()

  d3.select(".xAxis")
      .call(xAxis)
}
```

## What I learned

I learned a lot about data cleaning with and without d3. Also d3.

* `d3.entries(object)` Returns an array containing the property keys and values of the specified object. Each entry is an object with a key and value attribute.
* `d3.map([object[, key]])` Creates a new nest operator.
* `nest.key(key)` Registers a new key function. The key function will be invoked for each element in the input array and must return a string identifier to assign the element to its group.
* `nest.entries(array)` Applies the nest operator to the specified array, returning an array of key-values entries.
* `d3.select(selector)` Selects the first element that matches the specified selector string.
* `selection.attr(name[, value])` Used to set attributes with the specified name on the selected element (bars, axis, etc.).
* `selection.style(name[, value[, priority]])` Adds style to the selected element (width, color, font-size, etc.).
* `selection.append(type)` Appends a new element of the given type.
* `selection.remove()` Removes the selected elements.
* `selection.data([data[, key]])` Joins the data with the selected elements.
* `selection.enter()` Used to create elements for the data that has no elements.
* `selection.exit()` Used to remove elements for which there is no data, or old data.

## Still to do

- [ ] Plot my data on a map using mapbox
- [ ] Run d3 on a server in my local host
- [ ] Refractor my data a bit more
- [ ] Use the d3 event handlers (`selection.on(typenames[, listener[, options]])`) instead if my own eventhandlers in plain js.
