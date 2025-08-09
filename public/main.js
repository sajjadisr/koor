
        // Global variables
        let selectedCategory = null;
        let activeFilters = [];
        let currentLocation = 'تهران';
        let searchTimeout;
        let isLoading = false;
        let currentUser = null;
        let favorites = [];
        let reviews = [];
        let visits = [];
        let recentSearches = [];
        let observer;
        
        // Mock data for different categories
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
                    icon: '💇‍♀️',
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
                    icon: '💇‍♀️',
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
                    icon: '✂️',
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
                    icon: '🍽️',
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
        
        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize Intersection Observer for lazy loading
            initLazyLoading();
            
            // Load user data from localStorage if available
            loadUserData();
            
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
                    const openModals = document.querySelectorAll('.modal[style*="display: block"]');
                    openModals.forEach(modal => closeModal(modal));
                }
            });
            
            // Initialize city list
            renderCityList(cities);
            
            // Update profile UI
            updateProfileUI();
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
                            <span class="search-icon">🔍</span>
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
            event.target.classList.add('active');
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
            
            // Hide all sections and show results
            categoriesSection.style.display = 'none';
            searchPage.style.display = 'none';
            profileSection.style.display = 'none';
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
                            <button class="action-btn" onclick="showReviews('${place.name}', ${place.id})">💬 نظرات</button>
                            <button class="action-btn" onclick="callPlace('${place.phone}')">📞 تماس</button>
                            <button class="action-btn primary" onclick="getDirections('${place.name}')">📍 مسیریابی</button>
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
                stars += '⭐';
            }
            if (hasHalfStar) {
                stars += '⭐';
            }
            return stars;
        }
        
        // City switching system
        function openCitySelector() {
            const modal = document.getElementById('citySelectorModal');
            modal.style.display = 'block';
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
            
            showToast(`شهر به ${cityName} تغییر کرد`, 'success');
        }
        
        // Filter functionality
        function openFilters() {
            const modal = document.getElementById('filtersModal');
            modal.style.display = 'block';
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
            
            categoriesSection.style.display = 'block';
            resultsSection.style.display = 'none';
            searchPage.style.display = 'none';
            profileSection.style.display = 'none';
            
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
            
            categoriesSection.style.display = 'none';
            resultsSection.style.display = 'none';
            profileSection.style.display = 'none';
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
            
            categoriesSection.style.display = 'none';
            resultsSection.style.display = 'none';
            searchPage.style.display = 'none';
            profileSection.style.display = 'block';
            
            updateProfileUI();
        }
        
        // User system
        function openLoginModal() {
            if (currentUser) {
                showProfileSection();
                return;
            }
            
            document.getElementById('loginModal').style.display = 'block';
            document.getElementById('email').focus();
        }
        
        function closeLoginModal() {
            document.getElementById('loginModal').style.display = 'none';
        }
        
        function openRegisterModal() {
            document.getElementById('registerModal').style.display = 'block';
            document.getElementById('regName').focus();
        }
        
        function closeRegisterModal() {
            document.getElementById('registerModal').style.display = 'none';
        }
        
        function switchToRegister() {
            closeLoginModal();
            openRegisterModal();
        }
        
        function switchToLogin() {
            closeRegisterModal();
            openLoginModal();
        }
        
        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                showToast('لطفاً تمام فیلدها را پر کنید', 'error');
                return;
            }
            
            // In a real app, this would be an API call
            // For demo, we'll simulate a successful login
            currentUser = {
                id: 1,
                name: 'کاربر کور',
                email: email,
                joined: new Date().toISOString()
            };
            
            // Save to localStorage
            saveUserData();
            
            // Update UI
            updateProfileUI();
            closeLoginModal();
            showToast('با موفقیت وارد شدید', 'success');
        }
        
        function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            // Simple validation
            if (!name || !email || !password || !confirmPassword) {
                showToast('لطفاً تمام فیلدها را پر کنید', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('رمز عبور و تکرار آن یکسان نیستند', 'error');
                return;
            }
            
            // In a real app, this would be an API call
            // For demo, we'll simulate a successful registration
            currentUser = {
                id: Date.now(),
                name: name,
                email: email,
                joined: new Date().toISOString()
            };
            
            // Save to localStorage
            saveUserData();
            
            // Update UI
            updateProfileUI();
            closeRegisterModal();
            showToast('حساب کاربری شما با موفقیت ایجاد شد', 'success');
        }
        
        function logout() {
            currentUser = null;
            favorites = [];
            reviews = [];
            visits = [];
            
            // Clear localStorage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('favorites');
            localStorage.removeItem('reviews');
            localStorage.removeItem('visits');
            
            // Update UI
            updateProfileUI();
            showToast('با موفقیت از حساب خارج شدید', 'success');
        }
        
        function updateProfileUI() {
            if (currentUser) {
                document.getElementById('profileName').textContent = currentUser.name;
                document.getElementById('profileEmail').textContent = currentUser.email;
                document.getElementById('logoutBtn').style.display = 'flex';
            } else {
                document.getElementById('profileName').textContent = 'کاربر مهمان';
                document.getElementById('profileEmail').textContent = '-';
                document.getElementById('logoutBtn').style.display = 'none';
            }
            
            // Update stats
            document.getElementById('favoritesCount').textContent = favorites.length;
            document.getElementById('reviewsCount').textContent = reviews.length;
            document.getElementById('visitsCount').textContent = visits.length;
        }
        
        function saveUserData() {
            if (currentUser) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('favorites', JSON.stringify(favorites));
                localStorage.setItem('reviews', JSON.stringify(reviews));
                localStorage.setItem('visits', JSON.stringify(visits));
            }
        }
        
        function loadUserData() {
            const savedUser = localStorage.getItem('currentUser');
            const savedFavorites = localStorage.getItem('favorites');
            const savedReviews = localStorage.getItem('reviews');
            const savedVisits = localStorage.getItem('visits');
            
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
            }
            
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
        
        function showFavorites() {
            if (!currentUser) {
                openLoginModal();
                return;
            }
            
            // For demo, we'll show a message
            showToast('مکان‌های مورد علاقه شما نمایش داده خواهند شد', 'success');
        }
        
        function showSettings() {
            if (!currentUser) {
                openLoginModal();
                return;
            }
            
            // For demo, we'll show a message
            showToast('تنظیمات حساب کاربری', 'success');
        }
        
        // Place actions
        function showReviews(placeName, placeId) {
            const mockReviews = [
                { author: 'علی احمدی', rating: 5, text: 'بهترین باشگاه منطقه! مربی‌ها فوق‌العاده حرفه‌ای هستند.', date: '۲ روز پیش' },
                { author: 'مریم کریمی', rating: 4, text: 'امکانات عالی و تمیز. فقط پارکینگش کمی مشکل داره.', date: '۱ هفته پیش' },
                { author: 'حسن رضایی', rating: 5, text: 'قیمت مناسب و کیفیت بالا. پیشنهاد می‌کنم.', date: '۲ هفته پیش' }
            ];
            let reviewsText = `📝 نظرات درباره ${placeName}:\n`;
            mockReviews.forEach(review => {
                reviewsText += `${generateStars(review.rating)} ${review.author}\n"${review.text}"\n${review.date}\n`;
            });
            reviewsText += '💬 آیا شما هم نظری دارید?';
            alert(reviewsText);
            if (confirm('آیا می‌خواهید نظر خود را اضافه کنید؟')) {
                submitReview(placeName, placeId);
            }
        }
        
        function submitReview(placeName, placeId) {
            const rating = prompt(`چند ستاره به ${placeName} می‌دهید؟ (1-5)`);
            if (rating && rating >= 1 && rating <= 5) {
                const reviewText = prompt('نظر خود را بنویسید (حداقل ۱۰ کاراکتر):');
                if (reviewText && reviewText.length >= 10) {
                    alert(`✅ نظر شما با موفقیت ثبت شد!\nتشکر از اینکه به بهبود کیفیت اطلاعات کور کمک کردید.\nنظر شما پس از تأیید نمایش داده خواهد شد.`);
                    // Simulate review submission
                    setTimeout(() => {
                        // In a real app, would update the specific place
                        console.log('Review submitted:', { placeId, rating, reviewText });
                    }, 1000);
                } else {
                    alert('❌ لطفاً متنی با حداقل ۱۰ کاراکتر وارد کنید.');
                }
            } else {
                alert('❌ لطفاً امتیازی بین ۱ تا ۵ وارد کنید.');
            }
        }
        
        function callPlace(phone) {
            if (confirm(`آیا می‌خواهید با شماره ${phone} تماس بگیرید؟`)) {
                window.location.href = `tel:${phone}`;
            }
        }
        
        function getDirections(placeName) {
            if (confirm(`آیا می‌خواهید مسیریابی به ${placeName} را شروع کنید؟`)) {
                // In a real app, would integrate with maps
                showToast(`مسیریابی به ${placeName} در حال بارگذاری...`, 'success');
            }
        }
        
        // Utility functions
        function closeModal(modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
        
        function showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            
            toastMessage.textContent = message;
            toast.className = 'toast';
            toast.classList.add(type);
            toast.style.display = 'flex';
            
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }