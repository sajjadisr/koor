// سرویس مکان‌ها مبتنی بر Firebase - جایگزین فراخوانی‌های API بک‌اند
import { 
  getFirestoreInstance, 
  getAuthInstance 
} from './firebase-config.js';

// داده‌های نمونه مکان‌ها برای نمایش
const MOCK_PLACES = [
  {
    id: '۱',
    name: 'رستوران باغ ایرانی',
    address: 'تهران، ایران',
    category: 'restaurant',
    rating: ۴.۵,
    reviews: ۱۲۸,
    types: ['restaurant', 'food', 'persian'],
    photos: ['https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=رستوران+ایرانی'],
    description: 'غذای اصیل ایرانی در محیطی زیبا و باغ‌مانند'
  },
  {
    id: '۲',
    name: 'برج آزادی',
    address: 'تهران، ایران',
    category: 'attraction',
    rating: ۴.۸,
    reviews: ۲۵۶,
    types: ['attraction', 'landmark', 'monument'],
    photos: ['https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=برج+آزادی'],
    description: 'نماد تاریخی و نماد شهر تهران'
  },
  {
    id: '۳',
    name: 'کافه نادری',
    address: 'تهران، ایران',
    category: 'cafe',
    rating: ۴.۳,
    reviews: ۸۹,
    types: ['cafe', 'coffee', 'cultural'],
    photos: ['https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=کافه+نادری'],
    description: 'کافه تاریخی با اهمیت فرهنگی'
  },
  {
    id: '۴',
    name: 'هتل بزرگ تهران',
    address: 'تهران، ایران',
    category: 'hotel',
    rating: ۴.۶,
    reviews: ۲۰۳,
    types: ['hotel', 'lodging', 'luxury'],
    photos: ['https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=هتل+بزرگ'],
    description: 'اقامتگاه لوکس در قلب تهران'
  },
  {
    id: '۵',
    name: 'بازار تجریش',
    address: 'تهران، ایران',
    category: 'shopping',
    rating: ۴.۴,
    reviews: ۱۵۶,
    types: ['shopping', 'market', 'traditional'],
    photos: ['https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=بازار+تجریش'],
    description: 'بازار سنتی با کالاها و صنایع دستی محلی'
  }
];

// جستجوی مکان‌ها با استفاده از Firebase و داده‌های نمونه
export async function searchPlaces(query, category = '', type = 'text') {
  try {
    // فیلتر کردن مکان‌های نمونه بر اساس معیارهای جستجو
    let filteredPlaces = MOCK_PLACES;
    
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase();
      filteredPlaces = filteredPlaces.filter(place => 
        place.name.toLowerCase().includes(searchTerm) ||
        place.address.toLowerCase().includes(searchTerm) ||
        place.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (category && category.trim()) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.category === category
      );
    }
    
    // شبیه‌سازی تأخیر API
    await new Promise(resolve => setTimeout(resolve, ۵۰۰));
    
    // ذخیره جستجو در Firebase برای تحلیل
    await storeSearchInFirebase(query, category, filteredPlaces.length);
    
    // بازگرداندن نتایج فرمت شده
    return filteredPlaces.map(place => ({
      place_id: place.id,
      name: place.name,
      vicinity: place.address,
      rating: place.rating,
      user_ratings_total: place.reviews,
      types: place.types,
      photos: place.photos,
      formatted_address: place.address,
      geometry: {
        location: {
          lat: () => ۳۵.۶۸۹۲ + (Math.random() - ۰.۵) * ۰.۱, // منطقه تهران
          lng: () => ۵۱.۳۸۹۰ + (Math.random() - ۰.۵) * ۰.۱
        }
      }
    }));
    
  } catch (error) {
    console.error('جستجو ناموفق بود:', error);
    throw new Error('جستجو ناموفق بود. لطفاً دوباره تلاش کنید.');
  }
}

// دریافت جزئیات مکان
export async function getPlaceDetails(placeId) {
  try {
    const place = MOCK_PLACES.find(p => p.id === placeId);
    if (!place) {
      throw new Error('مکان یافت نشد');
    }
    
    // شبیه‌سازی تأخیر API
    await new Promise(resolve => setTimeout(resolve, ۳۰۰));
    
    return {
      place_id: place.id,
      name: place.name,
      vicinity: place.address,
      rating: place.rating,
      user_ratings_total: place.reviews,
      types: place.types,
      photos: place.photos,
      formatted_address: place.address,
      opening_hours: {
        open_now: Math.random() > ۰.۵
      },
      price_level: Math.floor(Math.random() * ۴) + ۱
    };
    
  } catch (error) {
    console.error('دریافت جزئیات مکان ناموفق بود:', error);
    throw new Error('بارگذاری جزئیات مکان ناموفق بود');
  }
}

// دریافت نظرات مکان
export async function getPlaceReviews(placeId) {
  try {
    // تولید نظرات نمونه
    const mockReviews = [
      {
        author_name: 'احمد ک.',
        rating: ۵,
        text: 'مکان عالی! به شدت توصیه می‌شود.',
        time: Date.now() / ۱۰۰۰ - ۸۶۴۰۰ // ۱ روز پیش
      },
      {
        author_name: 'سارا م.',
        rating: ۴,
        text: 'تجربه خوبی بود، دوباره خواهم رفت.',
        time: Date.now() / ۱۰۰۰ - ۱۷۲۸۰۰ // ۲ روز پیش
      },
      {
        author_name: 'رضا ح.',
        rating: ۵,
        text: 'جو و خدمات شگفت‌انگیز!',
        time: Date.now() / ۱۰۰۰ - ۲۵۹۲۰۰ // ۳ روز پیش
      }
    ];
    
    // شبیه‌سازی تأخیر API
    await new Promise(resolve => setTimeout(resolve, ۲۰۰));
    
    return mockReviews;
    
  } catch (error) {
    console.error('دریافت نظرات ناموفق بود:', error);
    return [];
  }
}

// ذخیره جستجو در Firebase برای تحلیل
async function storeSearchInFirebase(query, category, resultCount) {
  try {
    const db = getFirestoreInstance();
    const auth = getAuthInstance();
    
    const { addDoc, collection } = await import('firebase/firestore');
    
    const searchData = {
      query: query || 'کشف',
      category: category || 'همه',
      resultCount,
      userId: auth.currentUser?.uid || 'ناشناس',
      timestamp: new Date(),
      source: 'جستجوی_firebase'
    };
    
    await addDoc(collection(db, 'searches'), searchData);
    console.log('جستجو در Firebase ذخیره شد:', searchData);
    
  } catch (error) {
    console.log('ذخیره جستجو در Firebase ناموفق بود:', error.message);
    // خطای غیر بحرانی، پرتاب نکن
  }
}

// افزودن مکان جدید (برای عملکرد مدیریت)
export async function addPlace(placeData) {
  try {
    const db = getFirestoreInstance();
    const { addDoc, collection } = await import('firebase/firestore');
    
    const place = {
      ...placeData,
      createdAt: new Date(),
      updatedAt: new Date(),
      addedBy: 'مدیر' // در اپ واقعی، این شناسه کاربر خواهد بود
    };
    
    const docRef = await addDoc(collection(db, 'places'), place);
    console.log('مکان با شناسه اضافه شد:', docRef.id);
    
    return { success: true, id: docRef.id };
    
  } catch (error) {
    console.error('افزودن مکان ناموفق بود:', error);
    return { success: false, error: error.message };
  }
}

// دریافت همه مکان‌ها از Firebase (برای پنل مدیریت)
export async function getAllPlaces() {
  try {
    const db = getFirestoreInstance();
    const { getDocs, collection, orderBy, limit } = await import('firebase/firestore');
    
    const q = collection(db, 'places');
    const querySnapshot = await getDocs(q);
    
    const places = [];
    querySnapshot.forEach((doc) => {
      places.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: places };
    
  } catch (error) {
    console.error('دریافت مکان‌ها ناموفق بود:', error);
    return { success: false, error: error.message };
  }
}
