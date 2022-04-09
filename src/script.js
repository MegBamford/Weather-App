// current date data
let now = new Date();
let daysFull = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let dayFull = daysFull[now.getDay()];
let daysAbbrev = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let dayAbbrev = daysAbbrev[now.getDay()];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let monthFull = months[now.getMonth()];

let date = now.getDate();
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
function today() {
  let todayDay = document.querySelector("#today-day");
  todayDay.innerHTML = `${dayFull}`;
  let todayMonth = document.querySelector("#today-monthFull");
  todayMonth.innerHTML = `${monthFull}`;
  let todayDate = document.querySelector("#today-date");
  todayDate.innerHTML = `${date}`;
  let todayHours = document.querySelector("#today-hours");
  todayHours.innerHTML = `${hours}`;
  let todayMinutes = document.querySelector("#today-minutes");
  todayMinutes.innerHTML = `${minutes}`;
}
//

// weather update via coordinates
let apiKey = `d3fc32d153fa8af3d3e0184bfd824f3d`;
let apiEndPoint = `https://api.openweathermap.org/data/2.5/weather?`;

function navigation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `${apiEndPoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(currentTemperature);
}

let geolocationButton = document.querySelector("#geo-Button");
geolocationButton.addEventListener("click", navigation);
//
// forecast function
function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  return daysAbbrev[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  console.log(response.data.daily);

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col-2 date">
        
          <div class="row">
            <div class="col-12 day">${formatDate(forecastDay.dt)}</div>
            <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          width="30"
        />
            <div class="col-12 temperature">${Math.round(
              forecastDay.temp.min
            )}/${Math.round(forecastDay.temp.max)}°C</div>
          </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  //console.log(coordinates);
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// weather update via search option
function search(city) {
  let apiUrl = `${apiEndPoint}q=${city}&units=metric&appid=${apiKey}`;
  searchForm.reset();
  axios.get(`${apiUrl}`).then(currentTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-city-input");
  let city = searchInput.value;
  search(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

search("sydney");
//
function backgroundImages(response) {
  let iconElement = document.querySelector("#icon-main");
  let icon = response.data.weather[0].icon;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  let backgroundElement = document.getElementsByClassName("container")[0];
  console.log(backgroundElement);
  backgroundElement.style.backgroundImage = `url("./images/${icon}.jpg")`;
  fontColor(icon);
}
function fontColor(icon) {
  if (icon === "04n" || icon === "04d" || icon === "02n" || icon === "09n") {
    document.body.style.color = "#8476d2";
  } else if (
    icon === "02d" ||
    icon === "10d" ||
    icon === "13d" ||
    icon === "50d"
  ) {
    document.body.style.color = "#black";
  } else {
    document.body.style.color = "#fff";
  }
}
// add response data to html
function currentTemperature(response) {
  //console.log(response.data);
  let city = response.data.name;
  let country = response.data.sys.country;
  let location = document.querySelector("h1");
  let currentTempElement = document.querySelector("#today-current-temp");
  let minTemp = document.querySelector("#min-temp");
  let maxTemp = document.querySelector("#max-temp");
  let humidity = document.querySelector("#humidity");
  let description = document.querySelector("#weather-description");
  let descriptionFull = document.querySelector("#weather-description-full");
  let windSpeed = document.querySelector("#wind-speed");

  location.innerHTML = `${city}, ${country}`;
  currentTempElement.innerHTML = Math.round(response.data.main.temp) + "°C";
  minTemp.innerHTML = Math.round(response.data.main.temp_min);
  maxTemp.innerHTML = Math.round(response.data.main.temp_max);
  humidity.innerHTML = Math.round(response.data.main.humidity);
  description.innerHTML = response.data.weather[0].main;
  descriptionFull.innerHTML = response.data.weather[0].description;
  windSpeed.innerHTML = Math.round(response.data.wind.speed);
  backgroundImages(response);
  getForecast(response.data.coord);
}

today();
