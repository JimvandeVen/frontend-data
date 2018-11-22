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



var rangeSlider = document.querySelector("#rescale")
var rangeBullet = document.querySelector("#rangeSliderBullet")

rangeSlider.addEventListener("input", showSliderValue, false);

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = (rangeSlider.value /rangeSlider.max);
  rangeBullet.style.left = (bulletPosition * 578) + "px";
}
