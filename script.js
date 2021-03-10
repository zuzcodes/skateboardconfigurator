"use strict";

// MODEL
const Features = {
  drinksholder: false,
  led: false,
  propeller: false,
  shield: false,
  solarfan: false,
};

let elementToPaint;

// ------ START ------

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("rdy");
  fetchSvg();
}

async function fetchSvg() {
  const response = await fetch("images/skateboard-01.svg");
  const svgData = await response.text();
  document.querySelector("#base").innerHTML = svgData;

  console.log("fetch done");
  registerEvents();
}

function registerEvents() {
  console.log("start");

  // register mouse-events for svg parts
  document.querySelectorAll(".interactive").forEach((eachG) => {
    console.log(eachG);
    eachG.addEventListener("click", selected);
    eachG.addEventListener("mouseover", mouseOver);
    eachG.addEventListener("mouseout", mouseOut);
  });

  // register swatch-clicks
  document.querySelectorAll(".swatch").forEach((swatch) => swatch.addEventListener("click", swatchClicked));

  // register feature-clicks
  document.querySelectorAll(".feature").forEach((feature) => feature.addEventListener("click", toggleFeature));
}

// ------ COLOR CONFIGURATOR ------

function selected() {
  elementToPaint = this;
  this.style.fill = "rgb(255, 255, 255, 0.4)";
}

function mouseOver() {
  console.log(this);
  this.style.stroke = "lightgrey";
    this.style.strokeWidth = "10px";
    this.style.cursor = "pointer";

}

function mouseOut() {
  this.style.stroke = "none";
}

function swatchClicked() {
  console.log("clicked", this.getAttribute("fill"));
  if (elementToPaint != undefined) {
    elementToPaint.style.fill = this.getAttribute("fill");
  }
}

// ------ FEATURE CONFIGURATOR ------

function toggleFeature(event) {
  const target = event.currentTarget;
  const feature = target.dataset.feature;

  if (features[feature]) {
    features[feature] = false;
  } else {
    features[feature] = true;
  }

  if (features[feature]) {
    document.querySelector(`[data-feature = ${feature}]`).classList.remove("hide");
    target.classList.add("chosen");
    let selectedFeature = createFeatureElement(feature);
    document.querySelector("#selected ul").appendChild(selectedFeature);

    // first
    const start = document.querySelector(`#features > [data-feature=${feature}]`).getBoundingClientRect();
    // last
    const end = document.querySelector(`#selected ul [data-feature=${feature}]`).getBoundingClientRect();
    // invert
    const diffX = start.x - end.x;
    const diffY = start.y - end.y;

    document.querySelector(`#selected ul [data-feature=${feature}]`).style.setProperty("--diffY", diffY);
    document.querySelector(`#selected ul [data-feature=${feature}]`).style.setProperty("--diffX", diffX);
    // play
    document.querySelector(`#selected ul [data-feature=${feature}]`).classList.add("animate-feature-in");
  } else {
    document.querySelector(`[data-feature = ${feature}]`).classList.add("hide");
    target.classList.remove("chosen");

    // first
    const start = document.querySelector(`#features > [data-feature=${feature}]`).getBoundingClientRect();
    // last
    const end = document.querySelector(`#selected ul [data-feature=${feature}]`).getBoundingClientRect();
    // invert
    const diffX = start.x - end.x;
    const diffY = start.y - end.y;
    document.querySelector(`#selected ul [data-feature=${feature}]`).style.setProperty("--diffY", diffY);
    document.querySelector(`#selected ul [data-feature=${feature}]`).style.setProperty("--diffX", diffX);
    // play
    document.querySelector(`#selected ul [data-feature=${feature}]`).classList.add("animate-feature-out");
    document.querySelector(`#selected ul [data-feature=${feature}]`).addEventListener("animationend", () => {
      deactivate(feature);
    });
  }
}

function deactivate(feature) {
  document.querySelector(`#selected ul [data-feature=${feature}]`).remove();
}

function createFeatureElement(feature) {
  const li = document.createElement("li");
  li.dataset.feature = feature;

  const img = document.createElement("img");
  img.src = `images/feature_${feature}.png`;
  img.alt = capitalize(feature);

  li.append(img);

  return li;
}

function capitalize(text) {
  return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
}
