/**
 * ==============================================
 * UI SERVICE MODULE
 * ==============================================
 * 
 * Handles all UI rendering and updates for the resume editor
 * Exports functions for managing sections, rendering data, and modal control
 */

import { getResumeData, getCurrentLang } from './dataService.js';
/* ==============================================
   CORE UI FUNCTIONS
   ============================================== */

/**
 * Updates the entire UI with current resume data and translations
 * @returns {void}
 */
export function updateUI() {
    console.log('[DEBUG] Starting UI update');
    const data = getResumeData();

    if (!data) {
        console.warn('[WARN] No resume data available for UI');
        return;
    }

    try {
        // 1. Update UI text first (translations)
        updateUIText();

        // 2. Populate form fields with data
        updateFormFields(data);

        // 3. Render dynamic sections
        renderAllSections(data);

        // 4. Update language toggle state
        updateLanguageToggle();

    } catch (error) {
        console.error('[ERROR] UI update failed:', error);
    }
    console.log('[DEBUG] UI updated successfully');
}

/**
 * Shows a specific section and updates navigation
 * @param {string} sectionId - ID of the section to show
 * @returns {void}
 */
export function showSection(sectionId) {
    console.log(`[DEBUG] Showing section: ${sectionId}`);

    const allSections = document.querySelectorAll('.section');
    const allButtons = document.querySelectorAll('.nav-btn');

    // Remove active classes immediately
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    allButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class after transition
    requestAnimationFrame(() => {
        const section = document.getElementById(sectionId);
        const sectionName = sectionId.replace('-section', '');
        const navButton = document.querySelector(`.nav-btn[data-section="${sectionName}"]`);

        if (section) section.classList.add('active');
        if (navButton) navButton.classList.add('active');

        updateUIText();
    });
}

/* ==============================================
   TRANSLATION MANAGEMENT
   ============================================== */

let translations = { en: {}, pt: {} }; // Stores loaded translations

/**
 * Loads translation files from JSON (called from main.js)
 * @async
 * @returns {Promise<void>}
 */
export async function loadTranslations() {
    try {
        // Load both translations in parallel
        const [enResponse, ptResponse] = await Promise.all([
            fetch('./locales/en.json'),
            fetch('./locales/pt.json')
        ]);

        // Handle potential HTTP errors
        if (!enResponse.ok || !ptResponse.ok) {
            throw new Error(`Failed to load translations: ${enResponse.status} / ${ptResponse.status}`);
        }

        // Parse JSON data
        [translations.en, translations.pt] = await Promise.all([
            enResponse.json(),
            ptResponse.json()
        ]);

        console.log('Translations loaded successfully');

    } catch (error) {
        console.error('Error loading translations:', error);
        // Maintain empty translations to prevent crashes
        translations = { en: {}, pt: {} };
    }
}

/**
 * Applies current language translations to UI elements
 * @returns {void}
 */
function updateUIText() {
    const lang = getCurrentLang();
    const t = translations[lang] || {};

    // Section Titles
    setTextContent('#baseInfo-title', t.baseInfoTitle);
    setTextContent('#summary-title', t.summaryTitle);
    setTextContent('#skills-title', t.skillsTitle);
    setTextContent('#experience-title', t.experienceTitle);
    setTextContent('#education-title', t.educationTitle);
    setTextContent('#certifications-title', t.certificationsTitle);
    setTextContent('#projects-title', t.projectsTitle);
    setTextContent('#languages-title', t.languagesTitle);

    // Form Labels
    setTextContent('label[for="name"]', t.nameLabel);
    setTextContent('label[for="title"]', t.titleLabel);
    setTextContent('label[for="location"]', t.locationLabel);
    setTextContent('label[for="phone"]', t.phoneLabel);
    setTextContent('label[for="email"]', t.emailLabel);
    setTextContent('label[for="website"]', t.websiteLabel);
    setTextContent('label[for="linkedin"]', t.linkedinLabel);
    setTextContent('fieldset.contact-info legend', t.contactLegend);

    // Buttons
    setButtonContent('#save-btn', t.saveBtn, 'fa-save');
    setButtonContent('#load-btn', t.loadBtn, 'fa-folder-open');
    setButtonContent('#new-btn', t.newBtn, 'fa-file');
    setTextContent('#add-skill-btn', t.addSkill);

    // Placeholder
    setPlaceholder('#summary', t.summaryPlaceholder);

    // Side Menu Items - Added this section
    document.querySelectorAll('.nav-btn').forEach(button => {
        const section = button.dataset.section;
        if (!section) return;

        // Get translation key based on section name (e.g., "baseInfo" -> "menubaseInfo")
        const translationKey = `menu${section.charAt(0).toUpperCase() + section.slice(1)}`;
        const translatedText = t[translationKey];

        // Preserve icon while updating text
        const icon = button.querySelector('i').cloneNode(true);
        button.innerHTML = '';
        button.appendChild(icon);
        button.append(` ${translatedText}`);
    });
}

/* Helper Functions */

function setTextContent(selector, text) {
    const element = document.querySelector(selector);
    if (element) element.textContent = text || '';
}

function setButtonContent(selector, text, iconClass) {
    const button = document.querySelector(selector);
    if (button) button.innerHTML = `<i class="fas ${iconClass}"></i> ${text || ''}`;
}

function setPlaceholder(selector, text) {
    const input = document.querySelector(selector);
    if (input) input.placeholder = text || '';
}

/* ==============================================
   FORM FIELD MANAGEMENT
   ============================================== */

/**
 * Updates all form fields with resume data using safe access patterns
 * @param {Object} data - Resume data object
 * @returns {void}
 */
function updateFormFields(data) {
    /**
     * Safely sets form field value with validation
     * @param {string} fieldId - DOM element ID
     * @param {string} value - Value to set
     */
    const safeSetValue = (fieldId, value) => {
        const element = document.getElementById(fieldId);

        if (!element) {
            console.warn(`Form element not found: #${fieldId}`);
            return;
        }

        if ('value' in element) {
            element.value = value || ''; // Handle null/undefined
        } else {
            console.error(`Element #${fieldId} is not an input field`);
        }
    };
    /*
    // Log the baseInfo data to the console for debugging

    console.log('Base Info:', data.baseInfo);
    console.log('Contact Info:', data.baseInfo?.contact);
    */

    // ---------------- baseInfo Section ----------------
    safeSetValue('name', data.baseInfo?.name);
    safeSetValue('title', data.baseInfo?.title);

    // ---------------- Contact Information ----------------
    const contact = data.baseInfo?.contact || {};
    safeSetValue('location', contact.location);
    safeSetValue('phone', contact.phone);
    safeSetValue('email', contact.email);
    safeSetValue('website', contact.website);
    safeSetValue('linkedin', contact.linkedin);

    // ---------------- Professional Summary ----------------
    const summaryField = document.getElementById('summary');
    if (summaryField) {
        // Set summary content
        summaryField.value = data.professional_summary || '';

        // Initialize character counter
        const charCount = document.getElementById('char-count');
        if (charCount) {
            // Set initial value
            charCount.textContent = summaryField.value.length;

            // Update counter on input using passive event listener
            summaryField.addEventListener('input', () => {
                charCount.textContent = summaryField.value.length;
            }, { passive: true });
        }
    }
}
/* ==============================================
   SECTION RENDERING FUNCTIONS
   ============================================== */

/**
 * Renders all resume sections with data
 * @param {object} data - Resume data object
 * @returns {void}
 */
function renderAllSections(data) {
    renderExperience(data.experience || []);
    renderSkills(data.technical_skills || []);
    renderEducation(data.education || []);
    renderCertifications(data.certifications || []);
    renderProjects(data.projects || []);
    renderLanguages(data.languages || []);
}

/**
 * Renders experience section
 * @param {Array} experience - Array of experience items
 * @returns {void}
 */
export function renderExperience(experience) {
    const container = document.getElementById('experience-container');
    if (!container) return;

    container.innerHTML = experience.map(exp => `
        <div class="experience-item">
            <h3><i class="fas fa-briefcase"></i>${exp.title} @ ${exp.company}</h3>
            <p class="dates">${exp.dates}</p>
            <ul class="description-list">
                ${exp.description.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

/**
 * Renders skills section
 * @param {Array} skills - Array of skill items
 * @returns {void}
 */
export function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container) return;

    // Sanitization helper
    const escapeHTML = str => String(str).replace(/[&<>"'/]/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;',
        '"': '&quot;', "'": '&#39;', '/': '&#x2F;'
    }[char]));

    // Convert strength to number with validation
    const getValidStrength = strength => {
        const num = Number(strength);
        return Number.isInteger(num) && num >= 1 && num <= 5 ? num : 1;
    };

    container.innerHTML = skills.map((skill, index) => {
        const safeName = escapeHTML(skill.name);
        const safeDescription = escapeHTML(skill.description);
        const strength = getValidStrength(skill.strength);

        return `
        <div class="skill-item" data-index="${index}">
            <div class="skill-view">
                <h3>${safeName}</h3>
                ${renderProficiency(strength)}
                <p class="skill-description">${safeDescription}</p>
            </div>
            <div class="skill-editor"">
                <input type="text" class="skill-name" value="${safeName}">
                <div class="strength-select">
                    ${Array.from({ length: 5 }, (_, i) => {
                        const btnStrength = i + 1;
                        return `<button type="button" 
                                  data-strength="${btnStrength}" 
                                  class="${btnStrength === strength ? 'active' : ''}"
                                >${btnStrength}</button>`;
                    }).join('')}
                </div>
                <textarea class="skill-description-input">${safeDescription}</textarea>
                <div class="edit-buttons">
                    <button type="button" class="btn btn--primary save-edit">Save</button>
                    <button type="button" class="btn btn--secondary cancel-edit">Cancel</button>
                </div>
            </div>
            <div class="skill-buttons">
                <button class="edit-btn" data-index="${index}" aria-label="Edit skill">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="remove-btn" data-index="${index}" aria-label="Remove skill">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>`;
    }).join('');

    // Event delegation for strength selectors
    container.addEventListener('click', e => {
        const strengthBtn = e.target.closest('.strength-select button');
        if (strengthBtn) {
            const parent = strengthBtn.closest('.strength-select');
            parent.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            strengthBtn.classList.add('active');
        }
    });
}

function renderProficiency(strength) {
    const validStrength = Math.max(1, Math.min(5, Number(strength)));
    return `
    <div class="proficiency-badges">
        ${Array.from({ length: 5 }, (_, i) => `
            <div class="proficiency-badge ${i < validStrength ? 'active' : ''}"></div>
        `).join('')}
    </div>`;
}

/**
 * Renders education section
 * @param {Array} education - Array of education items
 * @returns {void}
 */
export function renderEducation(education) {
    const container = document.getElementById('education-container');
    if (!container) return;

    container.innerHTML = education.map(edu => `
        <div class="education-item">
            <h3>${edu.degree}</h3>
            <p>${edu.institution}</p>
        </div>
    `).join('');
}

/**
 * Renders certifications section
 * @param {Array} certifications - Array of certification strings
 * @returns {void}
 */
export function renderCertifications(certifications) {
    const container = document.getElementById('certifications-container');
    if (!container) return;

    container.innerHTML = certifications.map(cert => `
        <div class="certification-item">• ${cert}</div>
    `).join('');
}

/**
 * Renders projects section
 * @param {Array} projects - Array of project items
 * @returns {void}
 */
export function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = projects.map(project => `
        <div class="project-item">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
        </div>
    `).join('');
}

/**
 * Renders languages section
 * @param {Array} languages - Array of language strings
 * @returns {void}
 */
export function renderLanguages(languages) {
    const container = document.getElementById('languages-container');
    if (!container) return;

    container.innerHTML = languages.map(lang => `
        <div class="language-item">• ${lang}</div>
    `).join('');
}

/* ==============================================
   UTILITY FUNCTIONS
   ============================================== */

/**
 * Updates the language toggle buttons state
 * @returns {void}
 */
function updateLanguageToggle() {
    const enBtn = document.getElementById('en-btn');
    const ptBtn = document.getElementById('pt-btn');

    if (enBtn && ptBtn) {
        enBtn.classList.toggle('active', getCurrentLang() === 'en');
        ptBtn.classList.toggle('active', getCurrentLang() === 'pt');
    }
}

/**
 * Toggles the file operations modal visibility
 * @param {boolean} show - Whether to show or hide the modal
 * @returns {void}
 */
export function toggleModal(show = true) {
    const modal = document.getElementById('file-modal');
    if (modal) {
        modal.style.display = show ? 'block' : 'none';
    }
}

// Mobile menu functionality
export function initMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });

    document.querySelector('.sidebar-close').addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}
