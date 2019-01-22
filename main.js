"use strict";

const apiKey = "h8YaV2ot0Btuy3vXlh0pYWOPLyQR1AH1XFlQ2GuF"; 
const searchURL = "https://api.nps.gov/api/v1/parks";

function displayResults(responseJson) {
  $("#js-results-list").empty()
  $("#error-message").empty()
  if (responseJson.data.length === 0) {
    $("#error-message").text(`use two letter state format. As follows: Tx, Ca, Co`)
  }
  responseJson.data.forEach(function(park) {
    $("#js-results-list").append(`
    <li>
      <ul>
        <li>
          <h3><span class="font-size">Name:</span> ${park.name}</h3>
        </li>
        <li>
          <h3><span class="font-size">State:</span> ${park.states}</h3>
        </li>
        <li>
          <p><span class="font-size">Description:</span> ${park.description}</p>
        </li>
        <li>
          <p><span class="font-size">Park URL:</span> <a target="_blank" href="${park.url}">${park.url}</a></p>
        </li>
        <li>
          <p><span class="font-size">Directions URL:</span> <a target="_blank" href="${park.directionsUrl}">${park.directionsUrl}</a></p>
        </li>
      </ul>
    </li>
    `)
  })
  $('#results').removeClass('hidden');
}

function formatQueryParams(params) {
  let queryString = ""
  Object.keys(params).forEach(key => {
    if(key === "stateCode") {
      params[key].forEach(function(state) {
        queryString +=`${key}=${state}&`
      })
    }
    else if (key === "api_key") {
      queryString +=`${key}=${params[key]}`
    }
    else if (key === "limit") {queryString +=`${key}=${params[key]}&`}
    
    
  })
  queryString = queryString.replace(/\s/g, '')
  return queryString
}

function getParks(states, max) {
const params = {
  stateCode: states,
  limit: max,
  api_key: apiKey
}
let queryString = formatQueryParams(params)
let url = searchURL + "?" + queryString;
console.log(url)

  fetch(url)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`)
    });
} 

function watchForm() {
  $('#search-form').on("submit", event => {
    event.preventDefault();
    let states = $('#js-state-input').val();
    states = states.split(",");
    console.log(states);
    const max = $('#js-max-results').val();
    getParks(states, max)
  })
}

watchForm();