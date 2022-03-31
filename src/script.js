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
let daysAbbrev = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
let month = now.getMonth() + 1;
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
  //console.log(position.coords.latitude);
  //console.log(position.coords.longitude);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `${apiEndPoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(currentTemperature);
}

let geolocationButton = document.querySelector("#geo-Button");
geolocationButton.addEventListener("click", navigation);
//
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

// add response data to html
function currentTemperature(response) {
  console.log(response.data);
  let city = response.data.name;
  let country = response.data.sys.country;
  let location = document.querySelector("h1");
  let currentTempElement = document.querySelector("#today-current-temp");
  let minTemp = document.querySelector("#min-temp");
  let maxTemp = document.querySelector("#max-temp");
  let humidity = document.querySelector("#humidity");
  let description = document.querySelector("#weather-description");
  let windSpeed = document.querySelector("#wind-speed");
  let iconElement = document.querySelector("#icon-main");

  location.innerHTML = `${city}, ${country}`;
  currentTempElement.innerHTML = Math.round(response.data.main.temp) + "°C";
  celsiusTemperature = response.data.main.temp;
  minTemp.innerHTML = Math.round(response.data.main.temp_min);
  maxTemp.innerHTML = Math.round(response.data.main.temp_max);
  humidity.innerHTML = Math.round(response.data.main.humidity);
  description.innerHTML =
    response.data.weather[0].main +
    " - " +
    response.data.weather[0].description;
  windSpeed.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  let backgroundElement = document.getElementsByClassName("container")[0];
  console.log(backgroundElement);
  backgroundElement.style.backgroundImage = `url("./images/${response.data.weather[0].icon}.jpg")`;
}

//
//ctof and ftoc temperature
function fahrenheitLink(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#today-current-temp");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature) + "°F";
}

function celsiusLink(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#today-current-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature) + "°C";
}

let toFarenheit = document.querySelector("#fahrenheit-link");
toFarenheit.addEventListener("click", fahrenheitLink);
let toCelsius = document.querySelector("#celsius-link");
toCelsius.addEventListener("click", celsiusLink);

today();
