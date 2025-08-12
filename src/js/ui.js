// ابزارها و اجزای رابط کاربری برای اپلیکیشن فارسی‌محور کوره
import { getPlaceDetails, getPlaceReviews } from './firebase-places.js';

// برچسب‌های دسته‌بندی فارسی
const CATEGORY_LABELS = {
  restaurant: 'رستوران',
  cafe: 'کافه',
  hotel: 'هتل',
  attraction: 'جاذبه',
  shopping: 'مرکز خرید',
  gym: 'باشگاه',
  salon: 'آرایشگاه',
  barber: 'آرایشگاه مردانه',
  school: 'آموزشگاه',
  clinic: 'کلینیک'
};

// برچسب‌های امتیازدهی فارسی
const RATING_LABELS = {
  1: 'خیلی ضعیف',
  2: 'ضعیف',
  3: 'متوسط',
  4: 'خوب',
  5: 'عالی'
};

// تابع تبدیل اعداد انگلیسی به فارسی
function toPersianNumbers(num) {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianNumbers[d]);
}

export function displayResults(results) {
  const container = document.getElementById('placesContainer');
  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3 class="no-results-title">مکانی یافت نشد</h3>
        <p class="no-results-description">لطفاً کلمات کلیدی دیگری امتحان کنید یا دسته‌بندی را تغییر دهید</p>
      </div>
    `;
    return;
  }

  const resultsHTML = results.map(place => createPlaceCard(place)).join('');
  container.innerHTML = resultsHTML;

  // افزودن گوش‌دهندگان رویداد به کارت‌های مکان
  addPlaceCardEventListeners();
}

function createPlaceCard(place) {
  const categoryLabel = CATEGORY_LABELS[place.types?.[0]] || 'مکان';
  const rating = place.rating || 0;
  const reviewCount = place.user_ratings_total || 0;
  
  return `
    <div class="place-card" data-place-id="${place.place_id}">
      <div class="place-image">
        <img src="${place.photos?.[0] || 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=تصویر+موجود+نیست'}" 
             alt="${place.name}" 
             loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=تصویر+موجود+نیست'">
        <div class="place-category">${categoryLabel}</div>
      </div>
      
      <div class="place-content">
        <div class="place-header">
          <h3 class="place-name">${place.name}</h3>
          <div class="place-rating">
            <div class="rating-stars">
              ${generateStarRating(rating)}
            </div>
            <span class="rating-text">${RATING_LABELS[Math.round(rating)] || 'بدون امتیاز'}</span>
          </div>
        </div>
        
        <div class="place-details">
          <div class="place-address">
            <span class="detail-icon">📍</span>
            <span>${place.vicinity || place.formatted_address || 'آدرس موجود نیست'}</span>
          </div>
          
          ${reviewCount > 0 ? `
            <div class="place-reviews">
              <span class="detail-icon">💬</span>
              <span>${toPersianNumbers(reviewCount)} نظر</span>
            </div>
          ` : ''}
        </div>
        
        <div class="place-actions">
          <button class="btn btn-outline btn-details" onclick="showPlaceDetails('${place.place_id}')">
            <span class="btn-icon">ℹ️</span>
            جزئیات بیشتر
          </button>
          <button class="btn btn-outline btn-reviews" onclick="showPlaceReviews('${place.place_id}')">
            <span class="btn-icon">⭐</span>
            نظرات
          </button>
        </div>
      </div>
    </div>
  `;
}

function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let stars = '';
  
  // ستاره‌های کامل
  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="star star-full">⭐</span>';
  }
  
  // نیم ستاره
  if (hasHalfStar) {
    stars += '<span class="star star-half">⭐</span>';
  }
  
  // ستاره‌های خالی
  for (let i = 0; i < emptyStars; i++) {
    stars += '<span class="star star-empty">☆</span>';
  }
  
  return stars;
}

function addPlaceCardEventListeners() {
  const placeCards = document.querySelectorAll('.place-card');
  placeCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // اگر روی دکمه‌ها کلیک شده، فعال نشود
      if (e.target.closest('.btn')) return;
      
      const placeId = card.dataset.placeId;
      showPlaceDetails(placeId);
    });
  });
}

export async function showPlaceDetails(placeId) {
  try {
    showLoading();
    
    const place = await getPlaceDetails(placeId);
    const reviews = await getPlaceReviews(placeId);
    
    const modal = createPlaceDetailsModal(place, reviews);
    document.body.appendChild(modal);
    
    // نمایش مودال
    setTimeout(() => {
      modal.classList.add('show');
    }, 100);
    
    // عملکرد بستن مودال
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    overlay.addEventListener('click', () => closeModal(modal));
    
    // بستن با کلید Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(modal);
      }
    });
    
  } catch (error) {
    console.error('خطا در بارگذاری جزئیات مکان:', error);
    showNotification('خطا در بارگذاری جزئیات مکان', 'error');
  } finally {
    hideLoading();
  }
}

export async function showPlaceReviews(placeId) {
  try {
    showLoading();
    
    const place = await getPlaceDetails(placeId);
    const reviews = await getPlaceReviews(placeId);
    
    const modal = createReviewsModal(place, reviews);
    document.body.appendChild(modal);
    
    // نمایش مودال
    setTimeout(() => {
      modal.classList.add('show');
    }, 100);
    
    // عملکرد بستن مودال
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    overlay.addEventListener('click', () => closeModal(modal));
    
    // بستن با کلید Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(modal);
      }
    });
    
  } catch (error) {
    console.error('خطا در بارگذاری نظرات:', error);
    showNotification('خطا در بارگذاری نظرات', 'error');
  } finally {
    hideLoading();
  }
}

function createPlaceDetailsModal(place, reviews) {
  const categoryLabel = CATEGORY_LABELS[place.types?.[0]] || 'مکان';
  const rating = place.rating || 0;
  const reviewCount = place.user_ratings_total || 0;
  
  return `
    <div class="modal" id="placeDetailsModal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">جزئیات ${place.name}</h2>
          <button class="modal-close" aria-label="بستن">×</button>
        </div>
        
        <div class="modal-body">
          <div class="place-details-grid">
            <div class="place-image-large">
              <img src="${place.photos?.[0] || 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=تصویر+موجود+نیست'}" 
                   alt="${place.name}" 
                   loading="lazy">
            </div>
            
            <div class="place-info">
              <div class="place-category-badge">${categoryLabel}</div>
              
              <div class="place-rating-large">
                <div class="rating-stars-large">
                  ${generateStarRating(rating)}
                </div>
                <div class="rating-details">
                  <span class="rating-score">${toPersianNumbers(rating.toFixed(1))}</span>
                  <span class="rating-label">${RATING_LABELS[Math.round(rating)] || 'بدون امتیاز'}</span>
                  <span class="rating-count">${toPersianNumbers(reviewCount)} نظر</span>
                </div>
              </div>
              
              <div class="place-address-large">
                <span class="detail-icon">📍</span>
                <span>${place.formatted_address || place.vicinity || 'آدرس موجود نیست'}</span>
              </div>
              
              ${place.opening_hours ? `
                <div class="place-hours">
                  <span class="detail-icon">🕒</span>
                  <span>${place.opening_hours.open_now ? 'در حال حاضر باز است' : 'در حال حاضر بسته است'}</span>
                </div>
              ` : ''}
              
              ${place.price_level ? `
                <div class="place-price">
                  <span class="detail-icon">💰</span>
                  <span>سطح قیمت: ${'$'.repeat(place.price_level)}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          ${reviews.length > 0 ? `
            <div class="reviews-preview">
              <h3 class="reviews-title">آخرین نظرات</h3>
              <div class="reviews-list">
                ${reviews.slice(0, 3).map(review => createReviewItem(review)).join('')}
              </div>
              ${reviews.length > 3 ? `
                <button class="btn btn-outline btn-full" onclick="showPlaceReviews('${place.place_id}')">
                  مشاهده همه نظرات (${toPersianNumbers(reviews.length)})
                </button>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function createReviewsModal(place, reviews) {
  const categoryLabel = CATEGORY_LABELS[place.types?.[0]] || 'مکان';
  
  return `
    <div class="modal" id="reviewsModal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">نظرات ${place.name}</h2>
          <button class="modal-close" aria-label="بستن">×</button>
        </div>
        
        <div class="modal-body">
          <div class="place-summary">
            <div class="place-category-badge">${categoryLabel}</div>
            <h3 class="place-name">${place.name}</h3>
          </div>
          
          ${reviews.length > 0 ? `
            <div class="reviews-container">
              <div class="reviews-stats">
                <span class="reviews-count">${toPersianNumbers(reviews.length)} نظر</span>
                <span class="reviews-average">میانگین امتیاز: ${toPersianNumbers((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))}</span>
              </div>
              
              <div class="reviews-list-full">
                ${reviews.map(review => createReviewItem(review, true)).join('')}
              </div>
            </div>
          ` : `
            <div class="no-reviews">
              <div class="no-reviews-icon">💬</div>
              <h3 class="no-reviews-title">هنوز نظری ثبت نشده</h3>
              <p class="no-reviews-description">اولین نفری باشید که نظر می‌دهد</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function createReviewItem(review, full = false) {
  const date = new Date(review.time * 1000);
  const formattedDate = date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
    <div class="review-item ${full ? 'review-item-full' : ''}">
      <div class="review-header">
        <div class="review-author">${review.author_name}</div>
        <div class="review-rating">
          ${generateStarRating(review.rating)}
        </div>
        <div class="review-date">${formattedDate}</div>
      </div>
      
      ${review.text ? `
        <div class="review-text">${review.text}</div>
      ` : ''}
    </div>
  `;
}

function closeModal(modal) {
  modal.classList.remove('show');
  setTimeout(() => {
    if (modal.parentElement) {
      modal.remove();
    }
  }, 300);
}

export function showLoading() {
  // ایجاد نشانگر بارگذاری
  const loading = document.createElement('div');
  loading.id = 'loading';
  loading.className = 'loading';
  loading.innerHTML = `
    <div class="loading-spinner"></div>
    <p class="loading-text">در حال بارگذاری...</p>
  `;
  
  document.body.appendChild(loading);
  
  // نمایش با انیمیشن
  setTimeout(() => {
    loading.classList.add('show');
  }, 10);
}

export function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.remove('show');
    setTimeout(() => {
      if (loading.parentElement) {
        loading.remove();
      }
    }, 300);
  }
}

// نمایش اعلان
export function showNotification(message, type = 'info') {
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
export { createPlaceCard, generateStarRating };

// Make functions globally available for onclick handlers
window.showPlaceDetails = showPlaceDetails;
window.showPlaceReviews = showPlaceReviews;
