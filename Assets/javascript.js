let main = document.querySelector("#main");
let searchCity = document.querySelector("#cityInput");
let searchHistory = document.querySelector("#search-history");
let userForm = document.querySelector("#user-form");
let btnSearch = document.querySelector(".btn-primary");
let currentWeather = document.querySelector("#currentWeather");
let forecastDay1 = document.querySelector("#day1");
let forecastDay2 = document.querySelector("#day2");
let forecastDay3 = document.querySelector("#day3");
let forecastDay4 = document.querySelector("#day4");
let forecastDay5 = document.querySelector("#day5");

// API Key
let APIKey = "b374870660328eeb7ba148b79cafb75b";

// Hide content before first click
main.style.display = "none";

// get items from local storage and create each element button from the inputed seach city
function loadHistory() {
  // Clear elements
  searchHistory.innerHTML = "";

  let getItem = localStorage.getItem("history");
  let getItemParsed = JSON.parse(getItem) || [];

  for (let i = 0; i < getItemParsed.length; i++) {
    let elementSaved = getItemParsed[i];
    let savedBtn = document.createElement("button");
    savedBtn.textContent = elementSaved;
    savedBtn.setAttribute("button-history", elementSaved);
    searchHistory.appendChild(savedBtn);
  }
}

// Call function once page loads
loadHistory();

// Click event clears content then calls weather function again
btnSearch.addEventListener("click", function (event) {
  event.preventDefault();
  currentWeather.innerHTML = "";
  toggleMain(false);

  let city = searchCity.value.trim();
  searchCity.value = "";
  searchWeather(city);

  if (window.innerWidth <= 425) {
    //search text font size
    let searchText = document.getElementById("searchText");
    searchText.style.fontSize = "18px";

    // search button size
    let btnSearch = document.getElementById("btnSearch");
    btnSearch.style.height = "30px";
    btnSearch.style.fontSize = "13px";

    // recent searches size
    let recentSearches = document.getElementById("recentSearches");
    recentSearches.style.fontSize = "14px";

    // search city size
    searchCity.style.height = "35px";
    searchCity.style.fontSize = "15px";
  }
});

// Click event get attribute of the dinamicaly created button and call function searchWeather
searchHistory.addEventListener("click", function (event) {
  currentWeather.innerHTML = "";
  let options = event.target.getAttribute("button-history");
  searchWeather(options);

  // Check the screen width and change sizes
  if (window.innerWidth <= 425) {

    let searchText = document.getElementById("searchText");
    searchText.style.fontSize = "18px";

    let btnSearch = document.getElementById("btnSearch");
    btnSearch.style.height = "30px";
    btnSearch.style.fontSize = "13px";

    let recentSearches = document.getElementById("recentSearches");
    recentSearches.style.fontSize = "14px";

    searchCity.style.height = "35px";
    searchCity.style.fontSize = "15px";
  }
});


function searchWeather(city) {
  forecastDay1.innerHTML = "";
  forecastDay2.innerHTML = "";
  forecastDay3.innerHTML = "";
  forecastDay4.innerHTML = "";
  forecastDay5.innerHTML = "";

  let coordinatesAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`;
  fetch(coordinatesAPI).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        let coordinateLat = data[0].lat;
        let coordinateLon = data[0].lon;
        historyCities(city); 
        loadHistory(); 
        weather(coordinateLat, coordinateLon, city); 
        forecast(coordinateLat, coordinateLon);
      });
    } else {
      alert("Error Please Enter a Valid City Name");
    }
  });
}

// get coordanates for the API
let weather = function (lat, lon, city) {
  let weatherDataAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;
  fetch(weatherDataAPI).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        toggleMain(true);

        let currentDiv = document.createElement("div");
        currentDiv.className = "current-div";
        currentWeather.appendChild(currentDiv);

        // todays date format
        let rightNow = dayjs().format("(M/DD/YYYY)");
        let cityName = document.createElement("h2");
        cityName.textContent = "City: " + city + " " + rightNow;
        currentDiv.appendChild(cityName);

        // weather icon
        let weatherCode = data.weather[0].icon;
        let iconUrl = `https://openweathermap.org/img/w/${weatherCode}.png`;
        let iconElement = document.createElement("img");
        iconElement.src = iconUrl;
        currentDiv.appendChild(iconElement);

        // weather details for current day
        let temp = document.createElement("p");
        temp.textContent = "Temp: " + data.main.temp + "°C";
        currentWeather.appendChild(temp);

        let feelsLike = document.createElement("p");
        feelsLike.textContent = "Feels Like: " + data.main.feels_like + "°C";
        currentWeather.appendChild(feelsLike);

        let wind = document.createElement("p");
        wind.textContent = "Wind: " + data.wind.speed + "km/h";
        currentWeather.appendChild(wind);

        let humididy = document.createElement("p");
        humididy.textContent = "Humidity: " + data.main.humidity + "%";
        currentWeather.appendChild(humididy);
      });
    }
  });
};

// get the weather forecast for the next 5 days
let forecast = function (lat, lon) {
  let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;
  fetch(forecastURL)
    .then((response) => response.json())
    .then((data) => {
      let dailyData = data.list.filter((dataPoint) =>
        dataPoint.dt_txt.endsWith("12:00:00")
      );

      // Forecast for  day 1
      let forecastDate = document.createElement("h4");
      let date = dayjs().add(1, "day").format("(M/DD/YYYY)");
      forecastDate.textContent = date;
      forecastDay1.appendChild(forecastDate);

      let elementIcon = dailyData[0].weather[0].icon;
      let iconURL = `https://openweathermap.org/img/w/${elementIcon}.png`;
      let forecastIcon = document.createElement("img");
      forecastIcon.src = iconURL;
      forecastDay1.appendChild(forecastIcon);

      let elementTemp = dailyData[0].main.temp;
      let forecastTemp = document.createElement("p");
      forecastTemp.textContent = "Temp: " + elementTemp + "°C";
      forecastDay1.appendChild(forecastTemp);

      let elementFeelsLike = dailyData[0].main.feels_like;
      let forecastFeels = document.createElement("p");
      forecastFeels.textContent = "Feels Like: " + elementFeelsLike + "°C";
      forecastDay1.appendChild(forecastFeels);

      let elementWind = dailyData[0].wind.speed;
      let forecastWind = document.createElement("p");
      forecastWind.textContent = "Wind: " + elementWind + "km/h";
      forecastDay1.appendChild(forecastWind);

      let elementHumidity = dailyData[0].main.humidity;
      let forecastHumidity = document.createElement("p");
      forecastHumidity.textContent = "Humidity: " + elementHumidity + "%";
      forecastDay1.appendChild(forecastHumidity);

      //day 2
      let forecastDate2 = document.createElement("h4");
      let date2 = dayjs().add(2, "day").format("(M/DD/YYYY)");
      forecastDate2.textContent = date2;
      forecastDay2.appendChild(forecastDate2);

      let elementIcon2 = dailyData[1].weather[0].icon;
      let iconURL2 = `https://openweathermap.org/img/w/${elementIcon2}.png`;
      let forecastIcon2 = document.createElement("img");
      forecastIcon2.src = iconURL2;
      forecastDay2.appendChild(forecastIcon2);

      let elementTemp2 = dailyData[1].main.temp;
      let forecastTemp2 = document.createElement("p");
      forecastTemp2.textContent = "Temp: " + elementTemp2 + "°C";
      forecastDay2.appendChild(forecastTemp2);

      let elementFeelsLike2 = dailyData[1].main.feels_like;
      let forecastFeels2 = document.createElement("p");
      forecastFeels2.textContent = "Feels Like: " + elementFeelsLike2 + "°C";
      forecastDay2.appendChild(forecastFeels2);

      let elementWind2 = dailyData[1].wind.speed;
      let forecastWind2 = document.createElement("p");
      forecastWind2.textContent = "Wind: " + elementWind2 + "km/h";
      forecastDay2.appendChild(forecastWind2);

      let elementHumidity2 = dailyData[1].main.humidity;
      let forecastHumidity2 = document.createElement("p");
      forecastHumidity2.textContent = "Humidity: " + elementHumidity2 + "%";
      forecastDay2.appendChild(forecastHumidity2);

      // day 3
      let forecastDate3 = document.createElement("h4");
      let date3 = dayjs().add(3, "day").format("(M/DD/YYYY)");
      forecastDate3.textContent = date3;
      forecastDay3.appendChild(forecastDate3);

      let elementIcon3 = dailyData[2].weather[0].icon;
      let iconURL3 = `https://openweathermap.org/img/w/${elementIcon3}.png`;
      let forecastIcon3 = document.createElement("img");
      forecastIcon3.src = iconURL3;
      forecastDay3.appendChild(forecastIcon3);

      let elementTemp3 = dailyData[2].main.temp;
      let forecastTemp3 = document.createElement("p");
      forecastTemp3.textContent = "Temp: " + elementTemp3 + "°C";
      forecastDay3.appendChild(forecastTemp3);

      let elementFeelsLike3 = dailyData[2].main.feels_like;
      let forecastFeels3 = document.createElement("p");
      forecastFeels3.textContent = "Feels Like: " + elementFeelsLike3 + "°C";
      forecastDay3.appendChild(forecastFeels3);

      let elementWind3 = dailyData[2].wind.speed;
      let forecastWind3 = document.createElement("p");
      forecastWind3.textContent = "Wind: " + elementWind3 + "km/h";
      forecastDay3.appendChild(forecastWind3);

      let elementHumidity3 = dailyData[2].main.humidity;
      let forecastHumidity3 = document.createElement("p");
      forecastHumidity3.textContent = "Humidity: " + elementHumidity3 + "%";
      forecastDay3.appendChild(forecastHumidity3);

      //day 4
      let forecastDate4 = document.createElement("h4");
      let date4 = dayjs().add(4, "day").format("(M/DD/YYYY)");
      forecastDate4.textContent = date4;
      forecastDay4.appendChild(forecastDate4);

      let elementIcon4 = dailyData[3].weather[0].icon;
      let iconURL4 = `https://openweathermap.org/img/w/${elementIcon4}.png`;
      let forecastIcon4 = document.createElement("img");
      forecastIcon4.src = iconURL4;
      forecastDay4.appendChild(forecastIcon4);

      let elementTemp4 = dailyData[3].main.temp;
      let forecastTemp4 = document.createElement("p");
      forecastTemp4.textContent = "Temp: " + elementTemp4 + "°C";
      forecastDay4.appendChild(forecastTemp4);

      let elementFeelsLike4 = dailyData[3].main.feels_like;
      let forecastFeels4 = document.createElement("p");
      forecastFeels4.textContent = "Feels Like: " + elementFeelsLike4 + "°C";
      forecastDay4.appendChild(forecastFeels4);

      let elementWind4 = dailyData[3].wind.speed;
      let forecastWind4 = document.createElement("p");
      forecastWind4.textContent = "Wind: " + elementWind4 + "km/h";
      forecastDay4.appendChild(forecastWind4);

      let elementHumidity4 = dailyData[3].main.humidity;
      let forecastHumidity4 = document.createElement("p");
      forecastHumidity4.textContent = "Humidity: " + elementHumidity4 + "%";
      forecastDay4.appendChild(forecastHumidity4);

      //day 5
      let forecastDate5 = document.createElement("h4");
      let date5 = dayjs().add(5, "day").format("(M/DD/YYYY)");
      forecastDate5.textContent = date5;
      forecastDay5.appendChild(forecastDate5);

      let elementIcon5 = dailyData[4].weather[0].icon;
      let iconURL5 = `https://openweathermap.org/img/w/${elementIcon5}.png`;
      let forecastIcon5 = document.createElement("img");
      forecastIcon5.src = iconURL5;
      forecastDay5.appendChild(forecastIcon5);

      let elementTemp5 = dailyData[4].main.temp;
      let forecastTemp5 = document.createElement("p");
      forecastTemp5.textContent = "Temp: " + elementTemp5 + "°C";
      forecastDay5.appendChild(forecastTemp5);

      let elementFeelsLike5 = dailyData[4].main.feels_like;
      let forecastFeels5 = document.createElement("p");
      forecastFeels5.textContent = "Feels Like: " + elementFeelsLike5 + "°C";
      forecastDay5.appendChild(forecastFeels5);

      let elementWind5 = dailyData[4].wind.speed;
      let forecastWind5 = document.createElement("p");
      forecastWind5.textContent = "Wind: " + elementWind5 + "km/h";
      forecastDay5.appendChild(forecastWind5);

      let elementHumidity5 = dailyData[4].main.humidity;
      let forecastHumidity5 = document.createElement("p");
      forecastHumidity5.textContent = "Humidity: " + elementHumidity5 + "%";
      forecastDay5.appendChild(forecastHumidity5);
    });
};

//hide and seek with the searching content
function toggleMain(value) {
  if (value === true) {
    main.style.display = "flex";
  } else {
    main.style.display = "none";
  }
}

// get info from local Storage
let historyCities = function (city) {
  let getItem = localStorage.getItem("history");
  let getItemParse = JSON.parse(getItem) || [];
  getItemParse.push(city);
  let getItemStringfy = JSON.stringify(getItemParse);

  localStorage.setItem("history", getItemStringfy);
};