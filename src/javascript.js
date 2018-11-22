document.addEventListener("DOMContentLoaded", ()=>{
  document.querySelector("#yearsSelector").onchange=(event)=>{
    let value = document.querySelector("#rescale").value
    updateGraph(window.data, value)
  }
})

document.addEventListener("DOMContentLoaded", ()=>{
  document.querySelector("#rescale").onchange=(event)=>{
    let value = event.srcElement.value
    rescale(window.data, value)
  }
})
