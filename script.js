const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
}

// DOM Elements
const searchInputBox = document.getElementById('input-box');
const weatherBody = document.getElementById('weather-body');
const parentContainer = document.getElementById('parent');
const loader = document.createElement('div');
loader.className = 'loader';
parentContainer.appendChild(loader);

// Event Listeners
searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        showLoader();
        getWeatherReport(searchInputBox.value);
    }
});

// Show loading animation
function showLoader() {
    weatherBody.style.display = 'none';
    loader.style.display = 'block';
}

// Hide loading animation
function hideLoader() {
    loader.style.display = 'none';
}

// Get weather data from API
function getWeatherReport(city) {
    if (!city.trim()) {
        showAlert("Empty Input", "Please enter a city name", "error");
        hideLoader();
        return;
    }

    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(response => response.json())
        .then(weather => {
            hideLoader();
            showWeatherReport(weather);
        })
        .catch(error => {
            hideLoader();
            showAlert("Network Error", "Unable to fetch weather data", "error");
            console.error('Error fetching weather data:', error);
        });
}

// Display weather information
function showWeatherReport(weather) {
    let city_code = weather.cod;
    
    if (city_code === '400') {
        showAlert("Empty Input", "Please enter any city", "error");
        reset();
    } else if (city_code === '404') {
        showAlert("City Not Found", "Please enter a valid city name", "warning");
        reset();
    } else {
        weatherBody.style.display = 'block';
        weatherBody.classList.remove('active');
        
        let todayDate = new Date();
        
        weatherBody.innerHTML = `
            <div class="location-deatils">
                <div class="city" id="city">${weather.name}, ${weather.sys.country}</div>
                <div class="date" id="date">${dateManage(todayDate)}</div>
            </div>
            <div class="weather-status">
                <div class="temp" id="temp">${Math.round(weather.main.temp)}&deg;C</div>
                <div class="weather" id="weather">${weather.weather[0].main} <i class="${getIconClass(weather.weather[0].main)}"></i></div>
                <div class="min-max" id="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max)</div>
                <div id="updated_on">Updated as of ${getTime(todayDate)}</div>
            </div>
            <hr>
            <div class="day-details">
                <div class="basic">
                    <span><i class="fas fa-thermometer-half"></i> Feels like ${Math.round(weather.main.feels_like)}&deg;C</span> | 
                    <span><i class="fas fa-tint"></i> Humidity ${weather.main.humidity}%</span><br>
                    <span><i class="fas fa-compress-alt"></i> Pressure ${weather.main.pressure} mb</span> | 
                    <span><i class="fas fa-wind"></i> Wind ${weather.wind.speed} KMPH</span>
                </div>
            </div>
        `;
        
        // Animate weather body
        setTimeout(() => {
            weatherBody.classList.add('active');
        }, 100);

        changeBg(weather.weather[0].main);
        reset();
    }
}

// Show alert using SweetAlert with custom styling
function showAlert(title, message, type) {
    swal({
        title: title,
        text: message,
        icon: type,
        button: "OK",
        closeOnClickOutside: true,
        className: "custom-alert"
    });
}

// Format time - HH:MM
function getTime(todayDate) {
    let hour = addZero(todayDate.getHours());
    let minute = addZero(todayDate.getMinutes());
    return `${hour}:${minute}`;
}

// Format date - DD Month (Day), YYYY
function dateManage(dateArg) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];
    
    return `${date} ${month} (${day}), ${year}`;
}

// Change background based on weather condition
function changeBg(status) {
    let imageUrl;

    // Apply smooth transition to background changes
    document.body.style.transition = "background-image 1.5s ease";

    switch (status) {
        case 'Clouds':
            imageUrl = 'url(img/clouds.jpg)';
            break;
        case 'Rain':
            imageUrl = 'url(img/rainy.jpg)';
            break;
        case 'Clear':
            imageUrl = 'url(img/clear.jpg)';
            break;
        case 'Snow':
            imageUrl = 'url(img/snow.jpg)';
            break;
        case 'Sunny':
            imageUrl = 'url(img/sunny.jpg)';
            break;
        case 'Thunderstorm':
            imageUrl = 'url(img/thunderstorm.jpg)';
            break;
        case 'Drizzle':
            imageUrl = 'url(img/drizzle.jpg)';
            break;
        case 'Mist':
        case 'Haze':
        case 'Fog':
            imageUrl = 'url(img/mist.jpg)';
            break;
        default:
            imageUrl = 'url(img/bg.jpg)';
            break;
    }

    document.body.style.backgroundImage = imageUrl;
}

// Get appropriate Font Awesome icon class
function getIconClass(classarg) {
    switch (classarg) {
        case 'Rain':
            return 'fas fa-cloud-showers-heavy';
        case 'Clouds':
            return 'fas fa-cloud';
        case 'Clear':
            return 'fas fa-sun';
        case 'Snow':
            return 'fas fa-snowflake';
        case 'Sunny':
            return 'fas fa-sun';
        case 'Mist':
        case 'Haze':
        case 'Fog':
            return 'fas fa-smog';
        case 'Thunderstorm':
            return 'fas fa-bolt';
        case 'Drizzle':
            return 'fas fa-cloud-rain';
        default:
            return 'fas fa-cloud-sun';
    }
}

// Reset input field
function reset() {
    searchInputBox.value = "";
}

// Add leading zero to numbers less than 10
function addZero(i) {
    return i < 10 ? "0" + i : i;
}

// Add some initial animation on page load
document.addEventListener('DOMContentLoaded', function() {
    parentContainer.style.opacity = "0";
    setTimeout(() => {
        parentContainer.style.transition = "opacity 0.8s ease";
        parentContainer.style.opacity = "1";
    }, 300);
});
