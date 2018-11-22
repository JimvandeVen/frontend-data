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

  svg.append("g")
      .attr("class", "yAxis")
      .call(yAxis)
}

function getSelectedYear(){
  return document.querySelector("#yearsSelector").value
}

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

function rescale(data, value){

  let graph = d3.select(".graph")

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

  let text = d3.select(".text")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .style("font", "12px sans-serif")
      .selectAll("text")
      .data(data)

  text.enter().append("text")
      .attr("x", d => x(d.books[getSelectedYear()].length) - 4)
      .attr("y", d => y(d.place) + y.bandwidth() / 2)
      .text(d => d.books[getSelectedYear()].length)

  text.transition()
      .duration(500)
      .attr("x", d => x(d.books[getSelectedYear()].length) - 4)
      .attr("y", d => y(d.place) + y.bandwidth() / 2)
      .text(d => d.books[getSelectedYear()].length)

  text.exit()
      .remove()

  graph.selectAll("rect")
      .transition()
      .duration(500)
      .attr("width", d => {
        if (value > d.books[getSelectedYear()].length){
          return x(d.books[getSelectedYear()].length) - x(0)
        }
      })

  d3.select(".xAxis")
      .call(xAxis)

}
