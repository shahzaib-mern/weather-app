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
const apiKey = '37f1f49148144cfed9af6e2cd96026bc'; // Working key

// No API key needed for free Open-Meteo

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
    showLoading(true);
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const data = await response.json();
    console.log('Weather data:', data);
    weatherUI(data);
    showLoading(false);
}

// Update UI with Open-Meteo data
function weatherUI(data) {
    const current = data.current_weather || {};
    console.log('Current weather:', current);
    
    // Temperature
    document.querySelector('#currentTemp').textContent = current.temperature ? `${current.temperature}°C` : '--°C';

    // Wind Speed
    document.querySelector('#windSpeed').textContent = current.windspeed ? `${current.windspeed} km/h` : '-- km/h';

    // Weather Description
    const weatherDesc = document.querySelector('#weatherDesc');
    const code = current.weathercode || 3;
    weatherDesc.textContent = getWeatherDescription(code);

    // Stats with API values - feels like = temp
    document.querySelector('#humidity').textContent = current.winddirection ? `${current.winddirection}°` : '--°';
    document.querySelector('#humidity').previousElementSibling.textContent = 'Wind Dir';
    document.querySelector('#feelsLike').textContent = current.temperature ? `${current.temperature}°C` : '--°C';
    document.querySelector('#pressure').textContent = current.windspeed ? `${current.windspeed} km/h` : '-- km/h';
    document.querySelector('#pressure').previousElementSibling.textContent = 'Wind Speed';

    // Icons with log
    getIcons(code);
}

// Set icons based on WMO weathercode
function getIcons(weathercode) {
    const icon = document.querySelector('#weatherIcon');
    console.log('Weathercode:', weathercode);
    switch (weathercode) {
        case 0: icon.innerHTML = '<i class="fas fa-sun"></i>'; break;
        case 1: case 2: case 3: icon.innerHTML = '<i class="fas fa-cloud-sun"></i>'; break;
        case 45: case 48: icon.innerHTML = '<i class="fas fa-smog"></i>'; break;
        case 51: case 53: case 55: case 61: case 63: case 65: case 80: case 81: case 82: 
            icon.innerHTML = '<i class="fas fa-cloud-rain"></i>'; break;
        case 71: case 73: case 75: icon.innerHTML = '<i class="fas fa-snowflake"></i>'; break;
        case 95: case 96: case 99: icon.innerHTML = '<i class="fas fa-bolt"></i>'; break;
        default: icon.innerHTML = '<i class="fas fa-cloud"></i>'; 
    }
    console.log('Icon updated for code', weathercode);
}

// Get weather description from code
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
        80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown weather';
}

// Loading function
function showLoading(show) {
    const btn = document.querySelector('#searchBtn');
    const icon = btn.querySelector('i');
    if (show) {
        icon.className = 'fas fa-spinner fa-spin';
    } else {
        icon.className = 'fas fa-search';
    }
}

// Enter key support
document.querySelector('#cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});
