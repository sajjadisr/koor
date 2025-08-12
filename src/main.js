// نقطه ورودی اصلی برای اپلیکیشن وب فارسی‌محور کوره
import './style/main.css';
import { initializeApp } from './js/app.js';
import logger from './js/utils/logger.js';

// راه‌اندازی اپلیکیشن هنگامی که DOM بارگذاری شد
document.addEventListener('DOMContentLoaded', () => {
  logger.info('کوره - در حال بارگذاری...');
  
  try {
    // راه‌اندازی اپلیکیشن اصلی
    initializeApp();
    
    logger.info('کوره - با موفقیت بارگذاری شد');
  } catch (error) {
    logger.error('خطا در راه‌اندازی اپلیکیشن کوره:', error);
    
    // نمایش اعلان خطا به کاربر
    const errorMessage = 'خطا در راه‌اندازی اپلیکیشن. لطفاً صفحه را تازه کنید.';
    showErrorNotification(errorMessage);
  }
});

// تابع نمایش اعلان خطا
function showErrorNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification notification-error show';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">❌</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  document.body.appendChild(notification);
}

// مدیریت‌کننده خطای جهانی
window.addEventListener('error', (event) => {
  logger.error('خطای جهانی:', event.error);
});

// مدیریت‌کننده Promise ناموفق
window.addEventListener('unhandledrejection', (event) => {
  logger.error('خطای Promise ناموفق:', event.reason);
});

// ثبت Service Worker برای قابلیت‌های PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        logger.info('Service Worker ثبت شد:', registration);
      })
      .catch((error) => {
        logger.warn('خطا در ثبت Service Worker:', error);
      });
  });
}

// افزودن ابزارهای فارسی‌محور به حوزه جهانی
window.Kooreh = {
  // تابع ابزاری برای فرمت کردن اعداد فارسی
  formatPersianNumber: (num) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (d) => persianNumbers[d]);
  },
  
  // تابع ابزاری برای فرمت کردن تاریخ فارسی
  formatPersianDate: (date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  },
  
  // تابع ابزاری برای دریافت نام‌های ماه فارسی
  getPersianMonthName: (monthIndex) => {
    const persianMonths = [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    return persianMonths[monthIndex];
  }
};

// Make functions available globally for HTML onclick handlers
window.openCitySelector = () => {
  logger.info('City selector opened');
  // TODO: Implement city selection functionality
  showNotification('انتخاب شهر در حال توسعه است', 'info');
};

window.openFilters = () => {
  logger.info('Filters opened');
  // TODO: Implement filters functionality
  showNotification('فیلترها در حال توسعه است', 'info');
};

window.selectCategory = (category) => {
  // Import and call the function from app.js
  import('./js/app.js').then(module => {
    module.selectCategory(category);
  });
};

window.selectSuggestion = (text) => {
  // Import and call the function from app.js
  import('./js/app.js').then(module => {
    module.selectSuggestion(text);
  });
};

window.handleSearch = () => {
  // Import and call the function from app.js
  import('./js/app.js').then(module => {
    module.handleSearch();
  });
};

window.hideSearchSuggestions = () => {
  // Import and call the function from app.js
  import('./js/app.js').then(module => {
    module.hideSearchSuggestions();
  });
};

// Helper function for notifications
function showNotification(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Hide automatically after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// افزودن میانبرهای صفحه کلید برای کاربران فارسی
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K برای تمرکز روی جستجو
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }
  
  // Escape برای بستن پیشنهادات جستجو
  if (e.key === 'Escape') {
    const suggestions = document.querySelector('.search-suggestions.show');
    if (suggestions) {
      suggestions.classList.remove('show');
    }
  }
});

// افزودن polyfill اسکرول نرم برای مرورگرهای قدیمی
if (!('scrollBehavior' in document.documentElement.style)) {
  const smoothScrollPolyfill = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };
  
  // اعمال polyfill پس از بارگذاری DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', smoothScrollPolyfill);
  } else {
    smoothScrollPolyfill();
  }
}

// افزودن Intersection Observer برای انیمیشن‌ها (در صورت پشتیبانی)
if ('IntersectionObserver' in window) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // مشاهده عناصر برای انیمیشن
  const animateElements = document.querySelectorAll('.category-card, .search-chip');
  animateElements.forEach(el => observer.observe(el));
}

// افزودن CSS برای انیمیشن‌ها
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  .category-card,
  .search-chip {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }
  
  .animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .category-card,
    .search-chip {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
`;

document.head.appendChild(animationStyles);

logger.info('کوره - ابزارهای اضافی بارگذاری شد');
