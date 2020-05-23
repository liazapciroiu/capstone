// DOM elements
const inputCheckIn = document.getElementById('date-checkin');
const inputCheckOut = document.getElementById('date-checkout');
const inputCity = document.getElementById('location');
const tripsSection = document.getElementById('trip-cards');

// Event listener onSubmit
const handleApp = async (event) => {
  event.preventDefault();

  // store the values from inputs and apis
  let dataStorage = {};
  dataStorage.checkinDate = inputCheckIn.value;
  dataStorage.checkoutDate = inputCheckOut.value;
  dataStorage.city = inputCity.value;

  // handle the format dates, countdown and length
  dataStorage.formatCheckIn = dataStorage.checkinDate.split('-').reverse().join('/');
  dataStorage.formatCheckOut = dataStorage.checkoutDate.split('-').reverse().join('/');
  let countdown = Date.parse(dataStorage.checkinDate) - Date.parse(new Date());
  dataStorage.daysLeft = Math.floor(countdown / (1000 * 60 * 60 * 24) + 1);
  dataStorage.length = Math.floor((Date.parse(dataStorage.checkoutDate) - Date.parse(dataStorage.checkinDate)) / (1000 * 60 * 60 * 24));

  // get and store lat, lng, country
  const geonames = await getDataFromGeonames(dataStorage.city);
  dataStorage.lat = geonames.lat;
  dataStorage.lng = geonames.lng;
  dataStorage.countryCode = geonames.countryCode;

  // get and store forecast
  const weather = await getDataFromWeatherbit(dataStorage.lat, dataStorage.lng);
  dataStorage.high = weather.high;
  dataStorage.low = weather.low;
  dataStorage.description = weather.description;

  // get and store image
  const pixabay = await getDataFromPixabay(dataStorage.city);
  dataStorage.imgURL = pixabay.img;

  // call the UI update with the stored data
  updateUIWithTrip(dataStorage);
}

const getDataFromGeonames = async (cityInput) => {
  const baseUrl = 'http://api.geonames.org/searchJSON?formatted=true&q=';
  const key = '&username=liazapciroiu';
  const completeQuery = baseUrl + cityInput + key + '&style=full';
  const response = await fetch(completeQuery);
  try {
    const data = await response.json();
    data.lat = data.geonames[0].lat;
    data.lng = data.geonames[0].lng;
    data.countryCode = data.geonames[0].countryCode;
    return data;
  } catch (error) {
    console.log('error', error);
    alert('Something went wrong! Please try again.');
  }
}

const getDataFromWeatherbit = async (lat, lng) => {
  const baseUrl = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const key = 'b79272f5ad4a4eb1b59829ee6bb6eb76';
  const query = "?lat=" + `${lat}` + "&lon=" + `${lng}` + "&key=";
  const completeQuery = baseUrl + query + key;
  const response = await fetch(completeQuery);
  try {
    const data = await response.json();
    // get the temps for second day
    data.high = data.data[1].high_temp;
    data.low = data.data[1].app_min_temp;
    data.description = data.data[1].weather.description;
    return data;
  } catch (error) {
    console.log('error', error);
    alert('Something went wrong! Please try again.');
  }
}

const getDataFromPixabay = async (city) => {
  const baseUrl = 'https://pixabay.com/api/?key=';
  const key = '16709162-1b4ed422ee049692d409e34c9';
  const query = `&q=${city}&image_type=photo&pretty=true&category=places`;
  const completeQuery = baseUrl + key + query;
  const response = await fetch(completeQuery);
  try {
    const data = await response.json();
    data.img = data.hits[0].largeImageURL;
    return data;
  } catch (error) {
    console.log('error', error);
    alert('No image found for your city.');
  }
}

const updateUIWithTrip = async (data) => {
  let create = (tag) => document.createElement(tag);
  const newCard = create('article');
  newCard.classList.add('card', 'bg-card');
  const newImg = create('img');
  newImg.setAttribute('src', `${data.imgURL}`);
  newCard.appendChild(newImg);
  const newTextCard = create('div');
  newTextCard.classList.add('card-text');
  const newTitle = create('h3');
  newTitle.innerText = `My trip to ${data.city}, ${data.countryCode}`;
  const newCheckIn = create('p');
  newCheckIn.innerHTML = `<span>Check-in: </span> ${data.formatCheckIn}`;
  const newCheckOut = create('p');
  newCheckOut.innerHTML = `<span>Check-out: </span> ${data.formatCheckOut}`;
  const newDaysLeft = create('p');
  newDaysLeft.innerHTML = `<span>Days left: </span> ${data.daysLeft}`;
  const newLength = create('p');
  newLength.innerHTML = `<span>Length of trip: </span> ${data.length} nights`;
  const newWeather = create('p');
  newWeather.innerHTML = `<span>Weather tomorrow: </span>High - ${data.high} Low - ${data.low} <p> ${data.description} </p>`;
  const newRemoveBtn = create('button');
  newRemoveBtn.classList.add('boxes', 'btn');
  newRemoveBtn.innerText = 'Remove trip';
  newRemoveBtn.setAttribute('id', 'remove-trip');
  newRemoveBtn.setAttribute('onclick', 'return Client.removeTrip(event)');
  newTextCard.append(newTitle, newCheckIn, newCheckOut, newDaysLeft, newLength, newWeather, newRemoveBtn);
  newCard.appendChild(newTextCard);
  tripsSection.prepend(newCard);
}

const removeTrip = (event) => {
  let cardToBeRemoved = event.target.parentNode.parentNode;
  cardToBeRemoved.innerHTML = '';
}

export { handleApp, removeTrip }
