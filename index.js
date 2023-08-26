const userTab = document.querySelector("[data-userWeather]");

const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".Weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");
    
// initialize the variable -------->
// data-searchInput
let oldTab =userTab;

const API_KEY ="d1845658f92b31c64bd94f06f7188c9c";

oldTab.classList.add("current-tab"); 

getfromSessionStorage();

function switchTab(newTab){

    if(newTab!= oldTab){

        oldTab.classList.remove("current-tab");

        oldTab = newTab;

        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){

            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");

            searchForm.classList.add("active");

        }

        else{

            // mai pehle search wale tab pr tha ab mujhe your weather wale tab pr switch karna hai --->

            searchForm.classList.remove("active");

            userInfoContainer.classList.remove("active");


            // ab main weather wale tab mai aa gaya hu toh weather bhi display karna padega . so lets check the local storage first for coordinates if we save them ---->
            getfromSessionStorage();

        }
    }
}
userTab.addEventListener('click',()=>{

    switchTab(userTab);

})


searchTab.addEventListener('click',()=>{

    switchTab(searchTab);
    
})

//check if coordinates are present in session storages ----> 

async function getfromSessionStorage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");

    
    if(!localCoordinates){
        
        // agar local coordinates naii mile ---->

        grantAccessContainer.classList.add("active");

    }

    else{

        const coordinates = JSON.parse(localCoordinates);

        fetchUserWeatherInfo(coordinates);

    }
}

async function fetchUserWeatherInfo(coordinates){

    try{

        const {lat,lon} = coordinates; // yaha se coordinates mil jayenge --->
    
        // make grandAccess conatiner invisible --->
    
        grantAccessContainer.classList.remove("active");
    
        // make loader visible --->
    
        loadingScreen.classList.add("active");
    
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        // grantAccessContainer.classList.add("active");
        userInfoContainer.classList.add("active");
    
        renderWeatherInfo(data);
    }
    catch(e){

        loadingScreen.classList.remove("active");

        // hw 
    }

}

function renderWeatherInfo(weatherInfo){

    // firstly we have to ftech the values ---->

    let cityName = document.querySelector("[data-city-name]");
    let countryIcon = document.querySelector("[data-country-icon]");
    let desc = document.querySelector("[data-weather-desc]");
    let weatherIcon = document.querySelector("[data-weather-icon]");
    let temp = document.querySelector("[data-temp]");
    let windspeed = document.querySelector("[data-windspeed]");
    let humidity = document.querySelector("[data-humidity]");
    let cloud = document.querySelector("[data-cloud]");

    console.log(weatherInfo);
    cityName.innerText = weatherInfo?.name;

    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloud.innerText = `${weatherInfo?.clouds?.all}%`;
}


const grantAccess = document.querySelector("[data-grant-access]");

grantAccess.addEventListener('click',()=>{

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition);

        // let longi = position.coords.longitude;

        // let lati  = position.coords.latitude;

        // sessionStorage.setItem(longi,lati);
    }

    else{

        console.log("not worked ");
    }
})

function showPosition(position){


    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

 
let searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName === ""){

        return;
    }

    else{

        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");

    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{

        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");
        
        renderWeatherInfo(data);
        

    }

    catch(e){

        // hw

        console.log("handle the error ");
    }

}


