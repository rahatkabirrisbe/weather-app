const localStorageData = {
  city: "",
  country: "",
  setData() {
    localStorage.setItem("city", this.city);
    localStorage.setItem("country", this.country);
  },
  getData() {
    return {
      city: localStorage.getItem("city"),
      country: localStorage.getItem("country"),
    };
  },
};
const tempWeatherData = {
  city: "",
  country: "",
  apiKey: "402b490eedfbbbcd75ad8fe545cfc09e",
  async getWether() {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&appid=${this.apiKey}&units=metric `
      );
      return await res.json();

      // console.log(data);
      //   return {
      //     name,
      //     main,
      //     weather,
      //   };
    } catch (error) {
      //   console.log("error something", error);
      UI.showErrorMsg("Your Input invalid & problem to fetching Data");
    }
  },
};
const UI = {
  allSelectors() {
    // const formElm = document.querySelector("#form"),
    //   countryInput = document.querySelector("#country"),
    //   cityInput = document.querySelector("#city"),
    //   errorMsg = document.querySelector("#messageWrapper"),
    //   cityResult = document.querySelector("#w-city"),
    //   temp = document.querySelector("#w-temp"),
    //   pressure = document.querySelector("#w-pressure"),
    //   humidity = document.querySelector("#w-humidity"),
    //   icon = document.querySelector("#w-icon"),
    //   feel = document.querySelector("#w-feel");

    return {
      formElm: document.querySelector("#form"),
      countryInput: document.querySelector("#country"),
      cityInput: document.querySelector("#city"),
      errorMsg: document.querySelector("#messageWrapper"),
      cityResult: document.querySelector("#w-city"),
      tempEl: document.querySelector("#w-temp"),
      pressureEl: document.querySelector("#w-pressure"),
      humidityEl: document.querySelector("#w-humidity"),
      iconEl: document.querySelector("#w-icon"),
      feelEl: document.querySelector("#w-feel"),
    };
  },
  getInput() {
    const { countryInput, cityInput } = this.allSelectors();
    return {
      country: countryInput.value,
      city: cityInput.value,
    };
  },
  resetInput() {
    const { countryInput, cityInput } = this.allSelectors();
    (countryInput.value = ""), (cityInput.value = "");
  },
  hideErrorMsg() {
    setTimeout(() => {
      document.getElementById("error-massage").remove();
    }, 2000);
  },
  showErrorMsg(msg) {
    const { errorMsg } = this.allSelectors();
    const errorElm = `<div class="alert alert-danger" id="error-massage">${msg}</div>`;
    errorMsg.insertAdjacentHTML("afterbegin", errorElm);
    this.hideErrorMsg();
  },
  checkValidation(country, city) {
    if (country === "" || city === "") {
      this.showErrorMsg("Your Input is not Valid, please try again!");
      return false;
    } else {
      return true;
    }
  },
  async handleRemoteData() {
    return await tempWeatherData.getWether();
  },
  getIconAttr(iconCode) {
    // const iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

    return `http://openweathermap.org/img/w/${iconCode}.png`;
  },
  populateData(data) {
    if (data.cod === "404") {
      this.showErrorMsg(data.message);
    }
    const {
      name,
      main: { temp, humidity, pressure },
      weather,
    } = data;

    const { cityResult, tempEl, pressureEl, humidityEl, iconEl, feelEl } =
      this.allSelectors();

    cityResult.textContent = name;
    feelEl.textContent = weather[0].description;
    tempEl.textContent = `Temperature is ${temp}°C`;
    pressureEl.textContent = `Pressure is ${pressure} km/j`;
    humidityEl.textContent = `Humidity is ${humidity}%`;
    iconEl.setAttribute("src", this.getIconAttr(weather[0].icon));
  },
  initialize() {
    const { formElm } = this.allSelectors();
    formElm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { country, city } = this.getInput();
      this.resetInput();
      //   console.log(country);
      const isValid = this.checkValidation(country, city);
      if (!isValid) return;
      tempWeatherData.city = city;
      tempWeatherData.country = country;
      localStorageData.city = city;
      localStorageData.country = country;
      localStorageData.setData();
      const data = await this.handleRemoteData();
      //   console.log(data);
      this.populateData(data);
    });

    document.addEventListener("DOMContentLoaded", async () => {
      let { city, country } = localStorageData.getData();
      if (!city || !country) {
        city = "dhaka";
        country = "bd";
      }
      tempWeatherData.city = city;
      tempWeatherData.country = country;
      const data = await this.handleRemoteData();
      this.populateData(data);
    });
  },
};

UI.initialize();
