const fs = require('fs');
const path = require('path');

console.log('🧪 Starting CSS Fix Test Script...\n');

// Define the CSS files to fix
const cssFiles = [
  {
    path: 'src/index.css',
    content: `:root {
  --primary-navy: #1D3557;
  --accent-steel: #457B9D;
  --background-off-white: #F1FAEE;
  --sidebar-dark: #2B2D42;
  --card-dark: #343A40;
  --text-light: #EAEAEA;
  --text-white: #F8F9FA;
  --text-dark: #1f2937;
  --text-muted: #6b7280;
  --white: #ffffff;
  --light-gray: #f3f4f6;
  --medium-gray: #d1d5db;
  --dark-gray: #374151;
  --success-green: #10B981;
  --danger-red: #EF4444;
  --warning-orange: #F59E0B;
  --info-blue: #3B82F6;
  --sidebar-width: 280px;
  --transition-time: 0.3s;
  
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --font-family-sans-serif: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  --header-height: 60px;
}

body {
  margin: 0;
  font-family: var(--font-family-sans-serif);
  background-color: var(--background-off-white);
  color: var(--text-dark);
  line-height: 1.6;
  overflow-x: hidden;
}

.App {
  display: flex;
  min-height: 100vh;
  background-color: var(--background-off-white);
}

.sidebar {
  width: 250px;
  background-color: var(--sidebar-dark);
  color: var(--text-light);
  position: fixed;
  top: 0;
  left: -250px;
  height: 100%;
  transition: left 0.3s ease-in-out;
  z-index: 1030;
  display: flex;
  flex-direction: column;
}

.sidebar.open {
  left: 0;
}

.sidebar-header {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #495057;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.nav-item {
  border-bottom: 1px solid #495057;
}

.nav-link {
  display: block;
  padding: 15px 20px;
  color: #adb5bd;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover {
  background-color: #495057;
  color: #ffffff;
}

.nav-link.active {
  background-color: #0d6efd;
  color: #ffffff;
  font-weight: bold;
}

.sidebar-footer {
    padding: 20px;
    border-top: 1px solid #495057;
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: transparent;
  color: var(--primary-navy);
  padding: 0.5rem 1rem;
  z-index: 1020;
  box-shadow: none;
}

.sidebar-toggle-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--primary-navy);
}

main {
  flex-grow: 1;
  padding: 0 20px 20px 20px;
  transition: margin-left 0.3s ease-in-out;
  background-color: var(--background-off-white);
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

main > * {
  background-color: inherit;
}

main .bg-white {
  background-color: var(--white) !important;
}

main .bg-light {
  background-color: var(--light-gray) !important;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1029;
  display: none;
}

.overlay.show {
  display: block;
}

@media (min-width: 768px) {
  .sidebar {
    left: 0;
  }

  main {
    margin-left: 250px;
  }

  .app-header {
    left: 250px;
    width: calc(100% - 250px);
  }

  .sidebar-toggle-btn {
    display: none;
  }

  .overlay {
    display: none !important;
  }
}`
  },
  {
    path: 'src/App.css',
    content: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--background-off-white);
  color: var(--text-dark);
  margin: 0;
  overflow-x: hidden;
  min-height: 100vh;
}

main {
  background-color: var(--background-off-white) !important;
}

.container-fluid,
.container {
  background-color: transparent !important;
}

.row {
  background-color: transparent !important;
}

.col, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12,
.col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12,
.col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12 {
  background-color: transparent !important;
}

* {
  box-sizing: border-box;
}

.App {
  position: relative;
  z-index: 1;
}

main {
  position: relative;
  z-index: 1;
}

.bg-white {
  background-color: var(--white) !important;
}

.bg-light {
  background-color: var(--light-gray) !important;
}

.admin-dashboard,
.user-dashboard,
.superadmin-dashboard {
  background-color: var(--background-off-white) !important;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.dashboard-container,
.admin-dashboard-container,
.user-dashboard-container,
.superadmin-dashboard-container {
  background-color: transparent !important;
}

.dashboard-header-pro,
.dashboard-header,
.user-dashboard-header {
  background: linear-gradient(135deg, var(--white) 0%, var(--light-gray) 100%) !important;
  position: relative;
  z-index: 2;
}

.container-fluid,
.container {
  background-color: transparent !important;
}

.card {
  background-color: var(--white) !important;
}

.bg-white {
  background-color: var(--white) !important;
}

.bg-light {
  background-color: var(--light-gray) !important;
}

.bg-transparent {
  background-color: transparent !important;}`
  },
  {
    path: 'src/components/Sidebar.css',
    content: `/* Sidebar.css */
.sidebar {
  width: 280px;
  height: 100vh;
  background: linear-gradient(135deg, var(--sidebar-dark) 0%, var(--primary-navy) 100%);
  color: var(--text-light);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.closed {
  transform: translateX(-100%);
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.admin-profile {
  position: relative;
  margin-bottom: 15px;
}

.admin-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.admin-avatar:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.admin-avatar i {
  font-size: 24px;
  color: white;
}

.admin-name {
  margin: 10px 0 5px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-light);
}

.role-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge i {
  font-size: 8px;
  color: #4ade80;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.nav-section {
  margin-bottom: 10px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-header:hover {
  background: rgba(255, 255, 255, 0.1);
}

.section-header i:first-child {
  margin-right: 10px;
  width: 16px;
  text-align: center;
}

.section-toggle {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.section-items {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgba(0, 0, 0, 0.1);
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px 12px 50px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: var(--accent-steel);
  color: var(--text-white);
  border-left-color: var(--accent-steel);
  transform: translateX(4px);
}

.nav-link.active {
  background: var(--accent-steel);
  color: var(--text-white);
  border-left-color: var(--success-green);
  font-weight: 500;
}

.nav-link i {
  margin-right: 12px;
  width: 16px;
  text-align: center;
  font-size: 14px;
}

.nav-link span {
  flex: 1;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  transform: translateY(-1px);
}

.logout-button i {
  font-size: 14px;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.show {
  opacity: 1;
  visibility: visible;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-width: 320px;
  }
  
  .section-header {
    padding: 15px 20px;
  }
  
  .nav-link {
    padding: 15px 20px 15px 50px;
  }
}

.section-items {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
}

.section-items.expanded {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
  transition: max-height 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
}

.nav-link:hover i {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.section-header:hover i {
  color: #4ade80;
}

.section-header.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.section-header.active i {
  color: #4ade80;
}`
  },
  {
    path: 'src/main.jsx',
    content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
  }
];

// Function to backup existing files
function backupFile(filePath) {
  const backupPath = filePath + '.backup';
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`📦 Backed up: ${filePath} -> ${backupPath}`);
    return true;
  }
  return false;
}

// Function to restore file from backup
function restoreFromBackup(filePath) {
  const backupPath = filePath + '.backup';
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, filePath);
    console.log(`🔄 Restored: ${backupPath} -> ${filePath}`);
    return true;
  }
  return false;
}

// Function to delete backup files
function deleteBackups() {
  cssFiles.forEach(file => {
    const backupPath = file.path + '.backup';
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
      console.log(`🗑️  Deleted backup: ${backupPath}`);
    }
  });
}

// Function to apply CSS fixes
function applyCSSFixes() {
  console.log('🔧 Applying CSS fixes...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  cssFiles.forEach(file => {
    try {
      // Create directory if it doesn't exist
      const dir = path.dirname(file.path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Backup existing file
      backupFile(file.path);
      
      // Write the fixed CSS content
      fs.writeFileSync(file.path, file.content);
      console.log(`✅ Fixed: ${file.path}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error fixing ${file.path}:`, error.message);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Results: ${successCount} files fixed, ${errorCount} errors`);
  return successCount === cssFiles.length;
}

// Function to test the fixes
function testFixes() {
  console.log('🧪 Testing CSS fixes...\n');
  
  let allGood = true;
  
  cssFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      const content = fs.readFileSync(file.path, 'utf8');
      
      // Check for key fixes
      const checks = [
        { name: 'CSS Variables', pattern: /--primary-navy:/, file: 'index.css' },
        { name: 'Bootstrap Import', pattern: /bootstrap\.dist\.css/, file: 'main.jsx' },
        { name: 'Background Overrides', pattern: /background-color.*transparent/, file: 'App.css' },
        { name: 'Sidebar Variables', pattern: /var\(--sidebar-dark\)/, file: 'Sidebar.css' }
      ];
      
      checks.forEach(check => {
        if (file.path.includes(check.file) && !check.pattern.test(content)) {
          console.log(`⚠️  Warning: ${check.name} not found in ${file.path}`);
          allGood = false;
        }
      });
      
      console.log(`✅ ${file.path} - OK`);
    } else {
      console.log(`❌ ${file.path} - File not found`);
      allGood = false;
    }
  });
  
  return allGood;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'apply':
      console.log('🚀 Applying CSS fixes...\n');
      if (applyCSSFixes()) {
        console.log('\n✅ All CSS fixes applied successfully!');
        console.log('💡 Run "npm run build" to test the changes.');
      } else {
        console.log('\n❌ Some fixes failed to apply.');
      }
      break;
      
    case 'test':
      console.log('🧪 Testing current CSS state...\n');
      if (testFixes()) {
        console.log('\n✅ All CSS files are properly configured!');
      } else {
        console.log('\n❌ Some CSS files need attention.');
      }
      break;
      
    case 'restore':
      console.log('🔄 Restoring from backups...\n');
      let restoredCount = 0;
      cssFiles.forEach(file => {
        if (restoreFromBackup(file.path)) {
          restoredCount++;
        }
      });
      console.log(`\n📊 Restored ${restoredCount} files from backups.`);
      break;
      
    case 'cleanup':
      console.log('🧹 Cleaning up backup files...\n');
      deleteBackups();
      console.log('\n✅ Backup files cleaned up.');
      break;
      
    default:
      console.log('🔧 CSS Fix Test Script\n');
      console.log('Usage:');
      console.log('  node css-fix-test.js apply    - Apply CSS fixes');
      console.log('  node css-fix-test.js test     - Test current CSS state');
      console.log('  node css-fix-test.js restore  - Restore from backups');
      console.log('  node css-fix-test.js cleanup  - Clean up backup files');
      console.log('\nExample:');
      console.log('  node css-fix-test.js apply');
      break;
  }
}

// Run the script
main(); 