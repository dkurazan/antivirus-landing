import saleBadge from './badgeIcon.js';

// Data fetching function
export const fetchProductData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.result.elements;
  } catch (error) {
    console.error('Fetching data went wrong:', error);

    // Return an error message in case of an error
    return document.querySelector('main').innerHTML = '<h1 style="text-align: center">Fetching data went wrong. Please try again later.</h1>'
  }
}

// Create product item component
const createProductComponent = (data) => {
  const componentBody = document.createElement('li');
  componentBody.classList.add('item');
  let badge;

  if (data.is_best) {
    badge = '<div class="item-header__badge">Best value</div>';
  } else if (data.price_key === '50%') {
    badge = saleBadge;
  } else {
    badge = '';
  }

  componentBody.innerHTML = `
          <div class="item-header">
            ${badge}
            <p class="item-header__price">${'$' + data.amount}<span>/${data.price_key === '50%' ? 'MO' : 'per year'}</span></p>
            ${data.price_key === '50%' ? '<p class="item-header__prev-price">$9.99</span></p>' : ''}
          </div>
          <div class="item__body">
            <p class="item__title">${data.name_prod}</p>
            <p class="item__title bold">${data.license_name}</p>

            <a href="${data.link}" download data-download-btn>
              <span>download</span>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 0C6.72517 0 0 6.71012 0 15C0 23.2899 6.71013 30 15 30C23.2899 30 30 23.2899 30 15C30 6.71012 23.2748 0 15 0ZM12.2768 14.6239H13.2547C13.4654 14.6239 13.6459 14.4584 13.6459 14.2327V8.33501C13.6459 8.12438 13.8114 7.94382 14.0371 7.94382H15.9629C16.1735 7.94382 16.3541 8.10933 16.3541 8.33501V14.2327C16.3541 14.4433 16.5195 14.6239 16.7452 14.6239H17.7231C18.0391 14.6239 18.2196 15 18.0241 15.2558L15.3009 18.671C15.1505 18.8666 14.8495 18.8666 14.6991 18.671L11.991 15.2558C11.7803 15 11.9609 14.6239 12.2768 14.6239ZM23.5155 20.2507V21.65C23.5155 21.8606 23.3501 22.0411 23.1244 22.0411H8.39516H6.86056C6.64993 22.0411 6.46941 21.8756 6.46941 21.65V20.2507V16.4443C6.46941 16.2337 6.63489 16.0532 6.86056 16.0532H8.00401C8.21464 16.0532 8.39516 16.2186 8.39516 16.4443V19.8596C8.39516 20.0702 8.56067 20.2507 8.78635 20.2507H21.1534C21.3641 20.2507 21.5446 20.0853 21.5446 19.8596V16.4443C21.5446 16.2337 21.7101 16.0532 21.9358 16.0532H23.1394C23.35 16.0532 23.5306 16.2186 23.5306 16.4443V20.2507H23.5155Z"
                  fill="white" />
              </svg>
            </a>
          </div>
  `

  return componentBody;
}

// Build an array with all product components
export const generateProductComponents = (productsData) => {
  const components = [];

  for (const dataItem of productsData) {
    const component = createProductComponent(dataItem);

    components.push(component);
  }

  return components;
}

// Get browser name
export const getBrowser = () => {
  const ua = navigator.userAgent;
  const browsers = {
    opera: /OPR/,
    edge: /Edg/,
    firefox: /Firefox/,
    chrome: /Chrome/,
  };

  let browser = Object.entries(browsers).find(([browser, regex]) => regex.test(ua))[0] || "unknown";

  if (browser === 'chrome') {
    const chromeVersion = +ua.match(/Chrome\/(\d+)/)[1];

    chromeVersion < 116 ? browser = 'oldChrome' : browser;
  }

  return browser;
};

// Display all product components
export const displayProductComponents = (components) => {
  const outputList = document.querySelector('[data-items-list]');
  const fragment = document.createDocumentFragment();

  for (const item of components) {
    fragment.appendChild(item);
  }

  outputList.innerHTML = '';
  outputList.appendChild(fragment);
}

// Get arrow config data
const getArrowConfigData = async () => {
  try {
    const configRes = await fetch(window.location.href + '/js/arrowConfig.json');
    const configData = await configRes.json();

    return configData;
  } catch (error) {
    console.error('Fetching config data went wrong:', error);
    return null;
  }
}

// Displays an arrow indicating where user should find the downloaded file, depending on the browser.
export const showArrow = async () => {
  const browser = getBrowser();
  const arrow = document.getElementById('arrow');

  const headerHeight = document.querySelector('header').offsetHeight;
  const hasVerticalScrollbar = document.body.scrollHeight > window.innerHeight;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  const config = await getArrowConfigData();

  // If there is no config data or browser is unknown, disable arrow pointer
  if (!config || browser === 'unknown') return;

  setTimeout(() => {
    if (browser === 'oldChrome') {
      // displays a downward pointing arrow for old chrome
      const footerHeight = document.querySelector('footer').offsetHeight;

      arrow.classList.add('old-chrome');
      arrow.classList.add('visible');
      arrow.style.bottom = `${footerHeight}px`;
      arrow.style.left = `${config.downloadButtonCoords['oldChrome'].left}px`;
    } else {
      // displays a upward pointing arrow for other browsers
      arrow.classList.add('visible');
      arrow.style.top = `${headerHeight}px`;
      arrow.style.right = `${config.downloadButtonCoords[browser].right - (hasVerticalScrollbar ? scrollbarWidth : 0)}px`;
    }

    setTimeout(() => {
      arrow.classList.remove('visible');
    }, config.arrowTimeOuts.hideAfter);
  }, config.arrowTimeOuts.showAfter);

}