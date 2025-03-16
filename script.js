const input = document.querySelector('input');
const button = document.querySelector('button');
const errorMsg = document.querySelector('p.error_message');
const date = document.querySelector('p.date');
const cityName = document.querySelector('h2.city_name');
const weatherImg = document.querySelector('img.weather_img');
const temp = document.querySelector('p.temp');
const description = document.querySelector('p.description');
const feelsLike = document.querySelector('span.feels_like');
const pressure = document.querySelector('span.pressure');
const humidity = document.querySelector('span.humidity');
const windSpeed = document.querySelector('span.wind_speed');
const cloudiness = document.querySelector('span.clouds');
const visibility = document.querySelector('span.visibility');
const pollutionImg = document.querySelector('img.pollution_img');
const pollutionValue = document.querySelector('span.pollution_value');

const apiInfo = {
    link: 'https://api.openweathermap.org/data/2.5/weather?q=',
    key: '&appid=ed2387dd930fe53dfe14788b3be8c75c',
    units: '&units=metric',
    lang: '&lang=pl'
};

function getWeatherInfo() {
    const apiInfoCity = input.value;
    const URL = `${apiInfo.link}${apiInfoCity}${apiInfo.key}${apiInfo.units}${apiInfo.lang}`;

    console.log("Pobieranie danych z:", URL);

    axios.get(URL)
        .then((response) => {
            console.log(response);

            // Pobranie danych pogodowych i wyświetlenie na stronie
            visibility.textContent = `${response.data.visibility / 1000} km`;
            cloudiness.textContent = `${response.data.clouds.all}%`;
            windSpeed.textContent = `${response.data.wind.speed} m/s`;
            humidity.textContent = `${response.data.main.humidity}%`;
            pressure.textContent = `${response.data.main.pressure} hPa`;
            feelsLike.textContent = `${Math.round(response.data.main.feels_like)}°C`;
            temp.textContent = `${Math.round(response.data.main.temp)}°C`;
            description.textContent = response.data.weather[0].description;
            cityName.textContent = `${response.data.name}, ${response.data.sys.country}`;

            const POLLUTION_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}${apiInfo.key}`
            
            axios.get(POLLUTION_URL).then((res) => {
                pollutionValue.textContent = `${res.data.list[0].components.pm2_5}`;
            })
            // Pobranie ikony pogodowej
            weatherImg.src = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`;

            // Obliczenie poprawnego czasu lokalnego
            const localTimestamp = (response.data.dt + response.data.timezone) * 1000; 
            const localTime = new Date(localTimestamp);

            // Aktualizacja daty na stronie
            date.textContent = localTime.toLocaleString("pl-PL", { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            // Usunięcie komunikatu o błędzie, jeśli wcześniej był
            errorMsg.textContent = "";
        })
        .catch((error) => {
            console.error("Błąd podczas pobierania danych:", error);
            errorMsg.textContent = `${error.response.data.cod} - ${error.response.data.message}`;
            weatherImg.src = '';
            [visibility, cloudiness, windSpeed, humidity, pressure, feelsLike, temp, description, cityName, date].forEach(el => el.textContent = '');
        });
}

// Obsługa kliknięcia przycisku
button.addEventListener('click', getWeatherInfo);

// Obsługa klawiatury – Enter
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherInfo();
    }
});
