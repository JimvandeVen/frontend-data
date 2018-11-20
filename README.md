# functional-programming
## Introduction
In this project I am working together with the Openbare Bibliotheek Amsterdam(OBA). I am using the oba [API](https://github.com/rijkvanzanten/node-oba-api) made by Rijk van Zanten. In the end I will be making an interactive data visualization with the data provided by the API. I am meant to write the code in, as much as possible, functional programming.
## Exploring the API
First I was looking at the API an what data is provided with several different queries. This was quite alot of data, to be honest. Too much to compress into a data visualisation. So I had to narrow the search. I started looking at the different results that are returned for each book. Here are some examples:  
```
id
detail-page
coverimages
  coverimage
titles 
  title 
  short-title 
  other-title
authors 
  main-author
  author 
formats 
  format
identifiers
  isbn-id
  ppn-id
publication 
  year
  publishers
    publisher
    place
    edition 
languages
  language
subjects
  topical-subject 
  genres 
  genre 
description 
  physical-description
summaries 
  summary
notes 
  note
target-audiences 
  target-audience
```

After seeing all the different results I started thinking what might be interesting for me to research.

## Research question
What seemed interesting to me was place where books were published i.e. the place the books were from. Also because this would make for an interesting visualization, making a map light up in the place where the books are more frequently published. I decided this would be better to plot with a single holding(OBA location) in mind. My question will thus be:
### Where were the books currently in the OBA Oosterdok holding published?
With this question in mind I wrote a couple of sub questions:
- [x] How will I get only the publisher information? 
- [x] How will I handle books without any or with multiple places?
- [ ] How will I clean up the values of the places if they are impure?
- [ ] How will I calculate and store the times a book has been published in a certain city?
- [ ] How will i scale this prototype to work with every book in a OBA holding?
- [ ] How will the visualisation actually look?
- [ ] What extra knowledge can be obtained from this data?
- [ ] What will the interactive part be in this visualisation?
```js
const client = new OBA({
  public: process.env.PUBLIC,
  secret: process.env.SECRET
})
let books = []
client.get('search', {
    q: 'H',
    sort: 'title',
    refine: true,
    branch: 'OBA Oosterdok'

  })
  .then(results =>
    JSON.parse(results).aquabrowser.results.result.forEach(function(book) {
      makeBookObject(book)
    })
  )
  .catch(err => console.log(err))
 function makeBookObject(book) {
  let publishers = (typeof book.publication === "undefined" || typeof book.publication.publishers == undefined ) ? "UNKNOWN" : book.publication.publishers.publisher
  let places= []
  if (publishers.length && publishers !== "UNKNOWN"){
    publishers.map(items =>{
      let multiplePlaces = []
      multiplePlaces.push(items.place)
      multiplePlaces.forEach(place =>{
        places.push(place)
      })
    })
  } else {
      places.push(publishers.place)
  }
  bookObject = {
    place: places
  }
  books.push(bookObject)
}
```
This piece of code allows me to make contact with the OBA API. Then In the results provided by my query I call a function that gives the books without publisher information a default value. Then I check if the book has multiple different places where it was published. If so `push()` each one into `let places= []` of not so just `push()` the one place. Then I create an `Object` where I put all the places.  

After this piece of code I need to make a single array wherein I put all the places so I can loop through them. This is something that is needed to later create a function that calculates the times a city is present in the books.
```js
function totalPlaces(books){
  let places = []
  books.forEach(function(book){
    if (book.place.length === 1 && book.place[0] != undefined){
    places.push(book.place[0])
    } else{
    book.place.forEach(item=>{
      if (item != undefined){
        places.push(item)
      }
    })
    }
  })
  console.log(places)
  return places
}
```
## Early drawings of the visualisation
In the drawing below you can see what my early concept is of my data visualisation. I have to first learn about d3 before I make too many assumptions in the design. Even so, this is roughly my vision in the design. I am still debating about foreign books.
![Early Drawing](/images/early_drawing.jpg)
