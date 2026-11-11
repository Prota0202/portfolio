/** Dev-only brand for filming; production builds keep real name. */
export const isFilmBrand = import.meta.env.DEV;
const BRAND = 'Flex3';
const BRAND_LOGO = 'FLEX3';

export function filmReplace(text) {
  if (!isFilmBrand || typeof text !== 'string') return text;
  return text
    .replace(/Abdelbadi Lababidi/gi, BRAND)
    .replace(/Abdelbadi/gi, BRAND)
    .replace(/ABDELBADI/g, BRAND_LOGO);
}

export function applyFilmBrandUI() {
  if (!isFilmBrand) return;
  const loaderWord = document.querySelector('.loader__word');
  if (loaderWord) loaderWord.textContent = BRAND_LOGO;
  const logo = document.getElementById('logo');
  if (logo) logo.innerHTML = `${BRAND_LOGO}<span class="dot"></span>`;
}

export function filmConsoleLabel() {
  return isFilmBrand ? `${BRAND_LOGO}•` : 'ABDELBADI•';
}
