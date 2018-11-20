d3.json("../src/data.json").then(function(data){
  console.log(data)

  let sortedData = data.sort(function (a, b) {
  return b.bookCount- a.bookCount;
  })

  let margin = {
    top: 20,
    right: 20 ,
    bottom: 0,
    left: 150
  }

  let width = 1800 - margin.left - margin.right
  let height = 3000 - margin.top - margin.bottom

  let svg = d3.select("#chart")
    .append("svg")
    .attr("width", `${width}`)
    .attr("height", `${height}`)

  let x = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.books["19801990"].length)])
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
    .selectAll("rect")
    .data(data)
    .enter().append("rect")
      .attr("x", x(0))
      .attr("rx", 4)
      .attr("y", d => y(d.place))
      .attr("width", d => x(d.books["19801990"].length) - x(0))
      .attr("height", y.bandwidth())
      .attr("fill", "green")

  svg.append("g")
    .attr("fill", "white")
    .attr("text-anchor", "end")
    .style("font", "12px sans-serif")
    .selectAll("text")
    .data(data)
    .enter().append("text")
      .attr("x", d => x(d.books["19801990"].length) - 4)
      .attr("y", d => y(d.place) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d.books["19801990"].length)

  svg.append("g")
      .call(xAxis)

  svg.append("g")
      .call(yAxis)


})
