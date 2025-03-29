import { initializeApp } from './dataService.js';
import { setupEventListeners } from './eventService.js';
import { updateUI, loadTranslations, initMobileMenu } from './uiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadTranslations();
        await initializeApp();
        setupEventListeners(); 
        initMobileMenu();
        updateUI();
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to initialize application. Please check console for details.');
    }
});