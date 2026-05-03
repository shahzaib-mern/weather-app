// Get the Current DATE
const date = new Date();
const today = document.querySelector('#currentDate');
today.textContent = date.toString().slice(0, 15);

// Get The Search Button 
const searchBtn = document.querySelector('#searchBtn');

// Get The Input Field 
const inputCity = document.querySelector('#cityInput');

// Get Quick Buttons 
const quickCity = document.querySelectorAll('.quick-city');
quickCity.forEach(city => {
    city.addEventListener('click', () => {
        inputCity.value = city.textContent;
        searchBtn.click()
    })
}
);

// API KEY For Weather

// ---> For Lon and Lat Api
const apiKey = '37f1f49148144cfed9af6e2cd96026bc';

// ----> For Weather Data Api
const apiKey2 = '3e1149f6595613215cbfbc55859df93d';

// Add EventListener To Button
searchBtn.addEventListener('click', () => {
    // City Name to get weather
    const cityName = document.querySelector('#cityName');
    cityName.textContent = inputCity.value;

    // Promise Chaining To Fetch City Longitude and Latitude

    // Api Fetching
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName.textContent}&limit=1&appid=${apiKey}`).then(response =>
        response.json()).then(data => {

            // Function Call To getWeather()
            getWeather(data[0].lat, data[0].lon);
        }
        ).catch(error =>
            // Catch Error
            console.error(error));

});

async function getWeather(latitude, longitude) {
    // Api For Fetching Weather Data 
    const response = await fetch(`http://api.weatherstack.com/current?access_key=${apiKey2}&query=${latitude},${longitude}`)

    // Error Handling 
    if (response.ok) {
        // Convert Data to json Format
        const data = await response.json();
        console.log(data);

        // Calling weatherUI() for Displaying Weather Data
        weatherUI(data);
    } else {
        // Catch Error
        alert('Error in Fetching Data !!!');
    }
}

// ------>  Updating UI According to the Data
function weatherUI(data) {
    // After Getting Data Display in UI

    // Weather Description
    const weatherDesc = document.querySelector('#weatherDesc');
    weatherDesc.textContent = data.current.weather_descriptions

    // --> Temperature
    const temp = document.querySelector('#currentTemp');
    temp.textContent = `${data.current.temperature}°C`;

    // --> Humidity
    const humidity = document.querySelector('#humidity');
    humidity.textContent = `${data.current.humidity}%`;

    // --> FeelsLike
    const feeling = document.querySelector('#feelsLike');
    feeling.textContent = `${data.current.feelslike}°C`;

    // --> Wind Speed
    const wind = document.querySelector('#windSpeed');
    wind.textContent = `${data.current.wind_speed} km/h`;

    // -->  Pressure
    const pressure = document.querySelector('#pressure');
    pressure.textContent = `${data.current.pressure} hPa`;

    // Function Calling For Icons 
    getIcons(data);

}

// -----> Function To set Weather Icons 
function getIcons(data) {
    // --> Icon 
    const icon = document.querySelector('#weatherIcon');
    const weather = data.current.weather_descriptions[0];

    if (weather.includes('Sunny') || weather.includes('Clear')) {
        icon.innerHTML = `<i class="fas fa-sun"></i>`;
    }
    else if (weather.includes('Partly') || weather.includes('Cloudy')) {
        icon.innerHTML = `<i class="fas fa-cloud-sun"></i>`;
    }
    else if (weather.includes('Rain') || weather.includes('Showers')) {
        icon.innerHTML = `<i class="fas fa-cloud-rain"></i>`;
    }
    else if (weather.includes('Thunder')) {
        icon.innerHTML = `<i class="fas fa-bolt"></i>`;
    }
    else if (weather.includes('Snow') || weather.includes('Sleet') || weather.includes('Hail')) {
        icon.innerHTML = `<i class="fas fa-snowflake"></i>`;
    }
    else if (weather.includes('Mist') || weather.includes('Fog') || weather.includes('Haze') || weather.includes('Smoke')) {
        icon.innerHTML = `<i class="fas fa-smog"></i>`;
    }
    else {
        icon.innerHTML = `<i class="fas fa-cloud"></i>`;
    }
}