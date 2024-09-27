import { displayProductComponents, fetchProductData, generateProductComponents, showArrow } from './modules/utils.js';

const mainFunction = async () => {
  const fetchedData = await fetchProductData('https://veryfast.io/t/front_test_api.php');
  const productItems = generateProductComponents(fetchedData);

  displayProductComponents(productItems);

  // disable arrow pointer on mobile devices
  if (window.innerWidth < 768) return;

  for (const item of productItems) {
    const downloadBtn = item.querySelector('[data-download-btn]');
    const url = downloadBtn.getAttribute('href');

    downloadBtn.addEventListener('click', (e) => {
      // prevent page reload for Firefox
      e.preventDefault();  
      window.location.href = url;

      showArrow();
    });
  }
}

document.addEventListener('DOMContentLoaded', mainFunction);



