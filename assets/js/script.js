
var ApiKey = "9b80bfa8ba8a4fe34ec85b21e0b8c2cc";
var currentPlace = "";
var lastPlace = "";


var handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}




var getCurrentWeather = (event) => {
    //accept city name from search box
    var city = $("#city-search").val();
    currentPlace = $("#city-search").val();
    //give the fetch url a var
    var requestUrl =    "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + ApiKey;
    fetch(requestUrl)
        .then(handleErrors)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            // Save city to local storage
            saveCity(city);
            $('#search-error').text("");

            var weatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
            //handle time zones with moment
            var currentTimeUTC = response.dt;
            var timeZoneOffset = response.timezone;
            let timeZoneOffsetHours = timeZoneOffset / 60 / 60;
            let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(timeZoneOffsetHours);

            //use javascript to display cities
            displayCities();
            //display 5 day
            showFiveDay(event);
            //write html for results of search
            
            var currentWeatherHTML = `<h3>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${weatherIcon}"></h3
        <ul class="list-unstyled">
            <li>Temp: ${response.main.temp}&#8457;</li>
            <li>Humidity: ${response.main.humidity}%</li>
            <li>Wind: ${response.wind.speed}mph</li>
            <li id="uvIndex">UV Index:</li>
        </ul>`;
            // display htmml
            $("#todays-weather").html(currentWeatherHTML)
            //long + lat for uv search
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var uvQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=" + ApiKey;
            //uv index temp access url
            uvQueryUrl = "https://cors-anywhere.herokuapp.com/" + uvQueryUrl;
            //fetch uv data give color display
            fetch(uvQueryUrl)
            .then(handleErrors)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    var uvIndex = response.value;
                    $("#uvIndex").html(`UV Inde: <span id="uvValue"></span>`);
                    if (uvIndex = 0 && uvIndex < 3) {
                        $("#uvValue").attr("class", "uv-good");

                    } else if (uvIndex > 3 && uvIndex < 8) {
                        $("#uvValue").attr("class", "uv-ok");
                    } else if (uvIndex > 8) {
                        $("#uvValue").attr("class", "uv-bad");
                    }
                });


        })
}
// function to display 5 day 
var showFiveDay = (event) => {
    var city = $("#city-search").val();
    //create var for forecast
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=standard" + "&APPID=" + ApiKey;
    //fetch forcast
    fetch(queryUrl)
    .then(handleErrors)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            //html input
            var fiveDayHTML = `
        <h2>5 Day Forecast:</h2>
        <div id="fiveDayUl" class="d-inline-flex flex-wrap">`;

        for (var i = 0; i < response.list.length; i++) {
                var dayData = response.list[i];
                var dayTimeUTC = dayData.dt;
                var timeZoneOffsets = response.city.timezone;
                var timeZoneOffsetsHours = timeZoneOffsets / 60 / 60;
                var thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetsHours);
                var iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";

                if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
                    fiveDayHTML += `
                <div class="weather-block block m-2 p0">
                    <ul class="list-unstyled p-3">
                        <li>${thisMoment.format("MM/DD/YY")}</li>
                        <li class="weather-icon"><img src="${iconURL}"></li>
                        <li>Temp: ${dayData.main.temp}&#8457;</li>
                        <br>
                        <li>Humidity: ${dayData.main.humidity}%</li>
                    </ul>
                </div>`;
                }
            }
            //show 5 day in html
            fiveDayHTML += `</div>`;
            // Append the 5 day forecast to the DOM
            $('#5-day').html(fiveDayHTML);
        })
}

// save the city to localStorage
var saveCity = (newCity) => {
    var cityExists = false;
    // Check if City exists in local storage
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" + i] === newCity) {
            cityExists = true;
            break;
        }
    }
    // Save to localStorage if city is new
    if (cityExists === false) {
        localStorage.setItem('cities' + localStorage.length, newCity);
    }
}

// Render the list of searched cities
var displayCities = () => {
    $('#city-results').empty();
    // If localStorage is empty
    if (localStorage.length===0){
        if (lastCity){
            $('#city-search').attr("value", lastCity);
        } else {
            $('#city-search').attr("value", "search");
        }
    } else {
        // Build key of last city written to localStorage
        var lastCityKey="cities"+(localStorage.length-1);
        lastCity=localStorage.getItem(lastCityKey);
        // Set search input to last city searched
        $('#city-search').attr("value", lastCity);
        // display stored cities to page
        for (var i = 0; i < localStorage.length; i++) {
            var city = localStorage.getItem("cities" + i);
            var cityEl;
            // Set to lastCity if currentPlace not set
            if (currentPlace===""){
                currentPlace=lastCity;
            }
            // Set button class to active for currentPlace
            if (city === currentPlace) {
                cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
            } else {
                cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
            } 
            // display city to page
            $('#city-results').prepend(cityEl);
        }
        // Add a "clear" button to page if there is a cities list
        if (localStorage.length>0){
            $('#delete-history').html($('<a id="clear-storage" href="#">clear</a>'));
        } else {
            $('#delete-history').html('');
        }
    }
    
}

// New city search button event listener
$('#search-button').on("click", (event) => {
    event.preventDefault();
    currentPlace = $('#city-search').val();
    getCurrentWeather(event);
    });
    
    // Old searched cities buttons event listener
    $('#city-results').on("click", (event) => {
        event.preventDefault();
        $('#city-search').val(event.target.textContent);
        currentPlace=$('#city-search').val();
        getCurrentWeather(event);
    });
    
    // Clear old searched cities from localStorage event listener
    $("#delete-history").on("click", (event) => {
        localStorage.clear();
        displayCities();
    });
    
    
    
displayCities();
getCurrentWeather();
