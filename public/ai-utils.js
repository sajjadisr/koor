// AI utilities for Koor app using Firebase AI (Gemini)
import { geminiModel } from './firebase-config.js';

// --- AI-Powered Search and Recommendations ---

/**
 * Generate smart search suggestions based on user input
 */
export async function generateSearchSuggestions(userInput, location = 'تهران') {
  try {
    const prompt = `
    کاربر دنبال "${userInput}" در شهر ${location} می‌گردد.
    لطفاً 5 پیشنهاد جستجوی هوشمند ارائه دهید که مرتبط با این جستجو باشد.
    پاسخ را به صورت آرایه‌ای از کلمات کلیدی فارسی ارائه دهید.
    مثال: ["باشگاه بدنسازی", "سالن ورزشی", "مربی شخصی"]
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response to extract suggestions
    try {
      // Try to parse as JSON array
      const suggestions = JSON.parse(text);
      return { success: true, suggestions };
    } catch {
      // Fallback: extract suggestions from text
      const suggestions = text.match(/["""]([^"""]+)["""]/g)?.map(s => s.replace(/["""]/g, '')) || [];
      return { success: true, suggestions: suggestions.slice(0, 5) };
    }
  } catch (error) {
    console.error('Error generating search suggestions:', error);
    return { success: false, suggestions: [], error: error.message };
  }
}

/**
 * Generate business recommendations based on user preferences
 */
export async function generateBusinessRecommendations(userPreferences, location = 'تهران') {
  try {
    const prompt = `
    بر اساس ترجیحات کاربر: ${userPreferences}
    در شهر ${location}
    
    لطفاً 3-5 کسب و کار مرتبط پیشنهاد دهید که شامل:
    - نام کسب و کار
    - دسته‌بندی
    - دلیل پیشنهاد
    - ویژگی‌های خاص
    
    پاسخ را به صورت JSON ارائه دهید:
    {
      "recommendations": [
        {
          "name": "نام کسب و کار",
          "category": "دسته‌بندی",
          "reason": "دلیل پیشنهاد",
          "features": ["ویژگی 1", "ویژگی 2"]
        }
      ]
    }
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const data = JSON.parse(text);
      return { success: true, recommendations: data.recommendations || [] };
    } catch {
      return { success: false, recommendations: [], error: 'Failed to parse AI response' };
    }
  } catch (error) {
    console.error('Error generating business recommendations:', error);
    return { success: false, recommendations: [], error: error.message };
  }
}

/**
 * Generate intelligent business descriptions
 */
export async function generateBusinessDescription(businessName, category, location = 'تهران') {
  try {
    const prompt = `
    برای کسب و کار "${businessName}" در دسته‌بندی "${category}" در شهر ${location}
    یک توضیح جذاب و حرفه‌ای به زبان فارسی بنویسید که شامل:
    - معرفی کسب و کار
    - خدمات ارائه شده
    - مزایای انتخاب این کسب و کار
    - تجربه‌ای که مشتریان خواهند داشت
    
    توضیح باید بین 100-150 کلمه باشد و جذاب باشد.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return { success: true, description: text.trim() };
  } catch (error) {
    console.error('Error generating business description:', error);
    return { success: false, description: '', error: error.message };
  }
}

/**
 * Generate review summaries and insights
 */
export async function generateReviewInsights(reviews, businessName) {
  try {
    const prompt = `
    برای کسب و کار "${businessName}"، بر اساس نظرات زیر:
    ${reviews.map(r => `- ${r.text} (امتیاز: ${r.rating}/5)`).join('\n')}
    
    لطفاً تحلیل و خلاصه‌ای ارائه دهید که شامل:
    - نقاط قوت کسب و کار
    - نقاط قابل بهبود
    - تجربه کلی مشتریان
    - توصیه‌های کلی
    
    پاسخ را به صورت پاراگراف‌های کوتاه و خوانا ارائه دهید.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return { success: true, insights: text.trim() };
  } catch (error) {
    console.error('Error generating review insights:', error);
    return { success: false, insights: '', error: error.message };
  }
}

/**
 * Generate personalized user recommendations
 */
export async function generatePersonalizedRecommendations(userProfile, userHistory, location = 'تهران') {
  try {
    const prompt = `
    بر اساس پروفایل کاربر:
    - علایق: ${userProfile.interests || 'تعریف نشده'}
    - سابقه بازدید: ${userHistory.map(h => h.placeName).join(', ') || 'هیچ'}
    - مکان فعلی: ${location}
    
    لطفاً 5 پیشنهاد شخصی‌سازی شده برای کسب و کارهای جدید ارائه دهید که:
    - با علایق کاربر همخوانی داشته باشد
    - مشابه مکان‌هایی که قبلاً بازدید کرده باشد
    - در نزدیکی مکان فعلی باشد
    
    پاسخ را به صورت JSON ارائه دهید:
    {
      "personalizedRecommendations": [
        {
          "businessType": "نوع کسب و کار",
          "reason": "دلیل پیشنهاد شخصی",
          "expectedExperience": "تجربه مورد انتظار"
        }
      ]
    }
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const data = JSON.parse(text);
      return { success: true, recommendations: data.personalizedRecommendations || [] };
    } catch {
      return { success: false, recommendations: [], error: 'Failed to parse AI response' };
    }
  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    return { success: false, recommendations: [], error: error.message };
  }
}

/**
 * Generate natural language search queries
 */
export async function generateSearchQuery(naturalLanguageInput, location = 'تهران') {
  try {
    const prompt = `
    کاربر گفته: "${naturalLanguageInput}"
    در شهر ${location}
    
    لطفاً این عبارت طبیعی را به کلمات کلیدی جستجو تبدیل کنید.
    پاسخ را به صورت آرایه‌ای از کلمات کلیدی فارسی ارائه دهید.
    
    مثال:
    ورودی: "دنبال باشگاه خوب برای بدنسازی می‌گردم"
    خروجی: ["باشگاه", "بدنسازی", "ورزش"]
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const keywords = JSON.parse(text);
      return { success: true, keywords };
    } catch {
      // Fallback: extract keywords from text
      const keywords = text.match(/["""]([^"""]+)["""]/g)?.map(s => s.replace(/["""]/g, '')) || [];
      return { success: true, keywords };
    }
  } catch (error) {
    console.error('Error generating search query:', error);
    return { success: false, keywords: [], error: error.message };
  }
}

// --- Utility Functions ---

/**
 * Check if AI services are available
 */
export function isAIAvailable() {
  return !!geminiModel;
}

/**
 * Get AI model information
 */
export function getAIModelInfo() {
  return {
    model: "gemini-2.5-flash",
    available: isAIAvailable(),
    provider: "Google AI (Firebase)"
  };
}

// Export the Gemini model for direct use
export { geminiModel };
