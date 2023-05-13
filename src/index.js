import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryNameInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.countryNameInput.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

function onInputChange(e) {
  const countryName = e.target.value.trim();

  if (!countryName) {
    clearTemplate();
    return;
  }

  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        specificNameInfo();
        clearTemplate();
        return;
      }
      renderTemplate(data);
    })
    .catch(error => {
      clearTemplate();
      errorWarn();
    });
}

function renderTemplate(elements) {
  let template = '';
  let refsTemplate = '';
  clearTemplate();

  if (elements.length === 1) {
    template = createTemplateItem(elements);
    refsTemplate = refs.countryInfo;
  } else {
    template = createTemplateItemList(elements);
    refsTemplate = refs.countryList;
  }

  drawTemplate(refsTemplate, template);
}

function createTemplateItem(element) {
  return element.map(
    ({ name, capital, population, flags, languages }) =>
      `
        <img
          src="${flags.svg}" 
          alt="${name.official}" 
          width="120" 
          height="80">
        <h1 class="country-info__title">${name.official}</h1>
        <ul class="country-info__list">
            <li class="country-info__item">
            <span>Capital:</span>
          ${capital}
            </li>
            <li class="country-info__item">
            <span>Population:</span>
            ${population}
            </li>
            <li class="country-info__item">
            <span>Lenguages:</span>
            ${Object.values(languages)}
            </li>
        </ul>
    `
  );
}

function createTemplateItemList(elements) {
  return elements
    .map(
      ({ name, flags }) => `
        <li class="country-list__item">
          <img class="country-list__img" 
            src="${flags.svg}" 
            alt="${name.official}" 
            width="60" 
            height="40">
          ${name.official}
        </li>`
    )
    .join('');
}

function specificNameInfo() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function errorWarn() {
  Notiflix.Notify.failure(`Oops, there is no country with that name`);
}

function clearTemplate() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function drawTemplate(refs, markup) {
  refs.innerHTML = markup;
}
