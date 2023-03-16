import './css/styles.css';

const DEBOUNCE_DELAY = 300;
import './css/styles.css';

import { fetchCountries } from './api/fetchCountries';
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';


const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input',  debounce(onInput, DEBOUNCE_DELAY));


function onInput(e) {
    e.preventDefault()
    // const searchInpValue = input.value
    const name = input.value.trim()
    // console.log(name);

    if (name === '') {
        return (countryList.innerHTML = ''), (countryInfo.innerHTML = '')
      }
    
   
    fetchCountries(name)
    .then(country => {
        // console.log(country);
        countryList.innerHTML = ''
        countryInfo.innerHTML = ''
        if (country.length === 1) {
          countryList.insertAdjacentHTML('beforeend', createCountryList(country))
          countryInfo.insertAdjacentHTML('beforeend', createCountryInfo(country))
        } else if (country.length >= 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        } else {
          countryList.insertAdjacentHTML('beforeend', createCountryList(country))
        }

        const listItem = document.querySelectorAll('.country-list__item')
        listItem.forEach(list => list.style.display = 'flex');
        listItem.forEach(list => list.style.alignItems = 'center');
        listItem.forEach(list => list.style.gap = '20px');

      })
      .catch(onFetchError)
      .finally(()  => {
        // console.log(input.value);
        input.value = '';
        }
            )
  }
   
    
       


function createCountryList(country) {
    const markup = country.map(({ name, flags  }) => {
    return  ` <li class="country-list__item">
    <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
    <h2 class="country-list__name">${name.official}</h2>
</li>`;
})
.join('');
return markup;;

}

function createCountryInfo(сountry) {
    const markup = сountry
      .map(({ capital, population, languages }) => {
        return `
        <ul class="country-info__list">
        <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
        <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
        <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
    </ul>`;
      })
      .join('');
  
    return markup;
  }
  

function onFetchError () {
    Notiflix.Notify.failure('Oops, there is no country with that name');
}