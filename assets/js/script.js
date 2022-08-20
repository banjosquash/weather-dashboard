
var ApiKey = "0925dcc78fab56458e7a80b721442380";
var currentPlace = "";
var lastPlace = "";





var getCurrentWeather = (event) => {
    //accept city name from search box
    var city = $("#city-search").val();
    currentCity= $("#city-search").val();
    //give the fetch url a var
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?id=524901&appid=0925dcc78fab56458e7a80b721442380" + city + "&APPID=" + ApiKey;
    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(response){
        saveCity(city);
        $("#search-error").text("");

        var weatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        //handle time zones with moment
        var timeZone = response.dt;
        var timeZoneOffset = response.timezone;
        let timeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
        let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);

        //use javascript to display cities
        displayCities();
        //display 5 day
        showFiveDay(event);
        //write html for results of search 
        var currentWeatherHTML = `<h3>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${weatherIcon}"></h3
        <ul class="list-unstyled">
            <li>Temp: ${response.main.temp}&#8457;</li>
            <li>Humidity: ${response.main.humidity}%</li>
            <li>Wind: ${response.main.wind.speed}mph</li>
            <li id="uvIndex">UV Index:</li>
        </ul>`;
        // display htmml
        $("#todays-weather").html(currentWeatherHTML)
        //long + lat for uv search
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var uvQueryUrl = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=" + owmAPI;
        //
        uvQueryUrl = "https://cors-anywhere.herokuapp.com/" + uvQueryURL;

    })
}