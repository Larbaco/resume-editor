/**
 * Event Service Module
 * Handles all event listeners and related functionality for the resume application
 */

import {
    getResumeData,
    getAllResumeData,
    saveResumeData,
    switchLanguage,
    updateResumeData,
    createDefaultResume
} from './dataService.js';
import { updateUI, showSection, renderSkills, toggleModal } from './uiService.js';

// ==============================================
// SECTION: Main Setup Function
// ==============================================

/**
 * Sets up all event listeners for the application
 */
export function setupEventListeners() {
    console.log('Setting up event listeners...');

    setupLanguageEvents();
    setupNavigationEvents();
    setupActionButtonEvents();
    setupModalEvents();
    setupFileOperationEvents();
    setupFormEvents();
    setupSkillsEvents();
    setupTextAreaEvents();

    console.log('Event listeners set up successfully');
}

// ==============================================
// SECTION: Event Listener Setup Functions
// ==============================================

/**
 * Sets up language toggle event listeners
 */
function setupLanguageEvents() {
    document.getElementById('en-btn').addEventListener('click', () => {
        switchLanguage('en');
        updateUI();
    });

    document.getElementById('pt-btn').addEventListener('click', () => {
        switchLanguage('pt');
        updateUI();
    });
}

/**
 * Sets up navigation button event listeners
 */
function setupNavigationEvents() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section + '-section';
            showSection(sectionId);
        });
    });
}

/**
 * Sets up main action button event listeners
 */
function setupActionButtonEvents() {
    document.getElementById('save-btn').addEventListener('click', handleSave);
    document.getElementById('load-btn').addEventListener('click', () => toggleModal());
    document.getElementById('new-btn').addEventListener('click', handleNewResume);
}

/**
 * Sets up modal window event listeners
 */
function setupModalEvents() {
    document.querySelector('.close-btn').addEventListener('click', () => toggleModal(false));

    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('file-modal')) {
            toggleModal(false);
        }
    });
}

/**
 * Sets up file operation event listeners
 */
function setupFileOperationEvents() {
    document.getElementById('file-input').addEventListener('change', handleFileUpload);
    document.getElementById('download-en').addEventListener('click', () => downloadResume('en'));
    document.getElementById('download-pt').addEventListener('click', () => downloadResume('pt'));
}

/**
 * Sets up form event listeners
 */
function setupFormEvents() {
    document.getElementById('baseInfo-form').addEventListener('submit', (e) => {
        e.preventDefault();
        savebaseInfoData();
    });
}

/**
 * Sets up skills-related event listeners
 */
function setupSkillsEvents() {
    document.getElementById('add-skill-btn').addEventListener('click', addNewSkill);

    document.getElementById('skills-container').addEventListener('click', (e) => {
        // For remove and edit buttons
        const removeBtn = e.target.closest('.remove-btn');
        const editBtn = e.target.closest('.edit-btn');
        const saveBtn = e.target.closest('.save-edit');

        if (removeBtn) {
            const index = parseInt(removeBtn.dataset.index);
            handleRemoveSkill(index);
        }
        if (editBtn) {
            const index = parseInt(editBtn.dataset.index);
            handleEditSkill(index);
        }
        if (saveBtn) {
            const index = parseInt(saveBtn.closest('.skill-item').dataset.index);
            handleSaveSkillEdit(index);
        }
    });

}

/**
 * Sets up text area event listeners
 */
function setupTextAreaEvents() {
    document.getElementById('summary').addEventListener('blur', saveSummaryData);
}


/* ==============================================
   SECTION: Skill Removal Handler
   ============================================== */

/**
 * Handles skill removal
 * @param {number} index - Index of skill to remove
 */
function handleRemoveSkill(index) {
    if (isNaN(index) || index < 0) return;

    const skills = [...getResumeData().technical_skills];
    if (index >= skills.length) return;

    if (confirm('Are you sure you want to remove this skill?')) {
        skills.splice(index, 1);
        updateResumeData('technical_skills', skills);
        renderSkills(skills);
    }
}


// ==============================================
// SECTION: Core Event Handlers
// ==============================================

/**
 * Handles the save action for the entire resume
 */
async function handleSave() {
    console.log('Saving all data...');
    savebaseInfoData();
    saveSummaryData();

    try {
        await saveResumeData();
        alert('Changes saved successfully!');
    } catch (error) {
        console.error('Save error:', error);
        alert('Failed to save changes. Please try again.');
    }
}

/**
 * Handles creating a new resume
 */
async function handleNewResume() {
    if (confirm('Create new resume? This will overwrite current data.')) {
        console.log('Creating new resume...');
        const newData = createDefaultResume();

        // Update all resume data with default values
        for (const key of Object.keys(newData)) {
            updateResumeData(key, newData[key]);
        }

        try {
            await saveResumeData();
            updateUI();
            alert('New resume created successfully!');
        } catch (error) {
            console.error('Create new resume error:', error);
            alert('Failed to create new resume. Please try again.');
        }
    }
}

// ==============================================
// SECTION: Data Saving Functions
// ==============================================

/**
 * Saves baseInfo data from the form inputs
 */
function savebaseInfoData() {
    console.log('Saving baseInfo data...');
    const data = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        contact: {
            location: document.getElementById('location').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            website: document.getElementById('website').value,
            linkedin: document.getElementById('linkedin').value
        }
    };
    updateResumeData('baseInfo', data);
}

/**
 * Saves professional summary data
 */
function saveSummaryData() {
    console.log('Saving summary data...');
    const summary = document.getElementById('summary').value;
    updateResumeData('professional_summary', summary);
}

/**
 * Adds a new skill through user prompts
 */
function addNewSkill() {
    console.log('Adding new skill...');
    const name = prompt('Skill name:');
    if (!name) return;

    const strength = prompt('Skill strength (1-5):', '3');
    const description = prompt('Skill description:');

    const newSkill = {
        name,
        strength: parseInt(strength) || 3,
        description: description || ''
    };

    const skills = [...getResumeData().technical_skills, newSkill];
    updateResumeData('technical_skills', skills);
    renderSkills(skills);
}

// ==============================================
// SECTION: File Operations
// ==============================================

/**
 * Handles file upload and parsing
 * @param {Event} e - File input change event
 */
function handleFileUpload(e) {
    console.log('Handling file upload...');
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            updateResumeData('', data);
            updateUI();
            toggleModal(false);
            alert('Resume loaded successfully!');
        } catch (err) {
            console.error('Error parsing JSON file:', err);
            alert('Error parsing JSON file. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

/**
 * Downloads resume data as JSON file
 * @param {string} lang - Language code ('en' or 'pt')
 */
function downloadResume(lang) {
    console.log(`Downloading ${lang} resume...`);
    const data = getAllResumeData()[lang];
    if (!data) {
        alert('No data to download');
        return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${lang}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toggleModal(false);
}


/* ==============================================
   SECTION: Skill Editing Handlers
   ============================================== */

function handleEditSkill(index) {
    const skillItem = document.querySelector(`.skill-item[data-index="${index}"]`);
    if (!skillItem) {
        console.error('Skill item not found for index:', index);
        return;
    }
    const currentStrength = getResumeData().technical_skills[index].strength;
    // Store original data in case of cancel
    const originalData = {
        name: skillItem.querySelector('.skill-view h3').textContent,
        strength: currentStrength, // Use actual numeric value
        description: skillItem.querySelector('.skill-view .skill-description').textContent
    };
    skillItem.dataset.original = JSON.stringify(originalData);

    // Toggle visibility
    skillItem.classList.add('editing');


    // Add cancel handler
    const cancelBtn = skillItem.querySelector('.cancel-edit');
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            const original = JSON.parse(skillItem.dataset.original);
            skillItem.querySelector('.skill-name').value = original.name;
            skillItem.querySelector('.skill-description').value = original.description;
            skillItem.querySelectorAll('.strength-select button').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.strength === original.strength);
            });
            skillItem.classList.remove('editing');
        };
    }
}

function handleSaveSkillEdit(index) {
    try {
        const skillItem = document.querySelector(`.skill-item[data-index="${index}"]`);
        if (!skillItem) throw new Error('Skill item not found');

        // Get form values
        const activeBtn = skillItem.querySelector('.strength-select .active');
        const strength = parseInt(activeBtn?.dataset.strength) || 1;
        const nameInput = skillItem.querySelector('.skill-name');
        const descInput = skillItem.querySelector('.skill-description-input');

        // Validate inputs
        if (!nameInput.value.trim()) {
            alert('Skill name cannot be empty');
            return;
        }
        // log the skillItem fields for debugging
        console.log('Skill Item:', skillItem);
        console.log('Name Input:', nameInput.value.trim());
        console.log('Description Input:', descInput.value.trim());
        console.log('Strength:', strength);

        // Update skills array
        const skills = [...getResumeData().technical_skills];
        skills[index] = {
            ...skills[index],
            name: nameInput.value.trim(),
            description: descInput.value.trim(),
            strength: strength
        };

        // Update state and UI
        updateResumeData('technical_skills', skills);

        // Direct DOM update instead of full re-render
        const viewSection = skillItem.querySelector('.skill-view');
        viewSection.querySelector('h3').textContent = skills[index].name;
        viewSection.querySelector('.skill-description').textContent = skills[index].description;
        viewSection.querySelector('.proficiency-badges').innerHTML =
            Array.from({ length: 5 }, (_, i) =>
                `<div class="proficiency-badge ${i < skills[index].strength ? 'active' : ''}"></div>`
            ).join('');

        // Reset editing state
        skillItem.classList.remove('editing');
        viewSection.hidden = false;
        skillItem.querySelector('.skill-editor').hidden = true;

    } catch (error) {
        console.error('Skill save error:', error);
        alert(`Failed to save skill: ${error.message}`);
    }
}