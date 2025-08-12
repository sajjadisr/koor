// منطق اصلی اپلیکیشن برای اپ فارسی‌محور کوره
import { searchPlaces, getPlaceDetails } from './firebase-places.js';
import { displayResults, showLoading, hideLoading } from './ui.js';
import { initializeMaps } from './maps.js';
import { trackSearch } from './firebase-utils.js';
import logger from './utils/logger.js';

// تابع تبدیل اعداد انگلیسی به فارسی
function toPersianNumbers(num) {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianNumbers[d]);
}

export function initializeApp() {
  logger.info('در حال راه‌اندازی اپلیکیشن کوره...');
  
  // راه‌اندازی گوش‌دهندگان رویداد
  initializeEventListeners();
  
  // راه‌اندازی ناوبری
  initializeNavigation();
  
  // راه‌اندازی نقشه‌ها در صورت موجود بودن
  initializeMaps();
  
  logger.info('اپلیکیشن کوره با موفقیت راه‌اندازی شد');
}

function initializeEventListeners() {
  // جستجوی زنده
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleLiveSearch);
    searchInput.addEventListener('focus', showSearchSuggestions);
  }
  
  // انتخاب دسته‌بندی
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      selectCategory(category);
    });
  });
  
  // انتخاب پیشنهادات جستجو
  const searchChips = document.querySelectorAll('.search-chip');
  searchChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent.trim();
      selectSuggestion(text);
    });
  });
}

function initializeNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.getAttribute('onclick').match(/'([^']+)'/)[1];
      selectNavItem(item, section);
    });
  });
}

// انتخاب آیتم ناوبری
export function selectNavItem(clickedItem, section) {
  // حذف کلاس فعال از همه آیتم‌ها
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // اضافه کردن کلاس فعال به آیتم کلیک شده
  clickedItem.classList.add('active');
  
  // نمایش بخش مربوطه
  showSection(section);
}

function showSection(section) {
  // مخفی کردن همه بخش‌ها
  const sections = ['home', 'search', 'maps', 'favorites', 'profile'];
  sections.forEach(s => {
    const element = document.getElementById(s + 'Section');
    if (element) element.style.display = 'none';
  });
  
  // نمایش بخش انتخاب شده
  switch(section) {
    case 'home':
      document.getElementById('categoriesSection').style.display = 'block';
      document.getElementById('resultsSection').style.display = 'none';
      document.getElementById('searchPage').style.display = 'none';
      break;
    case 'search':
      document.getElementById('categoriesSection').style.display = 'none';
      document.getElementById('resultsSection').style.display = 'none';
      document.getElementById('searchPage').style.display = 'block';
      break;
    case 'maps':
      // نمایش بخش نقشه
      break;
    case 'favorites':
      // نمایش بخش علاقه‌مندی‌ها
      break;
    case 'profile':
      // نمایش بخش پروفایل
      break;
  }
}

// انتخاب دسته‌بندی
export function selectCategory(category) {
  logger.info('دسته‌بندی انتخاب شد:', category);
  
  // تغییر متن جستجو
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.value = '';
    searchInput.placeholder = `جستجو در ${getCategoryLabel(category)}`;
  }
  
  // نمایش بخش نتایج
  document.getElementById('categoriesSection').style.display = 'none';
  document.getElementById('searchPage').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'block';
  
  // به‌روزرسانی عنوان نتایج
  const resultsTitle = document.getElementById('resultsTitle');
  if (resultsTitle) {
    resultsTitle.textContent = `${getCategoryLabel(category)}های تهران`;
  }
  
  // جستجوی خودکار
  searchPlacesByCategory(category);
}

function getCategoryLabel(category) {
  const labels = {
    gym: 'باشگاه',
    salon: 'آرایشگاه',
    barber: 'آرایشگاه مردانه',
    school: 'آموزشگاه',
    clinic: 'کلینیک',
    restaurant: 'رستوران'
  };
  return labels[category] || 'مکان';
}

async function searchPlacesByCategory(category) {
  try {
    showLoading();
    
    // جستجو برای مکان‌ها در دسته‌بندی انتخاب شده
    const results = await searchPlaces('', category);
    
    // نمایش نتایج
    displayResults(results);
    
    // به‌روزرسانی تعداد نتایج
    updateResultsCount(results.length);
    
    // ردیابی آمار جستجو
    try {
      await trackSearch(category, 'دسته‌بندی', results.length);
    } catch (firebaseError) {
      logger.warn('خطا در ثبت آمار جستجو (غیر بحرانی):', firebaseError);
    }
    
    // نمایش اعلان موفقیت
    if (results.length > 0) {
      showNotification(`${toPersianNumbers(results.length)} مکان یافت شد`, 'success');
    } else {
      showNotification('مکانی در این دسته‌بندی یافت نشد', 'info');
    }
    
  } catch (error) {
    logger.error('جستجو ناموفق بود:', error);
    showNotification('جستجو ناموفق بود. لطفاً دوباره تلاش کنید', 'error');
  } finally {
    hideLoading();
  }
}

// انتخاب پیشنهاد جستجو
export function selectSuggestion(text) {
  logger.info('پیشنهاد انتخاب شد:', text);
  
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.value = text;
    searchInput.focus();
  }
  
  // اجرای جستجو
  handleSearch();
}

// جستجوی زنده
function handleLiveSearch(event) {
  const query = event.target.value.trim();
  
  if (query.length < 2) {
    hideSearchSuggestions();
    return;
  }
  
  // نمایش پیشنهادات جستجو
  showSearchSuggestions(query);
}

// نمایش پیشنهادات جستجو
function showSearchSuggestions(query = '') {
  const suggestionsContainer = document.getElementById('searchSuggestions');
  if (!suggestionsContainer) return;
  
  if (!query) {
    // نمایش پیشنهادات پیش‌فرض
    const defaultSuggestions = [
      { text: 'باشگاه بدنسازی', icon: '💪' },
      { text: 'آرایشگاه زنانه', icon: '💇' },
      { text: 'رستوران ایرانی', icon: '🍽' },
      { text: 'کافه', icon: '☕' },
      { text: 'کلینیک دندان', icon: '🦷' }
    ];
    
    const suggestionsHTML = defaultSuggestions.map(suggestion => `
      <div class="suggestion-item" onclick="selectSuggestion('${suggestion.text}')">
        <svg class="suggestion-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <span>${suggestion.text}</span>
      </div>
    `).join('');
    
    suggestionsContainer.innerHTML = suggestionsHTML;
  } else {
    // نمایش پیشنهادات بر اساس جستجو
    const filteredSuggestions = [
      { text: `${query} در تهران`, icon: '📍' },
      { text: `${query} نزدیک من`, icon: '🎯' },
      { text: `بهترین ${query}`, icon: '⭐' }
    ];
    
    const suggestionsHTML = filteredSuggestions.map(suggestion => `
      <div class="suggestion-item" onclick="selectSuggestion('${suggestion.text}')">
        <svg class="suggestion-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <span>${suggestion.text}</span>
      </div>
    `).join('');
    
    suggestionsContainer.innerHTML = suggestionsHTML;
  }
  
  suggestionsContainer.classList.add('show');
}

// مخفی کردن پیشنهادات جستجو
export function hideSearchSuggestions() {
  const suggestionsContainer = document.getElementById('searchSuggestions');
  if (suggestionsContainer) {
    suggestionsContainer.classList.remove('show');
  }
}

// جستجو
export function handleSearch() {
  const searchInput = document.querySelector('.search-input');
  if (!searchInput) return;
  
  const query = searchInput.value.trim();
  
  if (!query) {
    showNotification('لطفاً کلمه‌ای برای جستجو وارد کنید', 'error');
    return;
  }
  
  // مخفی کردن پیشنهادات
  hideSearchSuggestions();
  
  // نمایش بخش نتایج
  document.getElementById('categoriesSection').style.display = 'none';
  document.getElementById('searchPage').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'block';
  
  // به‌روزرسانی عنوان نتایج
  const resultsTitle = document.getElementById('resultsTitle');
  if (resultsTitle) {
    resultsTitle.textContent = `نتایج جستجو برای "${query}"`;
  }
  
  // اجرای جستجو
  performSearch(query);
}

async function performSearch(query) {
  try {
    showLoading();
    
    // جستجو برای مکان‌ها
    const results = await searchPlaces(query);
    
    // نمایش نتایج
    displayResults(results);
    
    // به‌روزرسانی تعداد نتایج
    updateResultsCount(results.length);
    
    // ردیابی آمار جستجو
    try {
      await trackSearch(query, 'جستجو', results.length);
    } catch (firebaseError) {
      logger.warn('خطا در ثبت آمار جستجو (غیر بحرانی):', firebaseError);
    }
    
    // نمایش اعلان موفقیت
    if (results.length > 0) {
      showNotification(`${toPersianNumbers(results.length)} مکان یافت شد`, 'success');
    } else {
      showNotification('مکانی یافت نشد. لطفاً کلمات کلیدی دیگری امتحان کنید', 'info');
    }
    
  } catch (error) {
    logger.error('جستجو ناموفق بود:', error);
    showNotification('جستجو ناموفق بود. لطفاً دوباره تلاش کنید', 'error');
  } finally {
    hideLoading();
  }
}

function updateResultsCount(count) {
  const resultsCount = document.getElementById('resultsCount');
  if (resultsCount) {
    resultsCount.textContent = `${toPersianNumbers(count)} نتیجه یافت شد`;
  }
}

function showNotification(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // مخفی کردن خودکار پس از ۳ ثانیه
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Export for testing
export { handleSearch, selectCategory, showNotification };

// Missing functions referenced in HTML
export function openCitySelector() {
  logger.info('City selector opened');
  // TODO: Implement city selection functionality
  showNotification('انتخاب شهر در حال توسعه است', 'info');
}

export function openFilters() {
  logger.info('Filters opened');
  // TODO: Implement filters functionality
  showNotification('فیلترها در حال توسعه است', 'info');
}
