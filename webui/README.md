# Resume Editor Application

A web-based application for managing resume data, used to generate dynamic resumes for portfolio websites. Supports bilingual editing (English/Portuguese) with real-time updates and local persistence.

---

## 🚀 Key Features

### 🌍 Bilingual Support
- Edit resumes in **English (EN)** and **Portuguese (PT)** with seamless language switching.

### 📌 Section-Based Editing
Organized sections for:
- Basic Information
- Professional Summary
- Technical Skills (with proficiency levels)
- Work Experience
- Education
- Certifications
- Projects
- Languages

### 🔄 Data Operations
- Save/Load to local **JSON** files
- Create new resumes
- Import/export functionality
- Automatic data validation

### 🎨 UI Features
- **Mobile-responsive design**
- **Interactive forms** with validation
- **Real-time character counters**
- **Skill proficiency visualization**
- **File operations modal**

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** Semantic Markup
- **CSS3** with Modular Architecture
- **Vanilla JavaScript** (ES6+ Modules)

### Backend
- **Node.js**
- **Express.js**
- **REST API** (GET/POST)

---

## ⚙️ Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/resume-editor.git
cd resume-editor
```

### 2️⃣ Install Dependencies
```bash
npm install express cors
```

### 3️⃣ Directory Structure
```bash
├── public/
│   ├── data/          # Auto-created resume storage
│   ├── locales/       # Translation files (en.json/pt.json)
│   ├── css/           # Style modules
│   └── js/            # Application modules
├── server.js          # Express server
└── package.json
```

### 4️⃣ Start Server
```bash
node server.js
```
App runs at: **http://localhost:3001**

---

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/resume/:lang` | GET | Retrieve resume data for specified language |
| `/api/resume/:lang` | POST | Save resume data for specified language |

---

## 📖 Usage Guide

### 🌎 Language Switching
- Click **flag buttons** in the header to toggle between **English** and **Portuguese** versions.

### 📂 Section Navigation
- Use **sidebar buttons** to navigate between different resume sections.

### ✏️ Editing Data
- **Basic Info:** Direct form input
- **Skills:** Add/remove/edit with dynamic **proficiency selector**
- **Experience/Education:** **Rich text** support
- **Summary:** **Real-time character counter** *(500 max)*

### 📁 File Operations
- **Save:** Stores data to local JSON files
- **Load:** Import existing JSON resume
- **New:** Reset to default template
- **Download:** Get JSON copy of current resume

---

## 📂 Project Structure

### 🔧 Core Modules
- **`dataService.js`** - Data management & API communication
- **`eventService.js`** - All event handlers & UI interactions
- **`uiService.js`** - Rendering logic & DOM manipulation
- **`server.js`** - Backend server configuration

### 🎨 Style Architecture
- **7-1 CSS Pattern** (Abstracts, Base, Components, Layouts)
- **BEM naming convention**
- **Responsive breakpoints**
- **CSS Variables** for theme consistency

---

## 📌 Development Notes

### 🌐 Translation Files
Create `public/locales/en.json` and `public/locales/pt.json` with structure:
```json
{
  "baseInfoTitle": "Basic Information",
  "summaryTitle": "Professional Summary",
  "menuBaseInfo": "Basic Info"
}
```

### 💾 Data Persistence
Resume data automatically saves to:
- `public/data/en.json`
- `public/data/pt.json`

### 📱 Mobile Optimization
- **Hamburger menu** for mobile views
- **Touch-friendly controls**
- **Viewport-adaptive layouts**

---

## 📜 License
This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**. 

You are free to:
- Share — Copy and redistribute the material in any medium or format
- Adapt — Remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- **NonCommercial** — You may not use the material for commercial purposes.

For more details, see [CC BY-NC 4.0 License](https://creativecommons.org/licenses/by-nc/4.0/).

