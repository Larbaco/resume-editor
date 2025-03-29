/**
 * ==============================================
 * DATA SERVICE MODULE
 * ==============================================
 * 
 * Manages all resume data operations including:
 * - Loading and saving resume data
 * - Language management
 * - Data structure initialization
 * - State management
 */

/* ==============================================
   MODULE STATE
   ============================================== */

/**
 * Current resume data structure
 * @type {Object}
 * @property {Object|null} en - English resume data
 * @property {Object|null} pt - Portuguese resume data
 * @property {string} currentLang - Currently active language ('en' or 'pt')
 */
let resumeData = {
    en: null,
    pt: null,
    currentLang: 'pt' // Default language
};

/* ==============================================
   DATA GETTERS
   ============================================== */

/**
 * Gets the currently active language
 * @returns {string} Current language code ('en' or 'pt')
 */
export function getCurrentLang() {
    return resumeData.currentLang;
}

/**
 * Gets resume data for the current language
 * @returns {Object} Resume data for current language
 */
export function getResumeData() {
    return resumeData[resumeData.currentLang];
}

/**
 * Gets all resume data (both languages)
 * @returns {Object} Complete resume data structure
 */
export function getAllResumeData() {
    return resumeData;
}

/* ==============================================
   DATA OPERATIONS
   ============================================== */

/**
 * Initializes application data by loading resumes from server
 * Falls back to default data if loading fails
 * @async
 * @returns {Promise<void>}
 */
export async function initializeApp() {
    try {
        console.log('[DEBUG] Starting data loading...');
        
        // Load both language versions simultaneously
        const [enResponse, ptResponse] = await Promise.all([
            fetch('/api/resume/en'),
            fetch('/api/resume/pt')
        ]);
        
        console.log('[DEBUG] Fetch responses:', { 
            en: enResponse.status, 
            pt: ptResponse.status 
        });

        // Validate responses
        if (!enResponse.ok || !ptResponse.ok) {
            throw new Error(`Failed to load resume data. Status: EN=${enResponse.status}, PT=${ptResponse.status}`);
        }
        
        // Parse and store data
        resumeData.en = await enResponse.json();
        resumeData.pt = await ptResponse.json();
        
        console.log('[DEBUG] Successfully loaded resume data');
        
    } catch (error) {
        console.error('[ERROR] Data loading failed:', error);
        console.log('[DEBUG] Initializing with default data');
        
        // Initialize with default data if loading fails
        resumeData.en = createDefaultResume();
        resumeData.pt = createDefaultResume();
    }
}

/**
 * Saves current language resume data to server
 * @async
 * @returns {Promise<Object>} Server response
 * @throws {Error} If save operation fails
 */
export async function saveResumeData() {
    try {
        console.log('[DEBUG] Saving resume data...');
        
        const response = await fetch(`/api/resume/${resumeData.currentLang}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resumeData[resumeData.currentLang], null, 2)
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        console.log('[DEBUG] Resume data saved successfully');
        return await response.json();
        
    } catch (error) {
        console.error('[ERROR] Failed to save resume:', error);
        throw error;
    }
}

/**
 * Updates a specific section of the resume data
 * @param {string} section - Section name to update
 * @param {*} data - New data for the section
 * @returns {void}
 */
export function updateResumeData(section, data) {
    if (!resumeData[resumeData.currentLang]) {
        console.error('[ERROR] No resume data available for current language');
        return;
    }
    
    console.log(`[DEBUG] Updating section: ${section}`);
    resumeData[resumeData.currentLang][section] = data;
}

/* ==============================================
   LANGUAGE MANAGEMENT
   ============================================== */

/**
 * Switches the current active language
 * @param {string} lang - Language code ('en' or 'pt')
 * @returns {string} The new active language
 */
export function switchLanguage(lang) {
    if (lang !== 'en' && lang !== 'pt') {
        console.error(`[ERROR] Invalid language code: ${lang}`);
        return resumeData.currentLang;
    }
    
    console.log(`[DEBUG] Switching language to ${lang}`);
    resumeData.currentLang = lang;
    return lang;
}

/* ==============================================
   DATA INITIALIZATION
   ============================================== */

/**
 * Creates a new default resume structure
 * @returns {Object} Default resume data structure
 */
export function createDefaultResume() {
    console.log('[DEBUG] Creating default resume structure');
    
    return {
        baseInfo: {
            name: "",
            title: "",
            contact: {
                location: "",
                phone: "",
                email: "",
                website: "",
                linkedin: ""
            }
        },
        professional_summary: "",
        technical_skills: [],
        experience: [],
        education: [],
        certifications: [],
        projects: [],
        languages: []
    };
}