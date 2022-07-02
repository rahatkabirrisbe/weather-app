/* 
messageWrapper
form
country
city
w-city
d-block
w-icon
w-feel
w-temp
w-pressure
w-humidity
*/
const tempStorage = {
  city: "",
  country: "",
  apiKey: "402b490eedfbbbcd75ad8fe545cfc09e",
  async getWeather() {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&appid=${this.apiKey}&units=metric `
      );
      const { name, main, weather } = await res.json();

      // console.log(data);
      return {
        name,
        main,
        weather,
      };
    } catch (error) {
      // console.log("error something", error);
      UI.showErrorMsg("Your Input invalid & problem to fetching Data");
    }
  },
};
const localStorage = {};
const UI = {
  allSelectors() {
    const formElm = document.querySelector("#form"),
      countryInput = document.querySelector("#country"),
      cityInput = document.querySelector("#city"),
      errorMsg = document.querySelector("#messageWrapper"),
      cityResult = document.querySelector("#w-city"),
      temp = document.querySelector("#w-temp"),
      pressure = document.querySelector("#w-pressure"),
      humidity = document.querySelector("#w-humidity"),
      icon = document.querySelector("#w-icon"),
      feel = document.querySelector("#w-feel");
    return {
      formElm,
      countryInput,
      cityInput,
      errorMsg,
      cityResult,
      temp,
      pressure,
      humidity,
      icon,
      feel,
    };
  },
  resetInput(city, country) {
    city.value = "";
    country.value = "";
  },
  getInputValues() {
    const { countryInput, cityInput } = this.allSelectors();
    const country = countryInput.value;
    const city = cityInput.value;
    return {
      country,
      city,
    };
  },
  validateInput(country, city) {
    if (country === "" || city === "") {
      this.showErrorMsg("Something Wrong Happened!");
      return false;
    } else {
      return true;
    }
  },
  hideErrorMsg() {
    document.querySelector("#massage").remove();
  },
  showErrorMsg(msg) {
    const { errorMsg } = this.allSelectors();
    const errMsg = `<div class="alert alert-danger" id="massage">${msg}</div>`;
    errorMsg.insertAdjacentHTML("afterbegin", errMsg);
    setTimeout(() => {
      this.hideErrorMsg();
    }, 2000);
  },
  async handleRemoteData() {
    return await tempStorage.getWeather();
  },
  populateData(data) {
    const { feel, temp, humidity, cityResult, pressure } = this.allSelectors();
    const {
      name,
      main: { temp: tempC, pressure: pressureC, humidity: humidityC },
      weather,
    } = data;
    cityResult.textContent = name;
    temp.textContent = `Now Temp is ${tempC}°C`;
    pressure.textContent = `Now pressure is ${pressureC}km/h`;
    humidity.textContent = `Now Humidity is ${humidityC}°C`;
  },
  init() {
    const { formElm } = this.allSelectors();
    formElm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { country, city } = this.getInputValues();
      this.resetInput(city, country);
      const isValid = this.validateInput(country, city);
      if (!isValid) return;
      tempStorage.country = country;
      tempStorage.city = city;

      const data = await this.handleRemoteData();
      console.log(data);
      this.populateData(data);
    });
  },
};
UI.init();
