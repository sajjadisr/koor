        // Firebase Configuration (REPLACE WITH YOUR OWN CONFIG FROM FIREBASE CONSOLE)
const firebaseConfig = {
  apiKey: "AIzaSyBUhFYpviZSDd-XjplnEuJgQEKOVQ9O0dE",
  authDomain: "koreh-d4a98.firebaseapp.com",
  projectId: "koreh-d4a98",
  storageBucket: "koreh-d4a98.firebasestorage.app",
  messagingSenderId: "690624738272",
  appId: "1:690624738272:web:75847121f6900bbaeaf185",
  measurementId: "G-R5CSK0QBK5"
};

        // Initialize Firebase app and services IMMEDIATELY at script load
        const app = firebase.initializeApp(firebaseConfig);
        const auth = app.auth();     // Firebase Authentication service
        const db = app.firestore();  // Firebase Firestore service (for reviews/favorites later if needed client-side)


        // Global variables and mock data (defined AFTER Firebase init)
        let selectedCategory = null;
        let activeFilters = [];
        let currentLocation = 'تهران';
        let searchTimeout;
        let isLoading = false;
        let favorites = []; // These can be connected to Firestore later per user
        let reviews = []; // These can be connected to Firestore later per business/user
        let visits = [];
        let recentSearches = [];
        let observer;

        const mockData = {
            gym: [
                {
                    id: 1,
                    name: 'باشگاه بدنسازی پرند',
                    category: 'باشگاه بدنسازی • مختلط',
                    price: '۳۰۰ هزار تومان',
                    rating: 4.8,
                    reviews: 124,
                    distance: '۱.۲ کیلومتر',
                    highlights: ['پارکینگ رایگان', 'مربی حرفه‌ای', 'تجهیزات جدید'],
                    badge: 'تأیید شده',
                    icon: '💪',
                    phone: '021-12345678'
                },
                {
                    id: 2,
                    name: 'فیتنس پلاس',
                    category: 'باشگاه فیتنس • زنانه',
                    price: '۲۸۰ هزار تومان',
                    rating: 4.6,
                    reviews: 89,
                    distance: '۲.۱ کیلومتر',
                    highlights: ['سونا', 'استخر', 'کلاس گروهی'],
                    badge: 'محبوب',
                    icon: '💪',
                    phone: '021-87654321'
                },
                {
                    id: 3,
                    name: 'ورزشکده المپیا',
                    category: 'ورزشکده • مختلط',
                    price: '۳۵۰ هزار تومان',
                    rating: 4.9,
                    reviews: 56,
                    distance: '۳.۵ کیلومتر',
                    highlights: ['استاندارد بین‌المللی', 'کافه', 'برنامه تغذیه'],
                    badge: 'جدید',
                    icon: '💪',
                    phone: '021-11223344'
                }
            ],
            salon: [
                {
                    id: 4,
                    name: 'سالن زیبایی نوین',
                    category: 'آرایشگاه زنانه • لاکچری',
                    price: '۱۵۰ هزار تومان',
                    rating: 4.7,
                    reviews: 96,
                    distance: '۰.۸ کیلومتر',
                    highlights: ['میکاپ عروس', 'رنگ موی طبیعی', 'ماساژ صورت'],
                    badge: 'تأیید شده',
                    icon: '💇',
                    phone: '021-55667788'
                },
                {
                    id: 5,
                    name: 'آرایشگاه ملکه',
                    category: 'آرایشگاه زنانه • معمولی',
                    price: '۸۰ هزار تومان',
                    rating: 4.4,
                    reviews: 142,
                    distance: '۱.۶ کیلومتر',
                    highlights: ['اصلاح ابرو', 'کوتاهی مو', 'فر مو'],
                    badge: 'محبوب',
                    icon: '💇',
                    phone: '021-99887766'
                }
            ],
            barber: [
                {
                    id: 6,
                    name: 'آرایشگاه مردانه پرشین',
                    category: 'آرایشگاه مردانه • کلاسیک',
                    price: '۵۰ هزار تومان',
                    rating: 4.5,
                    reviews: 73,
                    distance: '۱.۵ کیلومتر',
                    highlights: ['اصلاح ریش', 'کوتاهی مدرن', 'ماساژ سر'],
                    badge: 'تأیید شده',
                    icon: '✂',
                    phone: '021-44556677'
                }
            ],
            restaurant: [
                {
                    id: 7,
                    name: 'رستوران سنتی کوهستان',
                    category: 'رستوران ایرانی • سنتی',
                    price: '۲۰۰ هزار تومان',
                    rating: 4.8,
                    reviews: 203,
                    distance: '۲.۳ کیلومتر',
                    highlights: ['کباب کوبیده', 'محیط سنتی', 'موسیقی زنده'],
                    badge: 'محبوب',
                    icon: '🍽',
                    phone: '021-33445566'
                }
            ],
            school: [
                {
                    id: 8,
                    name: 'آموزشگاه زبان برتر',
                    category: 'آموزشگاه زبان انگلیسی',
                    price: '۱۸۰ هزار تومان',
                    rating: 4.6,
                    reviews: 87,
                    distance: '۱.۹ کیلومتر',
                    highlights: ['استاد بومی', 'کلاس آنلاین', 'گواهینامه معتبر'],
                    badge: 'تأیید شده',
                    icon: '📚',
                    phone: '021-22334455'
                }
            ],
            clinic: [
                {
                    id: 9,
                    name: 'کلینیک دندانپزشکی مهر',
                    category: 'دندانپزشکی • تخصصی',
                    price: '۱۵۰ هزار تومان',
                    rating: 4.9,
                    reviews: 134,
                    distance: '۰.۷ کیلومتر',
                    highlights: ['ایمپلنت', 'ارتودنسی', 'بیهوشی موضعی'],
                    badge: 'تأیید شده',
                    icon: '🏥',
                    phone: '021-66778899'
                }
            ]
        };
        
        // Mock cities data
        const cities = [
            { id: 1, name: 'تهران', region: 'تهران' },
            { id: 2, name: 'مشهد', region: 'خراسان رضوی' },
            { id: 3, name: 'اصفهان', region: 'اصفهان' },
            { id: 4, name: 'کرج', region: 'البرز' },
            { id: 5, name: 'شیراز', region: 'فارس' },
            { id: 6, name: 'تبریز', region: 'آذربایجان شرقی' },
            { id: 7, name: 'اهواز', region: 'خوزستان' },
            { id: 8, name: 'قم', region: 'قم' },
            { id: 9, name: 'کرمان', region: 'کرمان' },
            { id: 10, name: 'رشت', region: 'گیلان' },
            { id: 11, name: 'ارومیه', region: 'آذربایجان غربی' },
            { id: 12, name: 'یزد', region: 'یزد' },
            { id: 13, name: 'زنجان', region: 'زنجان' },
            { id: 14, name: 'ساری', region: 'مازندران' },
            { id: 15, name: 'اراک', region: 'مرکزی' },
            { id: 16, name: 'بندرعباس', region: 'هرمزگان' },
            { id: 17, name: 'خرم آباد', region: 'لرستان' },
            { id: 18, name: 'بوشهر', region: 'بوشهر' },
            { id: 19, name: 'بیرجند', region: 'خراسان جنوبی' },
            { id: 20, name: 'ایلام', region: 'ایلام' }
        ];
        
        // Popular search terms
        const popularSearches = [
            'آرایشگاه زنانه', 'کافه', 'آموزشگاه زبان', 
            'کلینیک دندان', 'باشگاه فیتنس', 'رستوران فست فود',
            'سالن ماساژ', 'آرایشگاه مردانه', 'کتابخانه عمومی'
        ];

        // --- Core Rendering Functions ---
        // Renders the main list of places on the home screen or results page
        function renderPlaces(places) {
            displayResults(places);
        }

        function displayResults(places) {
            const container = document.getElementById('placesContainer');
            if (places.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">🔍</div>
                        <div class="empty-state-title">نتیجه‌ای یافت نشد</div>
                        <div class="empty-state-text">متأسفانه در این دسته‌بندی مکانی یافت نشد.<br>لطفاً دسته‌بندی دیگری را امتحان کنید.</div>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = places.map(place => `
                <div class="place-card" data-id="${place.id}">
                    <div class="place-image" data-icon="${place.icon}">
                        <div class="place-badge">${place.badge}</div>
                    </div>
                    <div class="place-info">
                        <div class="place-header">
                            <h4 class="place-name">${place.name}</h4>
                            <span class="place-price">${place.price}</span>
                        </div>
                        <p class="place-category">${place.category}</p>
                        <div class="place-rating">
                            <span class="stars">${generateStars(place.rating)}</span>
                            <span class="rating-text">${place.rating} (${place.reviews} نظر)</span>
                        </div>
                        <p class="place-distance">📍 ${place.distance} از شما</p>
                        <div class="place-highlights">
                            ${place.highlights.map(highlight => `<span class="highlight-tag">${highlight}</span>`).join('')}
                        </div>
                        <div class="place-actions">
                            <button class="action-btn" onclick="showReviewsForPlace('${place.name}', ${place.id})">💬 نظرات</button>
                            <button class="action-btn" onclick="showCallConfirmation('${place.phone}')">📞 تماس</button>
                            <button class="action-btn primary" onclick="showDirectionsConfirmation('${place.name}')">📍 مسیریابی</button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Observe new place cards for lazy loading
            const placeCards = document.querySelectorAll('.place-card');
            placeCards.forEach(card => {
                observer.observe(card);
            });
        }
        
        function generateStars(rating) {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            let stars = '';
            for (let i = 0; i < fullStars; i++) {
                stars += '★';
            }
            if (hasHalfStar) {
                stars += '★';
            }
            return stars;
        }

        // Initialize the app when DOM is fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize Intersection Observer for lazy loading
            initLazyLoading();
            
            // Load local data (favorites, reviews, visits)
            loadUserDataFromLocalStorage();
            
            // Load recent searches from localStorage
            const savedSearches = localStorage.getItem('recentSearches');
            if (savedSearches) {
                recentSearches = JSON.parse(savedSearches);
                updateRecentSearches();
            }
            
            // Initialize filter options
            const filterOptions = document.querySelectorAll('.filter-option');
            filterOptions.forEach(option => {
                option.addEventListener('click', function() {
                    this.classList.toggle('active');
                });
            });
            
            // Keyboard navigation for category cards
            const categoryCards = document.querySelectorAll('.category-card');
            categoryCards.forEach(card => {
                card.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
            
            // Keyboard navigation for nav items
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
            
            // Form submissions
            document.getElementById('loginForm').addEventListener('submit', handleLogin);
            document.getElementById('registerForm').addEventListener('submit', handleRegister);
            
            // Close modals when clicking outside
            window.addEventListener('click', function(event) {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    if (event.target === modal) {
                        closeModal(modal);
                    }
                });
            });
            
            // Close modals on Escape key
            window.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    const openModals = document.querySelectorAll('.modal[style*="display: flex"]');
                    openModals.forEach(modal => closeModal(modal));
                }
            });
            
            // Initialize city list
            renderCityList(cities);
            
            // Initial rendering of places (using mock data for now)
            const allPlaces = Object.values(mockData).flat();
            renderPlaces(allPlaces);

            // Firebase Auth State Listener: This is crucial!
            // It runs once Firebase Auth is initialized AND whenever a user logs in/out.
            auth.onAuthStateChanged(user => {
                updateProfileUI(user); // Safely update UI once auth is ready
            });

            // Attach event listeners to buttons using JavaScript for reliability
            // This ensures the elements exist and auth is initialized before attaching listeners
            const loginRegisterBtn = document.getElementById('loginRegisterBtn');
            if (loginRegisterBtn) {
                loginRegisterBtn.addEventListener('click', openLoginModal);
            }
            
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', logout);
            }

            const addBusinessBtn = document.getElementById('addBusinessBtn');
            if (addBusinessBtn) {
                addBusinessBtn.addEventListener('click', openAddBusinessModal);
            }
        });
        
        // Initialize Intersection Observer for lazy loading
        function initLazyLoading() {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, options);
        }
        
        // Search functionality
        function handleSearch() {
            const input = document.querySelector('.search-input');
            const query = input.value.trim();
            clearTimeout(searchTimeout);
            
            if (query.length > 0) {
                showSearchSuggestions();
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            } else {
                hideSearchSuggestions();
                showSearchPage();
            }
        }
        
        function showSearchSuggestions() {
            const suggestions = document.getElementById('searchSuggestions');
            const query = document.querySelector('.search-input').value.trim().toLowerCase();
            
            if (query.length === 0) {
                suggestions.style.display = 'none';
                return;
            }
            
            // Generate suggestions based on all place names
            const allPlaces = Object.values(mockData).flat();
            const matchingPlaces = allPlaces.filter(place => 
                place.name.toLowerCase().includes(query) || 
                place.category.toLowerCase().includes(query) ||
                place.highlights.some(highlight => highlight.toLowerCase().includes(query))
            );
            
            // Also include popular searches
            const matchingPopular = popularSearches.filter(term => 
                term.toLowerCase().includes(query)
            );
            
            // Combine and deduplicate
            const suggestionsList = [...new Set([
                ...matchingPlaces.slice(0, 3).map(p => p.name),
                ...matchingPopular.slice(0, 3)
            ])];
            
            if (suggestionsList.length > 0) {
                suggestions.innerHTML = suggestionsList.map(term => `
                    <div class="suggestion-item" onclick="selectSuggestion('${term}')">
                        <span>🔍</span>
                        <span>${term}</span>
                    </div>
                `).join('');
                suggestions.style.display = 'block';
            } else {
                suggestions.style.display = 'none';
            }
        }
        
        function hideSearchSuggestions() {
            setTimeout(() => {
                const suggestions = document.getElementById('searchSuggestions');
                suggestions.style.display = 'none';
            }, 200);
        }
        
        function selectSuggestion(text) {
            const searchInput = document.querySelector('.search-input');
            searchInput.value = text;
            hideSearchSuggestions();
            
            // Add to recent searches
            addToRecentSearches(text);
            
            // Auto-detect category and show results
            const lowerText = text.toLowerCase();
            let category = 'gym'; // default
            
            if (lowerText.includes('آرایش') || lowerText.includes('سالن')) {
                category = lowerText.includes('مردانه') ? 'barber' : 'salon';
            } else if (lowerText.includes('آموزش') || lowerText.includes('زبان')) {
                category = 'school';
            } else if (lowerText.includes('رستوران') || lowerText.includes('غذا') || lowerText.includes('کافه')) {
                category = 'restaurant';
            } else if (lowerText.includes('کلینیک') || lowerText.includes('دندان')) {
                category = 'clinic';
            } else if (lowerText.includes('باشگاه') || lowerText.includes('فیتنس')) {
                category = 'gym';
            }
            
            selectCategoryProgrammatically(category);
        }
        
        function performSearch(query) {
            // Add to recent searches
            addToRecentSearches(query);
            
            // Show loading state
            showLoadingState();
            
            // Simulate API call delay
            setTimeout(() => {
                // Search across all categories
                const allPlaces = Object.values(mockData).flat();
                const matchingPlaces = allPlaces.filter(place => 
                    place.name.toLowerCase().includes(query.toLowerCase()) || 
                    place.category.toLowerCase().includes(query.toLowerCase()) ||
                    place.highlights.some(highlight => highlight.toLowerCase().includes(query.toLowerCase()))
                );
                
                if (matchingPlaces.length > 0) {
                    selectedCategory = 'search';
                    showResults('search', matchingPlaces);
                } else {
                    selectedCategory = 'search';
                    showResults('search', []);
                }
            }, 800);
        }
        
        function addToRecentSearches(term) {
            // Remove if already exists
            recentSearches = recentSearches.filter(search => search !== term);
            // Add to the beginning
            recentSearches.unshift(term);
            // Keep only the last 5
            recentSearches = recentSearches.slice(0, 5);
            // Save to localStorage
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
            // Update UI
            updateRecentSearches();
        }
        
        function updateRecentSearches() {
            const recentContainer = document.querySelector('.recent-searches');
            if (recentSearches.length > 0) {
                recentContainer.innerHTML = `
                    <h3 class="recent-title">جستجوهای اخیر</h3>
                    ${recentSearches.map(term => `
                        <div class="recent-item" onclick="selectSuggestion('${term}')">
                            <span>🔍</span>
                            <span>${term}</span>
                        </div>
                    `).join('')}
                `;
            }
        }
        
        // Category selection
        function selectCategory(category) {
            // Remove active class from all categories
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.remove('active');
            });
            // Add active class to selected category
            event.currentTarget.classList.add('active'); // Use currentTarget for event listener on parent
            selectedCategory = category;
            // Show results section
            showResults(category);
        }
        
        function selectCategoryProgrammatically(category) {
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.remove('active');
                if (card.dataset.category === category) {
                    card.classList.add('active');
                }
            });
            selectedCategory = category;
            showResults(category);
        }
        
        function showResults(category, places = null) {
            const categoriesSection = document.getElementById('categoriesSection');
            const resultsSection = document.getElementById('resultsSection');
            const searchPage = document.getElementById('searchPage');
            const profileSection = document.getElementById('profileSection');
            const resultsTitle = document.getElementById('resultsTitle');
            const resultsCount = document.getElementById('resultsCount');
            const addBusinessSection = document.getElementById('addBusinessSection');
            
            // Hide all sections and show results
            categoriesSection.style.display = 'none';
            searchPage.style.display = 'none';
            profileSection.style.display = 'none';
            addBusinessSection.style.display = 'none';
            resultsSection.style.display = 'block';
            
            // Update title based on category
            const categoryNames = {
                'gym': 'باشگاه‌ها',
                'salon': 'آرایشگاه‌ها',
                'barber': 'آرایشگاه‌های مردانه',
                'school': 'آموزشگاه‌ها',
                'clinic': 'کلینیک‌ها',
                'restaurant': 'رستوران‌ها',
                'search': 'نتایج جستجو'
            };
            
            resultsTitle.textContent = `${categoryNames[category]} ${currentLocation}`;
            
            // Show loading and then results
            showLoadingState();
            
            setTimeout(() => {
                let placesToShow;
                if (places) {
                    placesToShow = places;
                } else {
                    placesToShow = mockData[category] || [];
                }
                displayResults(placesToShow);
                resultsCount.textContent = `${placesToShow.length} نتیجه یافت شد`;
            }, 1000);
        }
        
        function showLoadingState() {
            const container = document.getElementById('placesContainer');
            container.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <span>در حال جستجو...</span>
                </div>
            `;
        }
        
        // City switching system
        function openCitySelector() {
            const modal = document.getElementById('citySelectorModal');
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            document.getElementById('citySearchInput').focus();
        }
        
        function closeCitySelector() {
            const modal = document.getElementById('citySelectorModal');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
        
        function renderCityList(citiesToShow) {
            const cityList = document.getElementById('cityList');
            cityList.innerHTML = citiesToShow.map(city => `
                <div class="city-item" onclick="selectCity('${city.name}')">
                    <div class="city-name">${city.name}</div>
                    <div class="city-region">${city.region}</div>
                </div>
            `).join('');
        }
        
        function filterCities() {
            const searchTerm = document.getElementById('citySearchInput').value.toLowerCase();
            const filteredCities = cities.filter(city => 
                city.name.toLowerCase().includes(searchTerm) || 
                city.region.toLowerCase().includes(searchTerm)
            );
            renderCityList(filteredCities);
        }
        
        function selectCity(cityName) {
            currentLocation = cityName;
            document.getElementById('currentLocation').textContent = currentLocation;
            closeCitySelector();
            
            // Update results title if results are showing
            if (selectedCategory) {
                const resultsTitle = document.getElementById('resultsTitle');
                const categoryNames = {
                    'gym': 'باشگاه‌ها',
                    'salon': 'آرایشگاه‌ها',
                    'barber': 'آرایشگاه‌های مردانه',
                    'school': 'آموزشگاه‌ها',
                    'clinic': 'کلینیک‌ها',
                    'restaurant': 'رستوران‌ها',
                    'search': 'نتایج جستجو'
                };
                resultsTitle.textContent = `${categoryNames[selectedCategory]} ${currentLocation}`;
                // Simulate new search for different location
                showLoadingState();
                setTimeout(() => {
                    if (selectedCategory === 'search') {
                        // For search, we don't have a specific category data
                        displayResults([]);
                    } else {
                        displayResults(mockData[selectedCategory] || []);
                    }
                }, 1000);
            }
            
            // Update maps if available
            if (typeof koorMaps !== 'undefined' && koorMaps && koorMaps.map) {
                koorMaps.changeCity(cityName);
            }
            
            // Update maps city name display if maps section is visible
            const mapsCityName = document.getElementById('mapsCityName');
            if (mapsCityName) {
                mapsCityName.textContent = cityName;
            }
            
            // Update city stats
            updateMapsCityStats();
            
            showToast(`شهر به ${cityName} تغییر کرد`, 'success');
        }
        
        // Filter functionality
        function openFilters() {
            const modal = document.getElementById('filtersModal');
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            // Focus management for accessibility
            setTimeout(() => {
                const closeBtn = modal.querySelector('.close-btn');
                closeBtn.focus();
            }, 100);
        }
        
        function closeFilters() {
            const modal = document.getElementById('filtersModal');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
        
        function applyFilters() {
            // Collect active filters
            const activeFilterElements = document.querySelectorAll('.filter-option.active');
            activeFilters = Array.from(activeFilterElements).map(el => ({
                type: el.dataset.filter.split('-')[0],
                value: el.dataset.filter.split('-')[1],
                text: el.textContent
            }));
            
            // Show loading
            showLoadingState();
            
            setTimeout(() => {
                // Filter the actual results
                let filteredData = mockData[selectedCategory] || [];
                
                // Apply filters
                activeFilters.forEach(filter => {
                    const [type, value] = filter.type.split('-');
                    switch(type) {
                        case 'price':
                            // Implement price range logic
                            filteredData = filteredData.filter(place => {
                                const priceNumber = parsePriceToNumber(place.price);
                                switch(value) {
                                    case 'low':
                                        return priceNumber < 200000;
                                    case 'mid':
                                        return priceNumber >= 200000 && priceNumber <= 400000;
                                    case 'high':
                                        return priceNumber > 400000;
                                    default:
                                        return true;
                                }
                            });
                            break;
                        case 'distance':
                            // Implement distance filtering logic
                            filteredData = filteredData.filter(place => {
                                const distanceNumber = parseFloat(place.distance);
                                switch(value) {
                                    case '1':
                                        return distanceNumber < 1;
                                    case '3':
                                        return distanceNumber >= 1 && distanceNumber <= 3;
                                    case '5':
                                        return distanceNumber >= 3 && distanceNumber <= 5;
                                    case 'more':
                                        return distanceNumber > 5;
                                    default:
                                        return true;
                                }
                            });
                            break;
                        case 'feature':
                            // Filter based on highlights array
                            filteredData = filteredData.filter(place =>
                                place.highlights.some(h => h.includes(value))
                            );
                            break;
                        case 'rating':
                            // Filter based on rating
                            const minRating = parseInt(value);
                            filteredData = filteredData.filter(place => place.rating >= minRating);
                            break;
                    }
                });
                
                displayResults(filteredData);
                closeFilters();
                // Update results count
                const resultsCount = document.getElementById('resultsCount');
                resultsCount.textContent = `${filteredData.length} نتیجه یافت شد${activeFilters.length > 0 ? ' (فیلتر شده)' : ''}`;
            }, 1000);
        }
        
        function parsePriceToNumber(priceString) {
            // Remove non-numeric characters except digits
            const numberString = priceString.replace(/[^\d]/g, '');
            return parseInt(numberString) || 0;
        }
        
        // Navigation
        function selectNavItem(element, section) {
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            // Add active class to selected item
            element.classList.add('active');
            // Handle navigation logic
            switch (section) {
                case 'home':
                    showHomeSection();
                    break;
                case 'search':
                    showSearchPage();
                    break;
                case 'maps':
                    showMapsSection();
                    break;
                case 'favorites':
                    showFavorites();
                    break;
                case 'profile':
                    showProfileSection();
                    break;
            }
        }
        
        function showHomeSection() {
            const categoriesSection = document.getElementById('categoriesSection');
            const resultsSection = document.getElementById('resultsSection');
            const searchPage = document.getElementById('searchPage');
            const profileSection = document.getElementById('profileSection');
            const addBusinessSection = document.getElementById('addBusinessSection');
            const mapsSection = document.getElementById('mapsSection');
            
            categoriesSection.style.display = 'block';
            resultsSection.style.display = 'none';
            searchPage.style.display = 'none';
            profileSection.style.display = 'none';
            addBusinessSection.style.display = 'none';
            mapsSection.style.display = 'none';
            
            // Reset category selection
            selectedCategory = null;
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.remove('active');
            });
            // Clear search
            document.querySelector('.search-input').value = '';
        }
        
        function showSearchPage() {
            const categoriesSection = document.getElementById('categoriesSection');
            const resultsSection = document.getElementById('resultsSection');
            const searchPage = document.getElementById('searchPage');
            const profileSection = document.getElementById('profileSection');
            const addBusinessSection = document.getElementById('addBusinessSection');
            const mapsSection = document.getElementById('mapsSection');
            
            categoriesSection.style.display = 'none';
            resultsSection.style.display = 'none';
            profileSection.style.display = 'none';
            addBusinessSection.style.display = 'none';
            mapsSection.style.display = 'none';
            searchPage.style.display = 'block';
            
            // Clear search
            document.querySelector('.search-input').value = '';
            hideSearchSuggestions();
        }
        
        function showProfileSection() {
            const categoriesSection = document.getElementById('categoriesSection');
            const resultsSection = document.getElementById('resultsSection');
            const searchPage = document.getElementById('searchPage');
            const profileSection = document.getElementById('profileSection');
            const addBusinessSection = document.getElementById('addBusinessSection');
            const mapsSection = document.getElementById('mapsSection');
            
            categoriesSection.style.display = 'none';
            resultsSection.style.display = 'none';
            searchPage.style.display = 'none';
            addBusinessSection.style.display = 'none';
            mapsSection.style.display = 'none';
            profileSection.style.display = 'block';
            
            // auth.currentUser is guaranteed to be available here due to onAuthStateChanged
            updateProfileUI(auth.currentUser);
        }

        // Show Maps Section
        function showMapsSection() {
            const categoriesSection = document.getElementById('categoriesSection');
            const resultsSection = document.getElementById('resultsSection');
            const searchPage = document.getElementById('searchPage');
            const profileSection = document.getElementById('profileSection');
            const addBusinessSection = document.getElementById('addBusinessSection');
            const mapsSection = document.getElementById('mapsSection');
            
            categoriesSection.style.display = 'none';
            resultsSection.style.display = 'none';
            searchPage.style.display = 'none';
            profileSection.style.display = 'none';
            addBusinessSection.style.display = 'none';
            mapsSection.style.display = 'block';
            
            // Initialize map if not already done
            if (typeof koorMaps !== 'undefined' && koorMaps && !koorMaps.map) {
                koorMaps.initMap('cityMap', currentLocation);
            }
            
            // Update maps city name display
            const mapsCityName = document.getElementById('mapsCityName');
            if (mapsCityName) {
                mapsCityName.textContent = currentLocation;
            }
            
            // Update city stats
            updateMapsCityStats();
        }

        // --- User Authentication and Profile Management (Firebase Auth) ---
        function openLoginModal() {
            // If user is already logged in via Firebase Auth, show profile section
            if (auth.currentUser) {
                showProfileSection();
                return;
            }
            const loginModal = document.getElementById('loginModal');
            loginModal.style.display = 'flex';
            loginModal.setAttribute('aria-hidden', 'false');
            document.getElementById('loginEmail').focus();
        }
        
        function closeLoginModal() {
            const loginModal = document.getElementById('loginModal');
            loginModal.style.display = 'none';
            loginModal.setAttribute('aria-hidden', 'true');
        }
        
        function openRegisterModal() {
            const registerModal = document.getElementById('registerModal');
            registerModal.style.display = 'flex';
            registerModal.setAttribute('aria-hidden', 'false');
            document.getElementById('regName').focus();
        }
        
        function closeRegisterModal() {
            const registerModal = document.getElementById('registerModal');
            registerModal.style.display = 'none';
            registerModal.setAttribute('aria-hidden', 'true');
        }
        
        function switchToRegister() {
            closeLoginModal();
            openRegisterModal();
        }
        
        function switchToLogin() {
            closeRegisterModal();
            openLoginModal();
        }
        
        async function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showToast('لطفاً تمام فیلدها را پر کنید', 'error');
                return;
            }
            
            showToast('در حال ورود...', 'info');
            try {
                await auth.signInWithEmailAndPassword(email, password);
                closeLoginModal();
                showToast('با موفقیت وارد شدید', 'success');
                // UI will be updated by onAuthStateChanged listener
            } catch (error) {
                console.error("Login error:", error.code, error.message);
                let errorMessage = "خطا در ورود. لطفاً دوباره تلاش کنید.";
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMessage = 'ایمیل یا رمز عبور اشتباه است.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'فرمت ایمیل نامعتبر است.';
                }
                showToast(`❌ ${errorMessage}`, 'error');
            }
        }
        
        async function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            if (!name || !email || !password || !confirmPassword) {
                showToast('لطفاً تمام فیلدها را پر کنید', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('رمز عبور و تکرار آن یکسان نیستند', 'error');
                return;
            }

            if (password.length < 6) {
                showToast('رمز عبور باید حداقل ۶ کاراکتر باشد.', 'error');
                return;
            }
            
            showToast('در حال ثبت نام...', 'info');
            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                await userCredential.user.updateProfile({ displayName: name }); // Set display name
                closeRegisterModal();
                showToast('حساب کاربری شما با موفقیت ایجاد شد', 'success');
                // UI will be updated by onAuthStateChanged listener
            } catch (error) {
                console.error("Register error:", error.code, error.message);
                let errorMessage = "خطا در ثبت نام. لطفاً دوباره تلاش کنید.";
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'این ایمیل قبلاً ثبت نام شده است.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'رمز عبور بسیار ضعیف است. حداقل ۶ کاراکتر وارد کنید.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'فرمت ایمیل نامعتبر است.';
                }
                showToast(`❌ ${errorMessage}`, 'error');
            }
        }
        
        async function logout() {
            try {
                await auth.signOut();
                showToast('با موفقیت از حساب خارج شدید', 'success');
                // UI will be updated by onAuthStateChanged listener
                // Clear local storage data not managed by Firebase
                localStorage.removeItem('favorites');
                localStorage.removeItem('reviews');
                localStorage.removeItem('visits');
                favorites = []; reviews = []; visits = []; // Clear local arrays
            } catch (error) {
                console.error("Logout error:", error);
                showToast('خطا در خروج از حساب. لطفاً دوباره تلاش کنید.', 'error');
            }
        }
        
        function updateProfileUI(user) {
            // 'user' here is the Firebase User object, or null if logged out
            const profileNameElement = document.getElementById('profileName');
            const profileEmailElement = document.getElementById('profileEmail');
            const loginRegisterBtn = document.getElementById('loginRegisterBtn');
            const logoutBtn = document.getElementById('logoutBtn');

            if (user) {
                profileNameElement.textContent = user.displayName || 'کاربر کوره';
                profileEmailElement.textContent = user.email;
                loginRegisterBtn.classList.add('hidden'); // Hide login/register button
                logoutBtn.classList.remove('hidden'); // Show logout button
            } else {
                profileNameElement.textContent = 'کاربر مهمان';
                profileEmailElement.textContent = '-';
                loginRegisterBtn.classList.remove('hidden'); // Show login/register button
                logoutBtn.classList.add('hidden'); // Hide logout button
            }
            
            // Update stats (these still use local mock arrays for now)
            document.getElementById('favoritesCount').textContent = favorites.length;
            document.getElementById('reviewsCount').textContent = reviews.length;
            document.getElementById('visitsCount').textContent = visits.length;
        }
        
        // This function now primarily handles local state, Firebase Auth manages user persistence itself
        function loadUserDataFromLocalStorage() {
            const savedFavorites = localStorage.getItem('favorites');
            const savedReviews = localStorage.getItem('reviews');
            const savedVisits = localStorage.getItem('visits');
            
            if (savedFavorites) {
                favorites = JSON.parse(savedFavorites);
            }
            
            if (savedReviews) {
                reviews = JSON.parse(savedReviews);
            }
            
            if (savedVisits) {
                visits = JSON.parse(savedVisits);
            }
        }
        
        // This function now primarily saves local state, Firebase Auth manages user persistence itself
        function saveUserDataToLocalStorage() {
            // We don't need to save currentUser to localStorage anymore
            // as Firebase Auth handles it automatically.
            localStorage.setItem('favorites', JSON.stringify(favorites));
            localStorage.setItem('reviews', JSON.stringify(reviews));
            localStorage.setItem('visits', JSON.stringify(visits));
        }
        
        function showFavorites() {
            if (!auth.currentUser) { // Check Firebase Auth user
                openLoginModal();
                showToast('لطفاً برای مشاهده علاقه‌مندی‌ها وارد شوید.', 'info');
                return;
            }
            showToast('مکان‌های مورد علاقه شما نمایش داده خواهند شد (این قابلیت هنوز توسعه نیافته است).', 'info');
            // In a real app, you would fetch and display user's favorited places from Firestore
            // related to auth.currentUser.uid
        }
        
        function showSettings() {
            if (!auth.currentUser) { // Check Firebase Auth user
                openLoginModal();
                showToast('لطفاً برای دسترسی به تنظیمات وارد شوید.', 'info');
                return;
            }
            showToast('صفحه تنظیمات حساب کاربری (این قابلیت هنوز توسعه نیافته است).', 'info');
            // In a real app, you would navigate to a settings page or open a settings modal
        }
        
        // Place actions (alert/confirm replaced with showToast or custom message)
        function showReviewsForPlace(placeName, placeId) {
            const mockReviews = [
                { author: 'علی احمدی', rating: 5, text: 'بهترین باشگاه منطقه! مربی‌ها فوق‌العاده حرفه‌ای هستند.', date: '۲ روز پیش' },
                { author: 'مریم کریمی', rating: 4, text: 'امکانات عالی و تمیز. فقط پارکینگش کمی مشکل داره.', date: '۱ هفته پیش' },
                { author: 'حسن رضایی', rating: 5, text: 'قیمت مناسب و کیفیت بالا. پیشنهاد می‌کنم.', date: '۲ هفته پیش' }
            ];
            // Ensure the placeDetailsContent element exists in index.html, if not, you'll need a modal for this.
            // For now, let's assume it's part of a general modal structure.
            let placeDetailsContentElement = document.getElementById('placeDetailsContent');
            if (!placeDetailsContentElement) {
                // If placeDetailsContent doesn't exist, create a temporary one for the demo or a dedicated modal
                console.warn("Element with ID 'placeDetailsContent' not found. Cannot display reviews.");
                showToast("خطا: المان نمایش نظرات یافت نشد. به توسعه‌دهنده اطلاع دهید.", "error");
                return;
            }


            let reviewsHtml = `<h4>نظرات درباره ${placeName}:</h4>`;
            if (mockReviews.length > 0) {
                reviewsHtml += `<div class="review-list">`;
                mockReviews.forEach(review => {
                    reviewsHtml += `
                        <div class="review-item">
                            <div class="review-meta">
                                <span>${review.author}</span>
                                <span class="review-rating">${generateStars(review.rating)}</span>
                            </div>
                            <p>${review.text}</p>
                            <small>${review.date}</small>
                        </div>
                    `;
                });
                reviewsHtml += `</div>`;
            } else {
                reviewsHtml += `<p>هنوز نظری برای این مکان ثبت نشده است.</p>`;
            }
            
            // Add review submission form within the modal or link to it
            reviewsHtml += `
                <div class="review-form">
                    <textarea id="reviewText" placeholder="نظر خود را بنویسید..." rows="4"></textarea>
                    <input type="number" id="reviewRating" placeholder="امتیاز (1-5)" min="1" max="5">
                    <button class="btn btn-primary" onclick="submitReview(${placeId})">ثبت نظر</button>
                </div>
            `;
            
            // Assuming 'placeModal' is the overall modal containing placeDetailsContent
            const placeModal = document.getElementById('placeModal');
            if (placeDetailsContentElement) {
                placeDetailsContentElement.innerHTML = `
                    <h2>${placeName}</h2>
                    ${reviewsHtml}
                `;
            }

            if (placeModal) {
                placeModal.style.display = 'flex';
                placeModal.setAttribute('aria-hidden', 'false');
            } else {
                 showToast("خطا: مدال نمایش جزئیات مکان یافت نشد.", "error");
            }
        }


        function submitReview(placeId) {
            const reviewText = document.getElementById('reviewText').value;
            const reviewRating = parseInt(document.getElementById('reviewRating').value);
            
            if (!auth.currentUser) { // Check Firebase Auth user
                showToast('لطفاً برای ثبت نظر وارد شوید.', 'error');
                return;
            }

            if (isNaN(reviewRating) || reviewRating < 1 || reviewRating > 5) {
                showToast('❌ لطفاً امتیازی بین ۱ تا ۵ وارد کنید.', 'error');
                return;
            }
            
            if (reviewText.length < 10) {
                showToast('❌ لطفاً متنی با حداقل ۱۰ کاراکتر وارد کنید.', 'error');
                return;
            }
            
            showToast('✅ نظر شما در حال ثبت است...', 'info');
            // Simulate review submission to a backend (or direct to Firestore if you set it up)
            setTimeout(() => {
                console.log('New review submitted:', { placeId, reviewRating, reviewText, userId: auth.currentUser.uid });
                // In a real app, you would save this review to Firestore,
                // perhaps in a 'reviews' collection, linking it to the placeId and auth.currentUser.uid
                showToast('✅ نظر شما با موفقیت ثبت شد! پس از تأیید نمایش داده خواهد شد.', 'success');
                // Optionally clear the form
                document.getElementById('reviewText').value = '';
                document.getElementById('reviewRating').value = '';
            }, 1500);
        }
        
        // Custom confirmation modal for call/directions instead of alert/confirm
        function showConfirmationModal(message, onConfirmCallback) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'flex';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">تایید</h3>
                        <button class="close-btn" onclick="this.closest('.modal').style.display='none'">×</button>
                    </div>
                    <p style="text-align: center; margin-bottom: 20px;">${message}</p>
                    <div class="form-actions">
                        <button class="btn btn-primary" id="confirmActionBtn">بله</button>
                        <button class="btn btn-secondary" onclick="this.closest('.modal').style.display='none'">خیر</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('confirmActionBtn').onclick = () => {
                onConfirmCallback();
                modal.style.display = 'none';
            };
        }

        function showCallConfirmation(phone) {
            showConfirmationModal(`آیا می‌خواهید با شماره ${phone} تماس بگیرید؟`, () => {
                window.location.href = `tel:${phone}`;
                showToast(`در حال برقراری تماس با ${phone}...`, 'info');
            });
        }
        
        function showDirectionsConfirmation(placeName) {
            showConfirmationModal(`آیا می‌خواهید مسیریابی به ${placeName} را شروع کنید؟`, () => {
                // In a real app, would integrate with maps like Google Maps API
                showToast(`مسیریابی به ${placeName} در حال بارگذاری...`, 'success');
                // Example of opening Google Maps (might be blocked in iframe)
                // window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ', ' + currentLocation)}`, '_blank');
            });
        }
        
        // Utility function to close any generic modal
        function closeModal(modalElement) {
            if (modalElement) {
                modalElement.style.display = 'none';
                modalElement.setAttribute('aria-hidden', 'true');
            }
        }
        
        function showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            
            // Hide any currently visible toast
            toast.style.display = 'none'; 
            
            toastMessage.textContent = message;
            toast.className = 'toast'; // Reset classes
            toast.classList.add(type);
            toast.style.display = 'flex';
            
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }

        // --- NEW CODE FOR BUSINESS OWNER ---
        // Get elements once DOM is ready
        const addBusinessSection = document.getElementById('addBusinessSection');
        const businessForm = document.getElementById('businessForm');

        // Function to open the business submission modal
        function openAddBusinessModal() {
            if (!auth.currentUser) {
                showToast('لطفاً برای ثبت کسب و کار خود وارد شوید.', 'error');
                openLoginModal();
                return;
            }

            // Hide all other main content sections
            document.getElementById('categoriesSection').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'none';
            document.getElementById('searchPage').style.display = 'none';
            document.getElementById('profileSection').style.display = 'none';
            
            // Show the business submission modal
            addBusinessSection.classList.remove('hidden');
            addBusinessSection.style.display = 'flex'; // Show modal
            addBusinessSection.setAttribute('aria-hidden', 'false');
        }

        // Event listener for handling the submission of the business form
        businessForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission (page reload)

            // Ensure user is logged in before submitting
            if (!auth.currentUser) {
                showToast('خطا: برای ثبت کسب و کار باید وارد شده باشید.', 'error');
                return;
            }

            // Collect data from the form inputs, including the user's ID
            const businessData = {
                name: document.getElementById('businessName').value,
                category: document.getElementById('businessCategory').value,
                description: document.getElementById('businessDescription').value,
                ownerId: auth.currentUser.uid, // Attach the Firebase User ID
                ownerEmail: auth.currentUser.email, // Store owner's email for convenience
                timestamp: firebase.firestore.FieldValue.serverTimestamp() // For server timestamp
            };

            showToast('در حال ثبت کسب و کار شما...', 'info'); // Show loading toast

            try {
                // Send the collected data to your server's API endpoint
                const response = await fetch('/api/businesses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Indicate that we are sending JSON data
                    },
                    body: JSON.stringify(businessData), // Convert JavaScript object to JSON string
                });

                if (response.ok) { // Check if the server response was successful (status 200-299)
                    showToast('✅ کسب و کار شما با موفقیت ثبت شد!', 'success'); // Show success toast
                    businessForm.reset(); // Clear the form fields
                    closeModal(addBusinessSection); // Hide the business submission form modal
                    // Optionally, you might want to refresh the list of businesses or show a message
                    fetchAndRenderBusinesses(); // Fetch updated list of businesses (if you want to see them on main page)
                } else {
                    // Handle server-side errors (e.g., validation errors)
                    const errorData = await response.json(); // Try to parse error message from server
                    showToast(`❌ مشکلی در ثبت کسب و کار شما وجود دارد: ${errorData.message || 'خطای ناشناس'}`, 'error');
                }
            } catch (error) {
                // Handle network errors or issues with the fetch request
                console.error('خطا:', error);
                showToast('❌ خطایی در ارتباط با سرور رخ داد. لطفاً اتصال اینترنت خود را بررسی کنید.', 'error');
            }
        });

        // Function to fetch and display businesses from the server (placeholder for future use)
        async function fetchAndRenderBusinesses() {
            try {
                const response = await fetch('/api/businesses');
                const businesses = await response.json();
                
                console.log('کسب و کارهای دریافت شده از سرور:', businesses);

                // Example: If you wanted to display these fetched businesses
                // displayResults(businesses); 

            } catch (error) {
                console.error('خطا در دریافت کسب و کارها:', error);
                showToast('❌ خطایی در دریافت اطلاعات کسب و کارها رخ داد.', 'error');
            }
        }

        // Update Maps City Stats
        function updateMapsCityStats() {
            const selectedCityName = document.getElementById('selectedCityName');
            const cityCoordinates = document.getElementById('cityCoordinates');
            const markersCount = document.getElementById('markersCount');
            
            if (selectedCityName) {
                selectedCityName.textContent = currentLocation;
            }
            
            if (cityCoordinates && typeof koorMaps !== 'undefined' && koorMaps) {
                const coords = koorMaps.getCityCoordinates(currentLocation);
                if (coords) {
                    cityCoordinates.textContent = coords.join(', ');
                }
            }
            
            if (markersCount && typeof koorMaps !== 'undefined' && koorMaps) {
                markersCount.textContent = koorMaps.markers.length;
            }
        }
