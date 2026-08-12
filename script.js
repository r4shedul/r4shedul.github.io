/**
 * Rashed's Portfolio – Full Admin + Public Logic with Undo
 * Firebase Realtime Database – Fully Fixed
 * Fixed: Async save, CRUD promises, loop prevention, form handlers
 */

// ============================================================
// DATA LAYER – Firebase Realtime Database
// ============================================================

const DEFAULT_DATA = {
  hero: {
    profileImage: 'https://ui-avatars.com/api/?name=Rashedul+Islam&size=180&background=0f4c81&color=fff&font-size=0.5',
    fullName: 'Rashedul Islam',
    status: 'Open to opportunities',
    bio: 'Statistics student with a passion for data analysis, MIS, and visual storytelling.',
    statusSource: 'education'
  },
  experience: [
    { id: 1, company: 'DataCorp Ltd.', role: 'Data Analyst Intern', location: 'Dhaka, Bangladesh', start: 'Jan 2025', end: 'Present', description: 'Analyzed sales data and built dashboards using Power BI.', current: true },
    { id: 2, company: 'Analytics Hub', role: 'Junior Data Scientist', location: 'Remote', start: 'Aug 2024', end: 'Dec 2024', description: 'Developed predictive models for customer churn.', current: false }
  ],
  education: [
    { id: 1, institution: 'Dhaka College', degree: 'Bachelor of Science (Honours)', field: 'Statistics', location: 'Dhaka, Bangladesh', start: '2022', end: 'Present', description: 'Department of Statistics, Dhaka College, affiliated with the University of Dhaka.', isHeroStatus: true }
  ],
  about: {
    text: "I'm a <strong>Statistics student</strong> from Bangladesh with a deep curiosity for how data shapes decisions. Beyond the classroom, I've dived into <strong>data analysis</strong>, <strong>MIS</strong>, and <strong>visualization</strong> – turning raw numbers into clear, actionable stories.",
    cards: [
      { icon: 'bar-chart-2', title: 'Data Analysis', description: 'Extracting insights using Python, Excel, and statistics.', skillGroup: 'Data & Analytics', projectCategory: 'data' },
      { icon: 'pie-chart', title: 'Visualization', description: 'Creating compelling charts and dashboards.', skillGroup: 'Visualization', projectCategory: 'data' },
      { icon: 'database', title: 'MIS & Reporting', description: 'Designing systems for better decision‑making.', skillGroup: 'Tools & Platforms', projectCategory: 'automation' }
    ]
  },
  skills: [
    { group: 'Data & Analytics', items: [{ name: 'Excel / Google Sheets', icon: '', level: 'Advanced' }, { name: 'Python (Pandas)', icon: '', level: 'Intermediate' }, { name: 'SQL', icon: '', level: 'Intermediate' }, { name: 'Statistical Analysis', icon: '', level: 'Advanced' }] },
    { group: 'Visualization', items: [{ name: 'Matplotlib / Seaborn', icon: '', level: 'Intermediate' }, { name: 'Power BI', icon: '', level: 'Intermediate' }, { name: 'Tableau', icon: '', level: 'Beginner' }, { name: 'Plotly', icon: '', level: 'Beginner' }] },
    { group: 'Development', items: [{ name: 'HTML / CSS', icon: '', level: 'Intermediate' }, { name: 'JavaScript', icon: '', level: 'Beginner' }, { name: 'Python (Scripting)', icon: '', level: 'Intermediate' }, { name: 'Git', icon: '', level: 'Intermediate' }] },
    { group: 'Tools & Platforms', items: [{ name: 'Jupyter Notebook', icon: '', level: 'Advanced' }, { name: 'VS Code', icon: '', level: 'Advanced' }, { name: 'Excel (Advanced)', icon: '', level: 'Advanced' }, { name: 'Google Analytics', icon: '', level: 'Beginner' }] }
  ],
  projects: [
    { id: 1, title: 'Football Match Bot', description: 'Python Telegram bot for football schedules and live results.', tags: ['Python', 'Telegram API', 'Automation'], category: 'automation', github: 'https://github.com/r4shedul', demo: '' },
    { id: 2, title: 'Python GUI Calculator', description: 'Desktop calculator built with Python and Tkinter.', tags: ['Python', 'Tkinter', 'GUI'], category: 'python', github: 'https://github.com/r4shedul', demo: '' },
    { id: 3, title: 'Body Fat Calculator', description: 'Calculates body fat percentage from measurements.', tags: ['Python', 'Math/Logic'], category: 'python', github: 'https://github.com/r4shedul', demo: '' }
  ],
  categories: ['python', 'automation', 'data'],
  timeline: [
    { id: 1, title: 'Statistics Foundation', description: 'Probability, hypothesis testing, regression.', current: false },
    { id: 2, title: 'Python & Data', description: 'From scripts to Pandas analysis.', current: false },
    { id: 3, title: 'Automation', description: 'Building tools to eliminate repetitive tasks.', current: false },
    { id: 4, title: 'Visualization & MIS', description: 'Dashboards and reports for decisions.', current: false },
    { id: 5, title: 'Advanced Analytics', description: 'Machine learning and predictive modeling.', current: false },
    { id: 6, title: 'Data Storytelling', description: 'Crafting narratives from data.', current: true }
  ],
  stats: [
    { label: 'Projects Built', value: '6+' },
    { label: 'Datasets Analyzed', value: '15+' },
    { label: 'Tools Learned', value: '12+' },
    { label: 'Code Commits', value: '200+' }
  ],
  social: [
    { platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/placeholder', icon: 'linkedin' },
    { platform: 'github', label: 'GitHub', url: 'https://github.com/r4shedul', icon: 'github' },
    { platform: 'mail', label: 'Email', url: 'mailto:your.email@placeholder.com', icon: 'mail' },
    { platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/placeholder', icon: 'facebook' }
  ],
  contact: { text: "I'm always open to interesting conversations, collaboration, or sharing ideas about data, analytics, and technology." },
  certificates: [
    { id: 1, title: 'Data Analysis with Python', issuer: 'freeCodeCamp', date: 'Jan 2025', description: '300 hours of curriculum covering Pandas, NumPy, and visualization.', url: 'https://freecodecamp.org/cert/...' },
    { id: 2, title: 'SQL for Data Science', issuer: 'Coursera', date: 'Dec 2024', description: 'Mastered SQL queries, joins, and database design.', url: 'https://coursera.org/...' }
  ],
  resume: { url: '', label: 'Download Resume (PDF)', fileData: '', fileName: '' },
  footer: { tagline: 'Data • Analytics • Insights' },
  lastUpdated: new Date().toISOString()
};

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDJWR2MZAm_9cVDMP9oQLyV19LqlsoBcoc",
  authDomain: "portfolio-database-42c35.firebaseapp.com",
  databaseURL: "https://portfolio-database-42c35-default-rtdb.firebaseio.com",
  projectId: "portfolio-database-42c35",
  storageBucket: "portfolio-database-42c35.firebasestorage.app",
  messagingSenderId: "114443799417",
  appId: "1:114443799417:web:c95a6a9c549a75c72bbda8",
  measurementId: "G-7T56HGVX15"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Password hashing (for admin login gate only)
function hashPassword(pw) {
  return CryptoJS.SHA256(pw).toString();
}

// Generates a collision-resistant id for new records
function makeId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// ============================================================
// DATA MANAGER – Fully Fixed with Async/Promises
// ============================================================

const DataManager = {
  _data: null,
  _lastError: null,
  _isSaving: false,
  _lastUpdate: null,

  init() {
    return new Promise((resolve) => {
      // Load initial data
      db.ref('portfolio_data').once('value')
        .then((snapshot) => {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            this._data = val;
            if (!this._data.footer) this._data.footer = { tagline: DEFAULT_DATA.footer.tagline };
            if (!this._data.education) this._data.education = JSON.parse(JSON.stringify(DEFAULT_DATA.education));
            if (this._data.hero && !this._data.hero.statusSource) this._data.hero.statusSource = 'education';
            this._lastUpdate = this._data.lastUpdated;
          } else {
            this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
            this._lastUpdate = this._data.lastUpdated;
            return this.save().then(() => resolve(true));
          }
          resolve(true);
        })
        .catch((err) => {
          console.error('Failed to load from Firebase:', err);
          this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
          this._lastUpdate = this._data.lastUpdated;
          resolve(true);
        });

      // Real-time listener with loop prevention
      db.ref('portfolio_data').on('value', (snapshot) => {
        const val = snapshot.val();
        if (!val || typeof val !== 'object') return;
        
        // Skip if this is the same data we just saved
        if (this._lastUpdate && val.lastUpdated === this._lastUpdate) return;
        this._lastUpdate = val.lastUpdated;
        
        // Skip if we're currently saving to avoid loops
        if (this._isSaving) return;
        
        this._data = val;
        if (typeof renderAll === 'function') {
          renderAll();
        }
        if (document.getElementById('adminDashboard') && 
            document.getElementById('adminDashboard').classList.contains('open')) {
          if (typeof renderAdminDashboard === 'function') {
            renderAdminDashboard();
          }
        }
      });
    });
  },

  save() {
    return new Promise((resolve) => {
      if (!this._data) {
        resolve(false);
        return;
      }
      
      this._isSaving = true;
      this._data.lastUpdated = new Date().toISOString();
      this._lastUpdate = this._data.lastUpdated;
      
      db.ref('portfolio_data').set(this._data)
        .then(() => {
          this._lastError = null;
          this._isSaving = false;
          resolve(true);
        })
        .catch((err) => {
          console.error('Failed to save to Firebase:', err);
          this._lastError = err.message || 'Could not save changes to cloud.';
          this._isSaving = false;
          resolve(false);
        });
    });
  },

  get() { return this._data; },
  
  set(data) {
    this._data = data;
    return this.save();
  },
  
  update(path, value) {
    const parts = path.split('.');
    let cur = this._data;
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
    cur[parts[parts.length - 1]] = value;
    return this.save();
  },
  
  reset() {
    this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    return this.save();
  },

  // ---- CRUD with proper Promises ----
  addProject(p) {
    p.id = makeId();
    this._data.projects.push(p);
    return this.save().then(ok => ok ? p : null);
  },
  
  updateProject(id, data) {
    const idx = this._data.projects.findIndex(p => p.id === id);
    if (idx > -1) {
      this._data.projects[idx] = { ...this._data.projects[idx], ...data };
      return this.save();
    }
    return Promise.resolve(false);
  },
  
  deleteProject(id) {
    this._data.projects = this._data.projects.filter(p => p.id !== id);
    return this.save();
  },

  addCategory(cat) {
    this._data.categories.push(cat);
    return this.save().then(ok => ok ? cat : null);
  },
  
  deleteCategory(cat) {
    this._data.categories = this._data.categories.filter(c => c !== cat);
    return this.save();
  },

  addTimeline(item) {
    item.id = item.id || makeId();
    this._data.timeline.push(item);
    return this.save().then(ok => ok ? item : null);
  },
  
  updateTimeline(id, data) {
    const idx = this._data.timeline.findIndex(t => t.id === id);
    if (idx > -1) {
      this._data.timeline[idx] = { ...this._data.timeline[idx], ...data };
      return this.save();
    }
    return Promise.resolve(false);
  },
  
  deleteTimeline(id) {
    this._data.timeline = this._data.timeline.filter(t => t.id !== id);
    return this.save();
  },

  addSocial(s) {
    s.id = s.id || makeId();
    this._data.social.push(s);
    return this.save().then(ok => ok ? s : null);
  },
  
  updateSocial(id, data) {
    const idx = this._data.social.findIndex(s => s.id === id);
    if (idx > -1) {
      this._data.social[idx] = { ...this._data.social[idx], ...data };
      return this.save();
    }
    return Promise.resolve(false);
  },
  
  deleteSocial(id) {
    this._data.social = this._data.social.filter(s => s.id !== id);
    return this.save();
  },

  addCertificate(c) {
    c.id = c.id || makeId();
    this._data.certificates.push(c);
    return this.save().then(ok => ok ? c : null);
  },
  
  updateCertificate(id, data) {
    const idx = this._data.certificates.findIndex(c => c.id === id);
    if (idx > -1) {
      this._data.certificates[idx] = { ...this._data.certificates[idx], ...data };
      return this.save();
    }
    return Promise.resolve(false);
  },
  
  deleteCertificate(id) {
    this._data.certificates = this._data.certificates.filter(c => c.id !== id);
    return this.save();
  },

  updateResume(data) {
    this._data.resume = { ...this._data.resume, ...data };
    return this.save();
  },

  addExperience(exp) {
    exp.id = exp.id || makeId();
    this._data.experience.push(exp);
    return this.save().then(ok => ok ? exp : null);
  },
  
  updateExperience(id, data) {
    const idx = this._data.experience.findIndex(e => e.id === id);
    if (idx > -1) {
      this._data.experience[idx] = { ...this._data.experience[idx], ...data };
      return this.save();
    }
    return Promise.resolve(false);
  },
  
  deleteExperience(id) {
    this._data.experience = this._data.experience.filter(e => e.id !== id);
    return this.save();
  },

  addEducation(edu) {
    edu.id = edu.id || makeId();
    this._data.education.push(edu);
    return this.save().then(ok => ok ? edu : null);
  },
  
  updateEducation(id, data) {
    const idx = this._data.education.findIndex(e => e.id === id);
    if (idx > -1) {
      this._data.education[idx] = { ...this._data.education[idx], ...data };
      return this.save();
    }
    return Promise.resolve(false);
  },
  
  deleteEducation(id) {
    this._data.education = this._data.education.filter(e => e.id !== id);
    return this.save();
  }
};

// ============================================================
// SAFE TEXT RENDERING
// ============================================================
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================
// IMAGE COMPRESSION
// ============================================================
function compressImage(file, options) {
  options = options || {};
  const maxWidth = options.maxWidth || 800;
  const maxHeight = options.maxHeight || 800;
  const quality = options.quality || 0.85;
  const outputType = options.outputType || (file.type === 'image/png' ? 'image/png' : 'image/jpeg');

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const ratio = Math.min(1, maxWidth / img.width, maxHeight / img.height);
      const targetW = Math.max(1, Math.round(img.width * ratio));
      const targetH = Math.max(1, Math.round(img.height * ratio));
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (outputType === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
      }
      ctx.drawImage(img, 0, 0, targetW, targetH);
      try {
        resolve(canvas.toDataURL(outputType, quality));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image for compression.'));
    };
    img.src = objectUrl;
  });
}

// ============================================================
// ADMIN NOTIFICATIONS
// ============================================================
function showNotice(message, type) {
  let el = document.getElementById('admin-notice');
  if (!el) {
    el = document.createElement('div');
    el.id = 'admin-notice';
    el.className = 'admin-notice';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = 'admin-notice show ' + (type === 'error' ? 'notice-error' : 'notice-success');
  clearTimeout(el._hideTimeout);
  el._hideTimeout = setTimeout(() => { el.classList.remove('show'); }, type === 'error' ? 6000 : 3200);
}

function notifySaveResult(promise, label) {
  if (promise && typeof promise.then === 'function') {
    promise.then(ok => {
      if (ok) {
        showNotice(`${label} saved.`, 'success');
      } else {
        showNotice(`Failed to save ${label.toLowerCase()}: ${DataManager._lastError || 'unknown error'}`, 'error');
      }
    }).catch(err => {
      showNotice(`Error saving ${label.toLowerCase()}: ${err.message || 'unknown'}`, 'error');
    });
  } else {
    const ok = promise;
    if (ok) {
      showNotice(`${label} saved.`, 'success');
    } else {
      showNotice(`Failed to save ${label.toLowerCase()}: ${DataManager._lastError || 'unknown error'}`, 'error');
    }
  }
}

// ============================================================
// DUPLICATE SUBMISSION GUARD
// ============================================================
function guardDoubleSubmit(form) {
  if (form.dataset.submitting === 'true') return true;
  form.dataset.submitting = 'true';
  const btn = form.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;
  setTimeout(() => {
    form.dataset.submitting = 'false';
    if (btn) btn.disabled = false;
  }, 600);
  return false;
}

// ============================================================
// UNDO SYSTEM
// ============================================================
let undoTimeout = null;

function showUndoToast(message, onUndo) {
  const container = document.getElementById('toast-container');
  const msgEl = document.getElementById('toast-message');
  const undoBtn = document.getElementById('toast-undo-btn');
  const closeBtn = document.getElementById('toast-close-btn');
  msgEl.textContent = message;
  container.classList.add('show');
  if (undoTimeout) clearTimeout(undoTimeout);
  undoTimeout = setTimeout(() => {
    container.classList.remove('show');
  }, 8000);
  undoBtn.onclick = () => {
    clearTimeout(undoTimeout);
    if (onUndo) onUndo();
    container.classList.remove('show');
  };
  closeBtn.onclick = () => {
    clearTimeout(undoTimeout);
    container.classList.remove('show');
  };
}

// ============================================================
// RENDER FUNCTIONS – public
// ============================================================

function renderAll() {
  const data = DataManager.get();
  if (!data) return;

  document.getElementById('profileImage').src = data.hero.profileImage || DEFAULT_DATA.hero.profileImage;
  document.getElementById('heroFullName').textContent = data.hero.fullName || 'Rashedul Islam';
  document.getElementById('footerName').textContent = (data.hero.fullName || 'RASHEDUL ISLAM').toUpperCase();
  document.getElementById('hero-status').textContent = data.hero.status;
  document.getElementById('heroBio').textContent = data.hero.bio;

  renderCurrentRole();
  renderLatestProject();
  renderExperience();
  renderEducation();

  const statsGrid = document.getElementById('stats-grid');
  statsGrid.innerHTML = data.stats.map(s => `
    <div class="stat-card">
      <div class="stat-number">${escapeHTML(s.value)}</div>
      <div class="stat-label">${escapeHTML(s.label)}</div>
    </div>
  `).join('');

  document.getElementById('about-text').innerHTML = data.about.text;
  renderAboutCards();
  renderSkills();
  renderCertificates();
  renderProjects('all');
  renderPieChart();
  renderTimeline();

  document.getElementById('socialLinks').innerHTML = data.social.map(s => `
    <a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer" class="social-link" title="${escapeHTML(s.label)}" aria-label="${escapeHTML(s.label)}">
      ${s.logo
        ? `<img src="${escapeHTML(s.logo)}" alt="${escapeHTML(s.label)}" class="social-logo-img" />`
        : `<i data-lucide="${escapeHTML(s.icon || 'link')}" class="icon"></i>`}
    </a>
  `).join('');

  document.getElementById('contactText').textContent = data.contact.text;

  const resumeBtn = document.getElementById('resume-download-btn');
  const resumeLabel = document.getElementById('resume-btn-label');
  if (data.resume && data.resume.fileData) {
    resumeBtn.href = data.resume.fileData;
    resumeBtn.setAttribute('download', data.resume.fileName || 'resume.pdf');
    resumeBtn.removeAttribute('target');
    resumeLabel.textContent = data.resume.label || 'Download Resume (PDF)';
  } else if (data.resume && data.resume.url) {
    resumeBtn.href = data.resume.url;
    resumeBtn.removeAttribute('download');
    resumeBtn.target = '_blank';
    resumeLabel.textContent = data.resume.label || 'Download Resume (PDF)';
  } else {
    resumeBtn.href = '#';
    resumeBtn.removeAttribute('download');
    resumeBtn.target = '';
    resumeLabel.textContent = 'Resume (coming soon)';
  }

  document.getElementById('footerTagline').textContent = (data.footer && data.footer.tagline) || 'Data \u2022 Analytics \u2022 Insights';
  const lastUpdate = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
  document.getElementById('footerLastUpdate').textContent = lastUpdate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderCurrentRole() {
  const data = DataManager.get();
  const container = document.getElementById('currentRoleContent');
  const icon = document.getElementById('currentRoleIcon');
  const source = (data.hero && data.hero.statusSource) || 'education';

  if (source === 'experience') {
    if (icon) icon.textContent = '💼';
    const current = data.experience ? data.experience.find(e => e.current) : null;
    if (current) {
      container.innerHTML = `
        <div class="current-role-content">
          <div class="role-company">${escapeHTML(current.company)}</div>
          <div class="role-position">${escapeHTML(current.role)}</div>
          <div class="role-meta">
            <span>📍 ${escapeHTML(current.location || '')}</span>
            <span>📅 ${escapeHTML(current.start || '')} — ${escapeHTML(current.end || 'Present')}</span>
          </div>
          <div class="role-desc">${escapeHTML(current.description)}</div>
        </div>
      `;
    } else {
      container.innerHTML = `<div class="no-role-placeholder">No current position set.</div>`;
    }
    return;
  }

  if (icon) icon.textContent = '🎓';
  const current = data.education ? data.education.find(e => e.isHeroStatus) : null;
  if (current) {
    const subtitle = [current.degree, current.field].filter(Boolean).join(' in ');
    container.innerHTML = `
      <div class="current-role-content">
        <div class="role-company">${escapeHTML(current.institution)}</div>
        <div class="role-position">${escapeHTML(subtitle)}</div>
        <div class="role-meta">
          <span>📍 ${escapeHTML(current.location || '')}</span>
          <span>📅 ${escapeHTML(current.start || '')} — ${escapeHTML(current.end || 'Present')}</span>
        </div>
        <div class="role-desc">${escapeHTML(current.description)}</div>
      </div>
    `;
  } else {
    container.innerHTML = `<div class="no-role-placeholder">No current status set.</div>`;
  }
}

function getLatestProject() {
  const data = DataManager.get();
  const projects = data.projects || [];
  if (!projects.length) return null;
  const dated = projects.filter(p => p.date);
  if (dated.length) {
    return [...dated].sort((a, b) => b.date.localeCompare(a.date))[0];
  }
  return projects[projects.length - 1];
}

function renderLatestProject() {
  const container = document.getElementById('latestProjectContent');
  if (!container) return;
  const project = getLatestProject();
  if (!project) {
    container.innerHTML = `<div class="no-project-placeholder">No projects added yet.</div>`;
    return;
  }
  const tech = (project.tags || []).slice(0, 3);
  container.innerHTML = `
    <div class="latest-project-content">
      <div class="latest-project-info">
        <div class="latest-project-title">${escapeHTML(project.title)}</div>
        <div class="latest-project-tech">
          ${tech.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
        </div>
      </div>
      <a href="#projects" class="btn btn-primary btn-sm latest-project-link" onclick="openProjectModalById(${project.id}); return true;">
        <i data-lucide="arrow-up-right" class="icon"></i> View Project
      </a>
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderExperience() {
  const data = DataManager.get();
  const container = document.getElementById('experienceTimeline');
  if (!data.experience || data.experience.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted);">No experience added yet.</p>';
    return;
  }
  container.innerHTML = data.experience.map(exp => `
    <div class="exp-item">
      <div class="exp-dot ${exp.current ? 'current' : ''}"></div>
      <div class="exp-content">
        <div class="exp-company">${escapeHTML(exp.company)}</div>
        <div class="exp-role">${escapeHTML(exp.role)}</div>
        <div class="exp-meta">
          <span>📍 ${escapeHTML(exp.location || '')}</span>
          <span>📅 ${escapeHTML(exp.start || '')} — ${escapeHTML(exp.end || 'Present')}</span>
        </div>
        <div class="exp-desc">${escapeHTML(exp.description)}</div>
      </div>
    </div>
  `).join('');
}

function renderEducation() {
  const data = DataManager.get();
  const container = document.getElementById('educationTimeline');
  if (!container) return;
  const education = data.education || [];
  if (!education.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted);">No education added yet.</p>';
    return;
  }
  container.innerHTML = education.map(edu => `
    <div class="exp-item">
      <div class="exp-dot ${edu.isHeroStatus ? 'current' : ''}"></div>
      <div class="exp-content">
        <div class="exp-company">${escapeHTML(edu.institution)}</div>
        <div class="exp-role">${escapeHTML([edu.degree, edu.field].filter(Boolean).join(' in '))}</div>
        <div class="exp-meta">
          <span>📍 ${escapeHTML(edu.location || '')}</span>
          <span>📅 ${escapeHTML(edu.start || '')} — ${escapeHTML(edu.end || 'Present')}</span>
        </div>
        <div class="exp-desc">${escapeHTML(edu.description)}</div>
      </div>
    </div>
  `).join('');
}

function renderAboutCards() {
  const data = DataManager.get();
  const grid = document.getElementById('aboutGrid');
  grid.innerHTML = data.about.cards.map(card => {
    const skillGroup = data.skills.find(g => g.group.toLowerCase().includes(card.skillGroup?.toLowerCase() || ''));
    const skillNames = skillGroup ? skillGroup.items.map(item => item.name) : [];
    let displaySkills = skillNames.slice(0, 4);
    let extra = skillNames.length > 4 ? skillNames.length - 4 : 0;
    const projectCount = data.projects.filter(p => p.category === card.projectCategory).length;
    return `
      <div class="about-card">
        <div class="card-icon"><i data-lucide="${escapeHTML(card.icon)}" class="icon"></i></div>
        <h3>${escapeHTML(card.title)}</h3>
        <p>${escapeHTML(card.description)}</p>
        <div class="card-stats">
          <div class="skill-names">
            ${displaySkills.map(s => `<span class="skill-tag">${escapeHTML(s)}</span>`).join('')}
            ${extra > 0 ? `<span class="skill-tag">+${extra} more</span>` : ''}
          </div>
          <div class="project-count">
            <i data-lucide="folder-git" class="icon" style="width:16px;height:16px;"></i> Projects: <span class="count">${projectCount}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderSkills() {
  const data = DataManager.get();
  const filterContainer = document.getElementById('skillsFilter');
  const gridContainer = document.getElementById('skillsGridContainer');

  const groups = ['All', ...data.skills.map(g => g.group)];
  filterContainer.innerHTML = groups.map((g, i) => `
    <button class="filter-btn ${i === 0 ? 'active' : ''}" data-skill-group="${escapeHTML(g)}" aria-label="Filter skills by ${escapeHTML(g)}">${escapeHTML(g)}</button>
  `).join('');

  renderSkillCards('All');

  filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderSkillCards(this.dataset.skillGroup);
    });
  });
}

function renderSkillCards(filterGroup) {
  const data = DataManager.get();
  const gridContainer = document.getElementById('skillsGridContainer');
  let skillsToShow = [];
  if (filterGroup === 'All') {
    skillsToShow = data.skills.flatMap(g => g.items.map(item => ({ ...item, group: g.group })));
  } else {
    const group = data.skills.find(g => g.group === filterGroup);
    skillsToShow = group ? group.items.map(item => ({ ...item, group: group.group })) : [];
  }
  if (skillsToShow.length === 0) {
    gridContainer.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);">No skills in this category.</p>';
    return;
  }
  gridContainer.innerHTML = skillsToShow.map(skill => {
    const projectCount = data.projects.filter(p => p.tags && p.tags.some(tag => tag.toLowerCase().includes(skill.name.toLowerCase()) || skill.name.toLowerCase().includes(tag.toLowerCase()))).length;
    let iconHTML;
    if (skill.icon) {
      iconHTML = `<img src="${escapeHTML(skill.icon)}" alt="${escapeHTML(skill.name)}" class="skill-icon-img" />`;
    } else {
      const iconMap = { 'excel':'file-spreadsheet','python':'python','sql':'database','statistical':'bar-chart-2','matplotlib':'chart-scatter','power bi':'bar-chart','tableau':'pie-chart','plotly':'chart-scatter','html':'code','css':'code','javascript':'code','git':'git-branch','jupyter':'book','vs code':'code','google analytics':'trending-up' };
      let icon = 'code-2';
      for (const [key, val] of Object.entries(iconMap)) {
        if (skill.name.toLowerCase().includes(key)) { icon = val; break; }
      }
      iconHTML = `<i data-lucide="${icon}" class="icon" style="width:36px;height:36px;"></i>`;
    }
    const level = ['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(skill.level) ? skill.level : 'Intermediate';
    return `
      <div class="skill-card">
        <div class="skill-icon">${iconHTML}</div>
        <div class="skill-name">${escapeHTML(skill.name)}</div>
        <div class="skill-level skill-level-${level.toLowerCase()}">${level}</div>
        <div class="skill-project-count"><i data-lucide="folder-git" class="icon" style="width:14px;height:14px;"></i> <span class="count">${projectCount}</span> projects</div>
      </div>
    `;
  }).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderCertificates() {
  const data = DataManager.get();
  const container = document.getElementById('certificatesContainer');
  if (!data.certificates || data.certificates.length === 0) {
    container.innerHTML = `<p class="admin-empty" style="grid-column:1/-1;">No certificates added yet.</p>`;
    return;
  }
  container.innerHTML = data.certificates.map(c => `
    <div class="certificate-card">
      <div class="cert-icon"><i data-lucide="award" class="icon"></i></div>
      <h3>${escapeHTML(c.title)}</h3>
      <div class="cert-issuer">${escapeHTML(c.issuer)}</div>
      ${c.date ? `<div class="cert-date">${escapeHTML(c.date)}</div>` : ''}
      <p class="cert-desc">${escapeHTML(c.description)}</p>
      ${c.url ? `<a href="${escapeHTML(c.url)}" target="_blank" rel="noopener" class="cert-link"><i data-lucide="external-link" class="icon" style="width:16px;height:16px;"></i> Verify</a>` : ''}
    </div>
  `).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

const PROJECT_MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function formatProjectDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 2) return '';
  const monthIdx = parseInt(parts[1], 10) - 1;
  if (isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11 || !parts[0]) return '';
  return `${PROJECT_MONTH_NAMES[monthIdx]} ${parts[0]}`;
}

function renderProjects(filter) {
  const data = DataManager.get();
  const container = document.getElementById('projectsContainer');
  let filtered = data.projects;
  if (filter !== 'all') {
    filtered = data.projects.filter(p => p.category === filter);
  }
  filtered = [...filtered].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });
  container.innerHTML = filtered.map(p => `
    <div class="project-card" data-id="${p.id}">
      ${p.image
        ? `<div class="project-thumbnail"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)} thumbnail" loading="lazy" /></div>`
        : `<div class="project-thumbnail placeholder"><i data-lucide="image" class="icon"></i></div>`}
      <div class="project-main">
        <h3>${escapeHTML(p.title)}</h3>
        ${p.date ? `<span class="project-date">${escapeHTML(formatProjectDate(p.date))}</span>` : ''}
        <p class="project-desc">${escapeHTML(p.description)}</p>
      </div>
      <div class="project-side">
        <div class="project-tech">
          <span class="tech-label">Tech Stack</span>
          <div class="project-tags">
            ${(p.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
          </div>
        </div>
        <div class="project-links">
          ${p.github ? `<a href="${escapeHTML(p.github)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm"><i data-lucide="github" class="icon"></i> Code</a>` : ''}
          <a href="#" class="btn btn-primary btn-sm" onclick="openProjectModalById(${p.id}); return false;"><i data-lucide="info" class="icon"></i> Details</a>
        </div>
      </div>
    </div>
  `).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openProjectModalById(id) {
  const data = DataManager.get();
  const project = data.projects.find(p => p.id === id);
  if (project) openProjectModal(project);
}

function openProjectModal(project) {
  const modalImage = document.getElementById('modalImage');
  if (project.image) {
    modalImage.src = project.image;
    modalImage.style.display = 'block';
  } else {
    modalImage.style.display = 'none';
  }
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDescription').textContent = project.description;
  document.getElementById('modalTags').innerHTML = (project.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('');
  const githubLink = document.getElementById('modalGithub');
  const demoLink = document.getElementById('modalDemo');
  githubLink.href = project.github || '#';
  githubLink.style.display = project.github ? 'inline-flex' : 'none';
  demoLink.href = project.demo || '#';
  demoLink.style.display = project.demo ? 'inline-flex' : 'none';
  document.getElementById('projectModal').classList.add('open');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('projectModal').classList.remove('open');
});
document.getElementById('projectModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget || e.target.classList.contains('project-modal-backdrop')) {
    document.getElementById('projectModal').classList.remove('open');
  }
});

function renderTimeline() {
  const data = DataManager.get();
  const container = document.getElementById('timeline-container');
  const reversed = [...data.timeline].reverse();
  container.innerHTML = reversed.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot ${item.current ? 'current' : ''}"></div>
      <div class="timeline-content">
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.description)}</p>
      </div>
    </div>
  `).join('');
}

const PIE_CATEGORY_STYLES = {
  automation: { solid: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
  python:     { solid: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316' }
};
const PIE_FALLBACK_PALETTE = [
  { solid: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
  { solid: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308' },
  { solid: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7' },
  { solid: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', text: '#ec4899' },
  { solid: '#14b8a6', bg: 'rgba(20, 184, 166, 0.15)', text: '#14b8a6' }
];

function renderPieChart() {
  const data = DataManager.get();
  const canvas = document.getElementById('projectPieChart');
  const ctx = canvas.getContext('2d');
  const legend = document.getElementById('pieLegend');
  const centerValue = document.getElementById('pieCenterValue');
  const centerCaption = document.getElementById('pieCenterCaption');

  const counts = {};
  data.projects.forEach(p => {
    const cat = p.category || 'other';
    counts[cat] = (counts[cat] || 0) + 1;
  });
  const total = data.projects.length;
  centerValue.textContent = total;
  centerCaption.textContent = 'Total';
  if (total === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    legend.innerHTML = '<div style="text-align:center;color:var(--text-muted);">No projects</div>';
    return;
  }

  const categories = Object.keys(counts);
  const sliceData = categories.map((cat, i) => {
    const style = PIE_CATEGORY_STYLES[cat.toLowerCase()] || PIE_FALLBACK_PALETTE[i % PIE_FALLBACK_PALETTE.length];
    return { label: cat, count: counts[cat], color: style.solid, bg: style.bg, text: style.text };
  });

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  const holeRadius = radius * 0.62;

  function drawPie(highlightIdx = -1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let startAngle = -Math.PI / 2;
    sliceData.forEach((slice, idx) => {
      const angle = (slice.count / total) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      if (idx === highlightIdx) {
        ctx.shadowColor = 'rgba(255,255,255,0.4)';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.strokeStyle = 'var(--bg-primary)';
      ctx.lineWidth = 2;
      ctx.stroke();
      startAngle = endAngle;
    });
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(centerX, centerY, holeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  drawPie();

  legend.innerHTML = sliceData.map((s, idx) => `
    <div class="legend-pill" data-index="${idx}" style="background:${s.bg}; color:${s.text};">
      <span class="legend-label">${escapeHTML(s.label)}</span>
      <span class="legend-count">${s.count}</span>
    </div>
  `).join('');

  canvas.onmousemove = function(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    let idx = -1;
    if (dist <= radius && dist >= holeRadius) {
      let angle = Math.atan2(dy, dx);
      if (angle < -Math.PI/2) angle += 2 * Math.PI;
      let start = -Math.PI/2;
      for (let i = 0; i < sliceData.length; i++) {
        const a = (sliceData[i].count / total) * 2 * Math.PI;
        const end = start + a;
        if (angle >= start && angle < end) { idx = i; break; }
        start = end;
      }
    }
    drawPie(idx);
    document.querySelectorAll('.pie-legend .legend-pill').forEach((el, i) => {
      el.classList.toggle('highlight', i === idx);
    });
    if (idx >= 0) {
      const slice = sliceData[idx];
      centerValue.textContent = slice.count;
      centerCaption.textContent = slice.label;
    } else {
      centerValue.textContent = total;
      centerCaption.textContent = 'Total';
    }
  };
  canvas.onmouseleave = function() {
    drawPie(-1);
    document.querySelectorAll('.pie-legend .legend-pill').forEach(el => el.classList.remove('highlight'));
    centerValue.textContent = total;
    centerCaption.textContent = 'Total';
  };
}

// ============================================================
// ADMIN RENDER FUNCTIONS
// ============================================================

function renderAdminDashboard() {
  const data = DataManager.get();
  if (!data) return;
  document.getElementById('statProjects').textContent = data.projects.length;
  document.getElementById('statSkills').textContent = data.skills.reduce((sum, g) => sum + g.items.length, 0);
  document.getElementById('statCertificates').textContent = (data.certificates || []).length;
  document.getElementById('statTimeline').textContent = data.timeline.length;

  renderAdminProjects();
  renderAdminAboutCards();
  renderAdminTimeline();
  renderAdminSocial();
  renderAdminStats();
  renderAdminSkills();
  renderAdminHero();
  renderAdminCertificates();
  renderAdminResume();
  renderAdminFooter();
  renderAdminExperience();
  renderAdminEducation();
  populateCategorySelect();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderAdminHero() {
  const data = DataManager.get();
  document.getElementById('heroProfileImage').value = data.hero.profileImage || '';
  document.getElementById('heroFullNameInput').value = data.hero.fullName || '';
  document.getElementById('heroStatusInput').value = data.hero.status || '';
  document.getElementById('heroBioInput').value = data.hero.bio || '';
  document.getElementById('heroStatusSourceInput').value = data.hero.statusSource || 'education';
  document.getElementById('heroProfileImageFile').value = '';
}

function renderAdminExperience() {
  const data = DataManager.get();
  const list = document.getElementById('adminExpList');
  if (!data.experience || !data.experience.length) {
    list.innerHTML = '<div class="admin-empty"><p>No experience entries.</p></div>';
    return;
  }
  list.innerHTML = data.experience.map(exp => `
    <div class="admin-list-item">
      <div class="item-info"><h4>${escapeHTML(exp.company)}</h4><p>${escapeHTML(exp.role)} • ${escapeHTML(exp.start)} — ${escapeHTML(exp.end)}</p></div>
      <div class="item-actions">
        <button class="edit-btn" onclick="editExperience(${exp.id})" aria-label="Edit experience: ${escapeHTML(exp.company)}">Edit</button>
        <button class="delete-btn" onclick="deleteExperience(${exp.id})" aria-label="Delete experience: ${escapeHTML(exp.company)}">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderAdminEducation() {
  const data = DataManager.get();
  const list = document.getElementById('adminEduList');
  const education = data.education || [];
  if (!education.length) {
    list.innerHTML = '<div class="admin-empty"><p>No education entries.</p></div>';
    return;
  }
  list.innerHTML = education.map(edu => `
    <div class="admin-list-item">
      <div class="item-info"><h4>${escapeHTML(edu.institution)}${edu.isHeroStatus ? ' ⭐' : ''}</h4><p>${escapeHTML([edu.degree, edu.field].filter(Boolean).join(' in '))} • ${escapeHTML(edu.start || '')} — ${escapeHTML(edu.end || 'Present')}</p></div>
      <div class="item-actions">
        <button class="edit-btn" onclick="editEducation(${edu.id})" aria-label="Edit education: ${escapeHTML(edu.institution)}">Edit</button>
        <button class="delete-btn" onclick="deleteEducation(${edu.id})" aria-label="Delete education: ${escapeHTML(edu.institution)}">Delete</button>
      </div>
    </div>
  `).join('');
}

function buildAboutCardEditor(card) {
  card = card || {};
  const div = document.createElement('div');
  div.className = 'about-card-editor';
  div.innerHTML = `
    <div class="form-row">
      <div class="form-group"><label>Icon</label><input type="text" data-field="icon" value="${escapeHTML(card.icon || 'bar-chart-2')}" /></div>
      <div class="form-group"><label>Title</label><input type="text" data-field="title" value="${escapeHTML(card.title || '')}" placeholder="Card title" /></div>
    </div>
    <div class="form-group"><label>Description</label><input type="text" data-field="description" value="${escapeHTML(card.description || '')}" placeholder="Description" /></div>
    <div class="form-row">
      <div class="form-group"><label>Skill Group</label><input type="text" data-field="skillGroup" value="${escapeHTML(card.skillGroup || '')}" placeholder="Data & Analytics" /></div>
      <div class="form-group"><label>Project Category</label><input type="text" data-field="projectCategory" value="${escapeHTML(card.projectCategory || '')}" placeholder="data" /></div>
    </div>
    <button type="button" class="btn btn-sm btn-danger about-card-remove" aria-label="Remove about card">Remove Card</button>
  `;
  div.querySelector('.about-card-remove').addEventListener('click', () => div.remove());
  return div;
}

function renderAdminAboutCards() {
  const data = DataManager.get();
  const container = document.getElementById('adminAboutCards');
  container.innerHTML = '';
  data.about.cards.forEach(card => container.appendChild(buildAboutCardEditor(card)));
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn btn-sm btn-outline';
  addBtn.textContent = '+ Add Card';
  addBtn.addEventListener('click', () => {
    container.insertBefore(buildAboutCardEditor({ icon: 'bar-chart-2' }), addBtn);
  });
  container.appendChild(addBtn);
}

function buildSkillItemRow(item) {
  item = item || {};
  const row = document.createElement('div');
  row.className = 'form-row skill-item-row';
  row.innerHTML = `
    <div class="form-group"><label>Skill Name</label><input type="text" data-field="skill-name" value="${escapeHTML(item.name || '')}" placeholder="Skill" /></div>
    <div class="form-group">
      <label>Proficiency</label>
      <select data-field="skill-level">
        <option value="Beginner"${item.level === 'Beginner' ? ' selected' : ''}>Beginner</option>
        <option value="Intermediate"${!item.level || item.level === 'Intermediate' ? ' selected' : ''}>Intermediate</option>
        <option value="Advanced"${item.level === 'Advanced' ? ' selected' : ''}>Advanced</option>
        <option value="Expert"${item.level === 'Expert' ? ' selected' : ''}>Expert</option>
      </select>
    </div>
    <div class="form-group">
      <label>Icon (PNG)</label>
      <input type="file" accept="image/png" class="skill-icon-file" />
      <input type="hidden" data-field="skill-icon" value="${escapeHTML(item.icon || '')}" />
      <p class="upload-hint">Recommended: 128×128px (1:1 square)</p>
      <div class="skill-icon-preview">${item.icon ? `<img src="${escapeHTML(item.icon)}" alt="" /><button type="button" class="skill-icon-remove" aria-label="Remove skill icon">✕</button>` : ''}</div>
    </div>
    <button type="button" class="btn btn-sm btn-danger skill-remove-item" aria-label="Remove skill">✕</button>
  `;
  row.querySelector('.skill-remove-item').addEventListener('click', () => row.remove());

  const iconHidden = row.querySelector('[data-field="skill-icon"]');
  const preview = row.querySelector('.skill-icon-preview');
  function setPreview(dataUrl) {
    iconHidden.value = dataUrl || '';
    preview.innerHTML = dataUrl ? `<img src="${escapeHTML(dataUrl)}" alt="" /><button type="button" class="skill-icon-remove" aria-label="Remove skill icon">✕</button>` : '';
    if (dataUrl) preview.querySelector('.skill-icon-remove').addEventListener('click', () => setPreview(''));
  }
  if (item.icon) preview.querySelector('.skill-icon-remove').addEventListener('click', () => setPreview(''));

  row.querySelector('.skill-icon-file').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'image/png') {
      showNotice('Please choose a PNG file.', 'error');
      this.value = '';
      return;
    }
    const MAX_BYTES = 300 * 1024;
    if (file.size > MAX_BYTES) {
      showNotice('Icon is too large (max 300KB). Please use a smaller PNG.', 'error');
      this.value = '';
      return;
    }
    try {
      const compressed = await compressImage(file, { maxWidth: 256, maxHeight: 256, outputType: 'image/png' });
      setPreview(compressed);
    } catch (err) {
      showNotice('Could not read that image file. Please try another.', 'error');
    }
    this.value = '';
  });

  return row;
}

function buildSkillGroupEditor(group) {
  group = group || {};
  const div = document.createElement('div');
  div.className = 'skill-group-editor';
  div.innerHTML = `
    <div class="form-group"><label>Group Name</label><input type="text" data-field="group-name" value="${escapeHTML(group.group || '')}" placeholder="New Group" /></div>
    <div class="skill-items-list"></div>
    <button type="button" class="btn btn-sm btn-outline skill-add-item">+ Add Skill</button>
    <button type="button" class="btn btn-sm btn-danger skill-remove-group" style="margin-left:8px;">Remove Group</button>
  `;
  const itemsList = div.querySelector('.skill-items-list');
  const items = (group.items && group.items.length) ? group.items : [{ name: '' }];
  items.forEach(item => itemsList.appendChild(buildSkillItemRow(item)));
  div.querySelector('.skill-add-item').addEventListener('click', () => {
    itemsList.appendChild(buildSkillItemRow({}));
  });
  div.querySelector('.skill-remove-group').addEventListener('click', () => div.remove());
  return div;
}

function renderAdminSkills() {
  const data = DataManager.get();
  const container = document.getElementById('skillsAdminContainer');
  container.innerHTML = '';
  data.skills.forEach(group => container.appendChild(buildSkillGroupEditor(group)));
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn btn-sm btn-outline';
  addBtn.textContent = '+ Add Skill Group';
  addBtn.addEventListener('click', () => {
    container.insertBefore(buildSkillGroupEditor({}), addBtn);
  });
  container.appendChild(addBtn);
}

function buildStatRow(stat) {
  stat = stat || {};
  const row = document.createElement('div');
  row.className = 'admin-list-item stat-row';
  row.innerHTML = `
    <div class="item-info form-row" style="flex:1;">
      <div class="form-group"><label>Label</label><input type="text" data-field="stat-label" value="${escapeHTML(stat.label || '')}" placeholder="e.g. Projects Built" /></div>
      <div class="form-group"><label>Value</label><input type="text" data-field="stat-value" value="${escapeHTML(stat.value || '')}" placeholder="e.g. 6+" /></div>
    </div>
    <div class="item-actions"><button type="button" class="delete-btn stat-remove" aria-label="Delete stat: ${escapeHTML(stat.label || 'unnamed')}">Delete</button></div>
  `;
  row.querySelector('.stat-remove').addEventListener('click', () => row.remove());
  return row;
}

function renderAdminStats() {
  const data = DataManager.get();
  const container = document.getElementById('statsAdminContainer');
  container.innerHTML = '';
  if (!data.stats.length) {
    container.innerHTML = '<div class="admin-empty"><p>No stats yet — click Add to create one.</p></div>';
  } else {
    data.stats.forEach(s => container.appendChild(buildStatRow(s)));
  }
}

function renderAdminSocial() {
  const data = DataManager.get();
  const list = document.getElementById('adminSocialList');
  if (!data.social || !data.social.length) {
    list.innerHTML = '<div class="admin-empty"><p>No social links.</p></div>';
    return;
  }
  list.innerHTML = data.social.map(s => `
    <div class="admin-list-item">
      ${s.logo ? `<img class="admin-list-thumb" src="${escapeHTML(s.logo)}" alt="" />` : ''}
      <div class="item-info"><h4>${escapeHTML(s.label)}</h4><p>${escapeHTML(s.url)}</p></div>
      <div class="item-actions">
        <button class="edit-btn" onclick="editSocial(${s.id})" aria-label="Edit social link: ${escapeHTML(s.label)}">Edit</button>
        <button class="delete-btn" onclick="deleteSocial(${s.id})" aria-label="Delete social link: ${escapeHTML(s.label)}">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderAdminCertificates() {
  const data = DataManager.get();
  const list = document.getElementById('adminCertList');
  if (!data.certificates || !data.certificates.length) {
    list.innerHTML = '<div class="admin-empty"><p>No certificates added.</p></div>';
    return;
  }
  list.innerHTML = data.certificates.map(c => `
    <div class="admin-list-item">
      <div class="item-info"><h4>${escapeHTML(c.title)}</h4><p>${escapeHTML(c.issuer)} ${c.date ? '• '+escapeHTML(c.date) : ''}</p></div>
      <div class="item-actions">
        <button class="edit-btn" onclick="editCertificate(${c.id})" aria-label="Edit certificate: ${escapeHTML(c.title)}">Edit</button>
        <button class="delete-btn" onclick="deleteCertificate(${c.id})" aria-label="Delete certificate: ${escapeHTML(c.title)}">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderAdminProjects() {
  const data = DataManager.get();
  const list = document.getElementById('adminProjectList');
  if (!data.projects.length) {
    list.innerHTML = '<div class="admin-empty"><p>No projects yet.</p></div>';
    return;
  }
  list.innerHTML = data.projects.map(p => `
    <div class="admin-list-item">
      ${p.image ? `<img class="admin-list-thumb" src="${escapeHTML(p.image)}" alt="" />` : ''}
      <div class="item-info"><h4>${escapeHTML(p.title)}</h4><p>${escapeHTML((p.tags || []).join(', '))} • ${escapeHTML(p.category || 'uncategorized')}</p></div>
      <div class="item-actions">
        <button class="edit-btn" onclick="editProject(${p.id})" aria-label="Edit project: ${escapeHTML(p.title)}">Edit</button>
        <button class="delete-btn" onclick="deleteProject(${p.id})" aria-label="Delete project: ${escapeHTML(p.title)}">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderAdminTimeline() {
  const data = DataManager.get();
  const list = document.getElementById('adminTimelineList');
  if (!data.timeline.length) {
    list.innerHTML = '<div class="admin-empty"><p>No timeline items.</p></div>';
    return;
  }
  list.innerHTML = data.timeline.map((item) => `
    <div class="admin-list-item">
      <div class="item-info"><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.description)} ${item.current ? '⭐' : ''}</p></div>
      <div class="item-actions">
        <button class="edit-btn" onclick="editTimeline(${item.id})" aria-label="Edit timeline item: ${escapeHTML(item.title)}">Edit</button>
        <button class="delete-btn" onclick="deleteTimeline(${item.id})" aria-label="Delete timeline item: ${escapeHTML(item.title)}">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderAdminFooter() {
  const data = DataManager.get();
  document.getElementById('footerTaglineInput').value = (data.footer && data.footer.tagline) || '';
}

function renderAdminResume() {
  const data = DataManager.get();
  document.getElementById('resumeUrl').value = data.resume.url || '';
  document.getElementById('resumeLabel').value = data.resume.label || '';
  document.getElementById('resumeFileData').value = data.resume.fileData || '';
  document.getElementById('resumeFileName').value = data.resume.fileName || '';
  document.getElementById('resumeFileInput').value = '';
  renderResumeFileStatus();
}

function renderResumeFileStatus() {
  const statusEl = document.getElementById('resumeFileStatus');
  const fileData = document.getElementById('resumeFileData').value;
  const fileName = document.getElementById('resumeFileName').value;
  if (fileData) {
    statusEl.className = 'resume-file-status has-file';
    statusEl.innerHTML = `<i data-lucide="check-circle" class="icon" style="width:14px;height:14px;vertical-align:-2px;"></i> Uploaded: ${escapeHTML(fileName || 'resume.pdf')} <button type="button" class="resume-remove-file" aria-label="Remove uploaded resume file">Remove</button>`;
    statusEl.querySelector('.resume-remove-file').addEventListener('click', () => {
      document.getElementById('resumeFileData').value = '';
      document.getElementById('resumeFileName').value = '';
      renderResumeFileStatus();
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  } else {
    statusEl.className = 'resume-file-status';
    statusEl.textContent = 'No PDF uploaded yet — upload one, or use the URL field below.';
  }
}

// ============================================================
// ADMIN ACTIONS (CRUD with Undo) - Fixed with Promises
// ============================================================

window.deleteProject = function(id) {
  const data = DataManager.get();
  const project = data.projects.find(p => p.id === id);
  if (!project) return;
  if (!confirm(`Delete "${project.title}"?`)) return;
  const undoItem = { type: 'project', data: project };
  DataManager.deleteProject(id).then(ok => {
    renderAdminDashboard();
    renderAll();
    if (!ok) { showNotice(`Failed to delete: ${DataManager._lastError || 'unknown error'}`, 'error'); return; }
    showUndoToast(`"${project.title}" deleted`, () => {
      DataManager.addProject(undoItem.data).then(() => {
        renderAdminDashboard();
        renderAll();
      });
    });
  });
};

window.deleteTimeline = function(id) {
  const data = DataManager.get();
  const item = data.timeline.find(t => t.id === id);
  if (!item) return;
  if (!confirm(`Delete "${item.title}"?`)) return;
  const undoItem = { type: 'timeline', data: item };
  DataManager.deleteTimeline(id).then(ok => {
    renderAdminDashboard();
    renderAll();
    if (!ok) { showNotice(`Failed to delete: ${DataManager._lastError || 'unknown error'}`, 'error'); return; }
    showUndoToast(`"${item.title}" removed`, () => {
      DataManager.addTimeline(undoItem.data).then(() => {
        renderAdminDashboard();
        renderAll();
      });
    });
  });
};

window.deleteSocial = function(id) {
  const data = DataManager.get();
  const social = data.social.find(s => s.id === id);
  if (!social) return;
  if (!confirm(`Delete "${social.label}" link?`)) return;
  const undoItem = { type: 'social', data: social };
  DataManager.deleteSocial(id).then(ok => {
    renderAdminDashboard();
    renderAll();
    if (!ok) { showNotice(`Failed to delete: ${DataManager._lastError || 'unknown error'}`, 'error'); return; }
    showUndoToast(`"${social.label}" link deleted`, () => {
      DataManager.addSocial(undoItem.data).then(() => {
        renderAdminDashboard();
        renderAll();
      });
    });
  });
};

window.deleteCertificate = function(id) {
  const data = DataManager.get();
  const cert = data.certificates.find(c => c.id === id);
  if (!cert) return;
  if (!confirm(`Delete certificate "${cert.title}"?`)) return;
  const undoItem = { type: 'certificate', data: cert };
  DataManager.deleteCertificate(id).then(ok => {
    renderAdminDashboard();
    renderAll();
    if (!ok) { showNotice(`Failed to delete: ${DataManager._lastError || 'unknown error'}`, 'error'); return; }
    showUndoToast(`"${cert.title}" deleted`, () => {
      DataManager.addCertificate(undoItem.data).then(() => {
        renderAdminDashboard();
        renderAll();
      });
    });
  });
};

window.deleteExperience = function(id) {
  const data = DataManager.get();
  const exp = data.experience.find(e => e.id === id);
  if (!exp) return;
  if (!confirm(`Delete experience at "${exp.company}"?`)) return;
  const undoItem = { type: 'experience', data: exp };
  DataManager.deleteExperience(id).then(ok => {
    renderAdminDashboard();
    renderAll();
    if (!ok) { showNotice(`Failed to delete: ${DataManager._lastError || 'unknown error'}`, 'error'); return; }
    showUndoToast(`"${exp.company}" removed`, () => {
      DataManager.addExperience(undoItem.data).then(() => {
        renderAdminDashboard();
        renderAll();
      });
    });
  });
};

window.deleteEducation = function(id) {
  const data = DataManager.get();
  const edu = data.education.find(e => e.id === id);
  if (!edu) return;
  if (!confirm(`Delete education entry at "${edu.institution}"?`)) return;
  const undoItem = { type: 'education', data: edu };
  DataManager.deleteEducation(id).then(ok => {
    renderAdminDashboard();
    renderAll();
    if (!ok) { showNotice(`Failed to delete: ${DataManager._lastError || 'unknown error'}`, 'error'); return; }
    showUndoToast(`"${edu.institution}" removed`, () => {
      DataManager.addEducation(undoItem.data).then(() => {
        renderAdminDashboard();
        renderAll();
      });
    });
  });
};

window.editProject = function(id) {
  const data = DataManager.get();
  const p = data.projects.find(x => x.id === id);
  if (!p) return;
  document.getElementById('projectEditId').value = id;
  document.getElementById('projectTitle').value = p.title;
  document.getElementById('projectDesc').value = p.description;
  document.getElementById('projectCategory').value = p.category || '';
  document.getElementById('projectGithub').value = p.github || '';
  document.getElementById('projectDemo').value = p.demo || '';
  document.getElementById('projectDate').value = p.date || '';
  document.getElementById('adminProjectFormTitle').textContent = 'Edit Project';
  document.getElementById('adminProjectFormPanel').style.display = 'block';
  populateCategorySelect();
  populateProjectTagSelect();
  renderProjectTagChips(p.tags || []);
  setProjectThumbnailPreview(p.image || '');
  document.getElementById('adminProjectFormPanel').scrollIntoView({ behavior: 'smooth' });
};

window.editTimeline = function(id) {
  const data = DataManager.get();
  const item = data.timeline.find(t => t.id === id);
  if (!item) return;
  document.getElementById('timelineEditId').value = id;
  document.getElementById('timelineTitle').value = item.title;
  document.getElementById('timelineDesc').value = item.description;
  document.getElementById('timelineCurrent').checked = item.current || false;
  document.getElementById('adminTimelineFormTitle').textContent = 'Edit Timeline';
  document.getElementById('adminTimelineFormPanel').style.display = 'block';
  document.getElementById('adminTimelineFormPanel').scrollIntoView({ behavior: 'smooth' });
};

window.editSocial = function(id) {
  const data = DataManager.get();
  const s = data.social.find(x => x.id === id);
  if (!s) return;
  document.getElementById('socialEditId').value = id;
  document.getElementById('socialPlatform').value = s.platform || 'other';
  document.getElementById('socialLabel').value = s.label || '';
  document.getElementById('socialUrl').value = s.url || '';
  document.getElementById('adminSocialFormTitle').textContent = 'Edit Social Link';
  document.getElementById('adminSocialFormPanel').style.display = 'block';
  document.getElementById('socialLogoFile').value = '';
  setSocialLogoPreview(s.logo || '');
  document.getElementById('adminSocialFormPanel').scrollIntoView({ behavior: 'smooth' });
};

window.editCertificate = function(id) {
  const data = DataManager.get();
  const c = data.certificates.find(x => x.id === id);
  if (!c) return;
  document.getElementById('certEditId').value = id;
  document.getElementById('certTitle').value = c.title;
  document.getElementById('certIssuer').value = c.issuer;
  document.getElementById('certDate').value = c.date || '';
  document.getElementById('certDesc').value = c.description;
  document.getElementById('certUrl').value = c.url || '';
  document.getElementById('adminCertFormTitle').textContent = 'Edit Certificate';
  document.getElementById('adminCertFormPanel').style.display = 'block';
  document.getElementById('adminCertFormPanel').scrollIntoView({ behavior: 'smooth' });
};

window.editExperience = function(id) {
  const data = DataManager.get();
  const exp = data.experience.find(x => x.id === id);
  if (!exp) return;
  document.getElementById('expEditId').value = id;
  document.getElementById('expCompany').value = exp.company;
  document.getElementById('expRole').value = exp.role;
  document.getElementById('expLocation').value = exp.location || '';
  document.getElementById('expStart').value = exp.start || '';
  document.getElementById('expEnd').value = exp.end || '';
  document.getElementById('expDesc').value = exp.description;
  document.getElementById('expCurrent').checked = exp.current || false;
  document.getElementById('adminExpFormTitle').textContent = 'Edit Experience';
  document.getElementById('adminExpFormPanel').style.display = 'block';
  document.getElementById('adminExpFormPanel').scrollIntoView({ behavior: 'smooth' });
};

window.editEducation = function(id) {
  const data = DataManager.get();
  const edu = data.education.find(x => x.id === id);
  if (!edu) return;
  document.getElementById('eduEditId').value = id;
  document.getElementById('eduInstitution').value = edu.institution;
  document.getElementById('eduDegree').value = edu.degree;
  document.getElementById('eduField').value = edu.field || '';
  document.getElementById('eduLocation').value = edu.location || '';
  document.getElementById('eduStart').value = edu.start || '';
  document.getElementById('eduEnd').value = edu.end || '';
  document.getElementById('eduDesc').value = edu.description;
  document.getElementById('eduHeroStatus').checked = edu.isHeroStatus || false;
  document.getElementById('adminEduFormTitle').textContent = 'Edit Education';
  document.getElementById('adminEduFormPanel').style.display = 'block';
  document.getElementById('adminEduFormPanel').scrollIntoView({ behavior: 'smooth' });
};

window.switchAdminSection = function(section) {
  document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.admin-nav .nav-item').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(`adminSection${section.charAt(0).toUpperCase()+section.slice(1)}`);
  if (target) target.classList.add('active');
  const navBtn = document.querySelector(`.admin-nav .nav-item[data-section="${section}"]`);
  if (navBtn) navBtn.classList.add('active');
  const titles = { dashboard: 'Dashboard', hero: 'Hero', experience: 'Experience', education: 'Education', about: 'About', skills: 'Skills', certificates: 'Certificates', projects: 'Projects', timeline: 'Timeline', stats: 'Stats', social: 'Social Links', contact: 'Contact', resume: 'Resume', footer: 'Footer', settings: 'Settings' };
  document.getElementById('adminPageTitle').textContent = titles[section] || 'Dashboard';
  ['adminProjectFormPanel','adminTimelineFormPanel','adminSocialFormPanel','adminCertFormPanel','adminExpFormPanel','adminEduFormPanel'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById('inlineAddCategoryRow').style.display = 'none';
  if (section === 'projects') { renderAdminProjects(); populateCategorySelect(); }
  if (section === 'about') renderAdminAboutCards();
  if (section === 'timeline') renderAdminTimeline();
  if (section === 'social') renderAdminSocial();
  if (section === 'stats') renderAdminStats();
  if (section === 'skills') renderAdminSkills();
  if (section === 'hero') renderAdminHero();
  if (section === 'certificates') renderAdminCertificates();
  if (section === 'resume') renderAdminResume();
  if (section === 'footer') renderAdminFooter();
  if (section === 'experience') renderAdminExperience();
  if (section === 'education') renderAdminEducation();
  if (section === 'dashboard') renderAdminDashboard();
  if (typeof lucide !== 'undefined') lucide.createIcons();
};

function populateProjectTagSelect() {
  const data = DataManager.get();
  const select = document.getElementById('projectTagSelect');
  const skillNames = [...new Set(data.skills.flatMap(g => g.items.map(i => i.name)).filter(Boolean))];
  const current = select.value;
  select.innerHTML = '<option value="">Select a skill...</option>' + skillNames.map(n => `<option value="${escapeHTML(n)}">${escapeHTML(n)}</option>`).join('');
  select.value = current;
}

function renderProjectTagChips(tags) {
  const list = document.getElementById('projectTagsList');
  const hidden = document.getElementById('projectTags');
  hidden.value = tags.join(', ');
  if (!tags.length) {
    list.innerHTML = '<span class="tag-chips-empty">No tags added yet.</span>';
    return;
  }
  list.innerHTML = tags.map(t => `
    <span class="tag-chip">${escapeHTML(t)}<button type="button" class="tag-chip-remove" data-tag="${escapeHTML(t)}" aria-label="Remove tag: ${escapeHTML(t)}">✕</button></span>
  `).join('');
  list.querySelectorAll('.tag-chip-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const remaining = tags.filter(t => t !== btn.dataset.tag);
      renderProjectTagChips(remaining);
    });
  });
}

function setProjectThumbnailPreview(dataUrl) {
  const hidden = document.getElementById('projectThumbnail');
  const preview = document.getElementById('projectThumbnailPreview');
  hidden.value = dataUrl || '';
  preview.innerHTML = dataUrl
    ? `<img src="${escapeHTML(dataUrl)}" alt="" /><button type="button" class="thumbnail-remove" id="projectThumbnailRemove">Remove image</button>`
    : '';
  if (dataUrl) {
    document.getElementById('projectThumbnailRemove').addEventListener('click', () => setProjectThumbnailPreview(''));
  }
}

function setSocialLogoPreview(dataUrl) {
  const hidden = document.getElementById('socialLogo');
  const preview = document.getElementById('socialLogoPreview');
  hidden.value = dataUrl || '';
  preview.innerHTML = dataUrl
    ? `<img src="${escapeHTML(dataUrl)}" alt="" /><button type="button" class="thumbnail-remove" id="socialLogoRemove">Remove logo</button>`
    : '';
  if (dataUrl) {
    document.getElementById('socialLogoRemove').addEventListener('click', () => setSocialLogoPreview(''));
  }
}

function populateCategorySelect() {
  const data = DataManager.get();
  const select = document.getElementById('projectCategory');
  const currentVal = select.value;
  select.innerHTML = '<option value="">Select category</option>';
  (data.categories || []).forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  select.value = currentVal;
}

// ============================================================
// AUTH
// ============================================================

let adminLoggedIn = false;

function loginAdmin(password) {
  const storedHash = localStorage.getItem('rashed_portfolio_hash');
  if (!storedHash) {
    localStorage.setItem('rashed_portfolio_hash', hashPassword(password));
    return true;
  }
  return hashPassword(password) === storedHash;
}

function logoutAdmin() {
  adminLoggedIn = false;
  document.getElementById('adminDashboard').classList.remove('open');
  document.getElementById('adminLoginOverlay').classList.remove('open');
  document.getElementById('adminLoginError').textContent = '';
  document.getElementById('adminPassword').value = '';
}

// ============================================================
// EVENT BINDINGS
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

  // Theme
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });

  // Mobile
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  mobileBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open');
    mobileBtn.innerHTML = open ? '<i data-lucide="menu" class="icon"></i>' : '<i data-lucide="x" class="icon"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileBtn.innerHTML = '<i data-lucide="menu" class="icon"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });

  // Admin access
  function openAdminAccess() {
    if (localStorage.getItem('rashed_portfolio_hash') && adminLoggedIn) {
      document.getElementById('adminDashboard').classList.add('open');
      renderAdminDashboard();
      return;
    }
    document.getElementById('adminLoginOverlay').classList.add('open');
    document.getElementById('adminPassword').focus();
  }
  function checkAdminHash() {
    if (window.location.hash.toLowerCase() === '#admin') {
      openAdminAccess();
    }
  }
  window.addEventListener('hashchange', checkAdminHash);
  checkAdminHash();

  document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('adminPassword').value;
    const err = document.getElementById('adminLoginError');
    if (!pw) { err.textContent = 'Please enter a password.'; return; }
    if (loginAdmin(pw)) {
      adminLoggedIn = true;
      document.getElementById('adminLoginOverlay').classList.remove('open');
      document.getElementById('adminDashboard').classList.add('open');
      err.textContent = '';
      document.getElementById('adminPassword').value = '';
      renderAdminDashboard();
      renderAll();
      switchAdminSection('dashboard');
    } else {
      err.textContent = 'Incorrect password. Try again.';
      document.getElementById('adminPassword').value = '';
      document.getElementById('adminPassword').focus();
    }
  });

  document.getElementById('adminLoginCloseBtn').addEventListener('click', () => {
    document.getElementById('adminLoginOverlay').classList.remove('open');
    document.getElementById('adminLoginError').textContent = '';
    document.getElementById('adminPassword').value = '';
    if (window.location.hash.toLowerCase() === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });

  document.getElementById('adminPasswordToggle').addEventListener('click', function() {
    const input = document.getElementById('adminPassword');
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    this.innerHTML = showing ? '<i data-lucide="eye" class="icon"></i>' : '<i data-lucide="eye-off" class="icon"></i>';
    this.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    input.focus();
  });

  document.getElementById('adminCloseBtn').addEventListener('click', () => {
    document.getElementById('adminDashboard').classList.remove('open');
  });
  document.getElementById('adminLogoutBtn').addEventListener('click', logoutAdmin);

  document.querySelectorAll('.admin-nav .nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchAdminSection(btn.dataset.section));
  });

  // ---- Profile Image Upload ----
  document.getElementById('heroProfileImageFile').addEventListener('change', async function(e) {
    const file = this.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotice('Please choose an image file.', 'error');
      this.value = '';
      return;
    }
    const MAX_BYTES = 1.5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      showNotice('Image is too large (max 1.5MB). Please choose a smaller file or compress it first.', 'error');
      this.value = '';
      return;
    }
    try {
      const compressed = await compressImage(file, { maxWidth: 600, maxHeight: 600 });
      document.getElementById('heroProfileImage').value = compressed;
    } catch (err) {
      showNotice('Could not read that image file. Please try another.', 'error');
    }
  });

  // ---- Project Thumbnail Upload ----
  document.getElementById('projectThumbnailFile').addEventListener('change', async function(e) {
    const file = this.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotice('Please choose an image file.', 'error');
      this.value = '';
      return;
    }
    const MAX_BYTES = 1.5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      showNotice('Image is too large (max 1.5MB). Please choose a smaller file or compress it first.', 'error');
      this.value = '';
      return;
    }
    try {
      const compressed = await compressImage(file, { maxWidth: 1000, maxHeight: 1000 });
      setProjectThumbnailPreview(compressed);
    } catch (err) {
      showNotice('Could not read that image file. Please try another.', 'error');
    }
    this.value = '';
  });

  // ---- ADMIN FORMS - All Fixed with Promises ----

  // Hero
  document.getElementById('adminHeroForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (guardDoubleSubmit(e.target)) return;
    const data = DataManager.get();
    const imgVal = document.getElementById('heroProfileImage').value.trim();
    if (imgVal) data.hero.profileImage = imgVal;
    data.hero.fullName = document.getElementById('heroFullNameInput').value.trim();
    data.hero.status = document.getElementById('heroStatusInput').value.trim();
    data.hero.bio = document.getElementById('heroBioInput').value.trim();
    data.hero.statusSource = document.getElementById('heroStatusSourceInput').value;
    DataManager.set(data).then((ok) => {
      if (ok) {
        renderAdminDashboard();
        renderAll();
      }
      notifySaveResult(ok, 'Hero section');
    }).catch(err => {
      notifySaveResult(false, 'Hero section');
    });
  });

  // Experience
  document.getElementById('adminAddExpBtn').addEventListener('click', () => {
    document.getElementById('expEditId').value = '';
    document.getElementById('expCompany').value = '';
    document.getElementById('expRole').value = '';
    document.getElementById('expLocation').value = '';
    document.getElementById('expStart').value = '';
    document.getElementById('expEnd').value = '';
    document.getElementById('expDesc').value = '';
    document.getElementById('expCurrent').checked = false;
    document.getElementById('adminExpFormTitle').textContent = 'Add Experience';
    document.getElementById('adminExpFormPanel').style.display = 'block';
    document.getElementById('adminExpFormPanel').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('adminExpFormCancel').addEventListener('click', () => {
    document.getElementById('adminExpFormPanel').style.display = 'none';
  });
  document.getElementById('adminExpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (guardDoubleSubmit(e.target)) return;
    const idRaw = document.getElementById('expEditId').value;
    const id = idRaw ? parseInt(idRaw) : null;
    const company = document.getElementById('expCompany').value.trim();
    const role = document.getElementById('expRole').value.trim();
    const location = document.getElementById('expLocation').value.trim();
    const start = document.getElementById('expStart').value.trim();
    const end = document.getElementById('expEnd').value.trim();
    const description = document.getElementById('expDesc').value.trim();
    const current = document.getElementById('expCurrent').checked;
    if (!company || !role || !description) { showNotice('Company, role, and description are required.', 'error'); return; }
    const promise = id ? DataManager.updateExperience(id, { company, role, location, start, end, description, current })
                       : DataManager.addExperience({ company, role, location, start, end, description, current });
    promise.then((result) => {
      if (result) {
        document.getElementById('adminExpFormPanel').style.display = 'none';
        renderAdminDashboard();
        renderAll();
      }
      notifySaveResult(!!result, 'Experience entry');
    }).catch(() => {
      notifySaveResult(false, 'Experience entry');
    });
  });

  // Education
  document.getElementById('adminAddEduBtn').addEventListener('click', () => {
    document.getElementById('eduEditId').value = '';
    document.getElementById('eduInstitution').value = '';
    document.getElementById('eduDegree').value = '';
    document.getElementById('eduField').value = '';
    document.getElementById('eduLocation').value = '';
    document.getElementById('eduStart').value = '';
    document.getElementById('eduEnd').value = '';
    document.getElementById('eduDesc').value = '';
    document.getElementById('eduHeroStatus').checked = false;
    document.getElementById('adminEduFormTitle').textContent = 'Add Education';
    document.getElementById('adminEduFormPanel').style.display = 'block';
    document.getElementById('adminEduFormPanel').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('adminEduFormCancel').addEventListener('click', () => {
    document.getElementById('adminEduFormPanel').style.display = 'none';
  });
  document.getElementById('adminEduForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (guardDoubleSubmit(e.target)) return;
    const idRaw = document.getElementById('eduEditId').value;
    const id = idRaw ? parseInt(idRaw) : null;
    const institution = document.getElementById('eduInstitution').value.trim();
    const degree = document.getElementById('eduDegree').value.trim();
    const field = document.getElementById('eduField').value.trim();
    const location = document.getElementById('eduLocation').value.trim();
    const start = document.getElementById('eduStart').value.trim();
    const end = document.getElementById('eduEnd').value.trim();
    const description = document.getElementById('eduDesc').value.trim();
    const isHeroStatus = document.getElementById('eduHeroStatus').checked;
    if (!institution || !degree || !description) { showNotice('Institution, degree, and description are required.', 'error'); return; }
    if (isHeroStatus) {
      const data = DataManager.get();
      (data.education || []).forEach(edu => { edu.isHeroStatus = false; });
    }
    const promise = id ? DataManager.updateEducation(id, { institution, degree, field, location, start, end, description, isHeroStatus })
                       : DataManager.addEducation({ institution, degree, field, location, start, end, description, isHeroStatus });
    promise.then((result) => {
      if (result) {
        document.getElementById('adminEduFormPanel').style.display = 'none';
        renderAdminDashboard();
        renderAll();
      }
      notifySaveResult(!!result, 'Education entry');
    }).catch(() => {
      notifySaveResult(false, 'Education entry');
    });
  });

  // About Text
  document.getElementById('adminAboutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    DataManager.update('about.text', document.getElementById('aboutTextarea').value)
      .then((ok) => {
        if (ok) {
          renderAdminDashboard();
          renderAll();
        }
        notifySaveResult(ok, 'About text');
      }).catch(() => {
        notifySaveResult(false, 'About text');
      });
  });

  // About Cards
  document.getElementById('saveAboutCardsBtn').addEventListener('click', function() {
    const data = DataManager.get();
    const container = document.getElementById('adminAboutCards');
    const editors = container.querySelectorAll('.about-card-editor');
    const newCards = [];
    let skipped = 0;
    editors.forEach(editor => {
      const icon = editor.querySelector('[data-field="icon"]').value.trim() || 'bar-chart-2';
      const title = editor.querySelector('[data-field="title"]').value.trim();
      const description = editor.querySelector('[data-field="description"]').value.trim();
      const skillGroup = editor.querySelector('[data-field="skillGroup"]').value.trim();
      const projectCategory = editor.querySelector('[data-field="projectCategory"]').value.trim();
      if (title && description) {
        newCards.push({ icon, title, description, skillGroup, projectCategory });
      } else if (title || description) {
        skipped++;
      }
    });
    data.about.cards = newCards;
    DataManager.set(data).then((ok) => {
      if (ok) {
        renderAdminDashboard();
        renderAll();
        if (skipped > 0) {
          showNotice(`Saved, but ${skipped} card(s) were skipped — a card needs both a title and a description.`, 'error');
        } else {
          notifySaveResult(true, 'About cards');
        }
      } else {
        notifySaveResult(false, 'About cards');
      }
    }).catch(() => {
      notifySaveResult(false, 'About cards');
    });
  });

  // Skills
  document.getElementById('adminSkillsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = DataManager.get();
    const container = document.getElementById('skillsAdminContainer');
    const groupEditors = container.querySelectorAll('.skill-group-editor');
    const newSkills = [];
    let skippedItems = 0;
    let skippedGroups = 0;
    groupEditors.forEach(groupEl => {
      const groupName = groupEl.querySelector('[data-field="group-name"]').value.trim();
      const items = [];
      groupEl.querySelectorAll('.skill-item-row').forEach(row => {
        const name = row.querySelector('[data-field="skill-name"]').value.trim();
        const icon = row.querySelector('[data-field="skill-icon"]').value;
        const level = row.querySelector('[data-field="skill-level"]').value;
        if (name) items.push({ name, icon, level });
        else if (icon) skippedItems++;
      });
      if (groupName && items.length) {
        newSkills.push({ group: groupName, items });
      } else if (groupName || items.length) {
        skippedGroups++;
      }
    });
    data.skills = newSkills;
    DataManager.set(data).then((ok) => {
      if (ok) {
        renderAdminDashboard();
        renderAll();
        if (skippedGroups > 0 || skippedItems > 0) {
          showNotice(`Saved, but ${skippedGroups} group(s) and ${skippedItems} skill(s) were skipped for missing a name.`, 'error');
        } else {
          notifySaveResult(true, 'Skills');
        }
      } else {
        notifySaveResult(false, 'Skills');
      }
    }).catch(() => {
      notifySaveResult(false, 'Skills');
    });
  });

  // Certificates
  document.getElementById('adminAddCertBtn').addEventListener('click', () => {
    document.getElementById('certEditId').value = '';
    document.getElementById('certTitle').value = '';
    document.getElementById('certIssuer').value = '';
    document.getElementById('certDate').value = '';
    document.getElementById('certDesc').value = '';
    document.getElementById('certUrl').value = '';
    document.getElementById('adminCertFormTitle').textContent = 'Add Certificate';
    document.getElementById('adminCertFormPanel').style.display = 'block';
    document.getElementById('adminCertFormPanel').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('adminCertFormCancel').addEventListener('click', () => {
    document.getElementById('adminCertFormPanel').style.display = 'none';
  });
  document.getElementById('adminCertForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (guardDoubleSubmit(e.target)) return;
    const id = parseInt(document.getElementById('certEditId').value);
    const title = document.getElementById('certTitle').value.trim();
    const issuer = document.getElementById('certIssuer').value.trim();
    const date = document.getElementById('certDate').value.trim();
    const description = document.getElementById('certDesc').value.trim();
    const url = document.getElementById('certUrl').value.trim();
    if (!title || !issuer || !description) { showNotice('Title, issuer, and description are required.', 'error'); return; }
    const promise = id ? DataManager.updateCertificate(id, { title, issuer, date, description, url })
                       : DataManager.addCertificate({ title, issuer, date, description, url });
    promise.then((result) => {
      if (result) {
        document.getElementById('adminCertFormPanel').style.display = 'none';
        renderAdminDashboard();
        renderAll();
      }
      notifySaveResult(!!result, 'Certificate');
    }).catch(() => {
      notifySaveResult(false, 'Certificate');
    });
  });

  // Projects
  document.getElementById('adminAddProjectBtn').addEventListener('click', () => {
    document.getElementById('projectEditId').value = '';
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDesc').value = '';
    document.getElementById('projectCategory').value = '';
    document.getElementById('projectGithub').value = '';
    document.getElementById('projectDemo').value = '';
    document.getElementById('projectDate').value = '';
    document.getElementById('adminProjectFormTitle').textContent = 'Add Project';
    document.getElementById('adminProjectFormPanel').style.display = 'block';
    populateCategorySelect();
    populateProjectTagSelect();
    renderProjectTagChips([]);
    document.getElementById('projectThumbnailFile').value = '';
    setProjectThumbnailPreview('');
    document.getElementById('adminProjectFormPanel').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('projectAddTagBtn').addEventListener('click', () => {
    const select = document.getElementById('projectTagSelect');
    const val = select.value;
    if (!val) return;
    const current = document.getElementById('projectTags').value.split(',').map(s => s.trim()).filter(Boolean);
    if (!current.includes(val)) {
      current.push(val);
      renderProjectTagChips(current);
    }
    select.value = '';
  });
  document.getElementById('adminProjectFormCancel').addEventListener('click', () => {
    document.getElementById('adminProjectFormPanel').style.display = 'none';
  });
  document.getElementById('adminProjectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (guardDoubleSubmit(e.target)) return;
    const id = parseInt(document.getElementById('projectEditId').value);
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDesc').value.trim();
    const image = document.getElementById('projectThumbnail').value.trim();
    const tags = document.getElementById('projectTags').value.split(',').map(s => s.trim()).filter(Boolean);
    const category = document.getElementById('projectCategory').value.trim();
    const github = document.getElementById('projectGithub').value.trim();
    const demo = document.getElementById('projectDemo').value.trim();
    const date = document.getElementById('projectDate').value;
    if (!title || !description) { showNotice('Title and description are required.', 'error'); return; }
    const promise = id ? DataManager.updateProject(id, { title, description, image, tags, category, github, demo, date })
                       : DataManager.addProject({ title, description, image, tags, category, github, demo, date });
    promise.then((result) => {
      if (result) {
        document.getElementById('adminProjectFormPanel').style.display = 'none';
        renderAdminDashboard();
        renderAll();
        renderProjects(document.querySelector('.project-filters .filter-btn.active')?.dataset?.filter || 'all');
      }
      notifySaveResult(!!result, 'Project');
    }).catch(() => {
      notifySaveResult(false, 'Project');
    });
  });

  // Categories
  document.getElementById('projectAddCategoryToggle').addEventListener('click', () => {
    const row = document.getElementById('inlineAddCategoryRow');
    const showing = row.style.display !== 'none';
    row.style.display = showing ? 'none' : 'flex';
    const input = document.getElementById('newCategoryInput');
    input.value = '';
    if (!showing) input.focus();
  });
  document.getElementById('cancelAddCategoryBtn').addEventListener('click', () => {
    document.getElementById('inlineAddCategoryRow').style.display = 'none';
    document.getElementById('newCategoryInput').value = '';
  });
  document.getElementById('confirmAddCategoryBtn').addEventListener('click', () => {
    const input = document.getElementById('newCategoryInput');
    const name = input.value.trim();
    if (!name) { showNotice('Category name is required.', 'error'); return; }
    const data = DataManager.get();
    if (data.categories.some(c => c.toLowerCase() === name.toLowerCase())) { showNotice('That category already exists.', 'error'); return; }
    DataManager.addCategory(name).then((result) => {
      if (result) {
        populateCategorySelect();
        document.getElementById('projectCategory').value = name;
        renderProjectFilters();
        document.getElementById('inlineAddCategoryRow').style.display = 'none';
        input.value = '';
      }
      notifySaveResult(!!result, 'Category');
    }).catch(() => {
      notifySaveResult(false, 'Category');
    });
  });
  document.getElementById('newCategoryInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('confirmAddCategoryBtn').click(); }
  });

  // Timeline
  document.getElementById('adminAddTimelineBtn').addEventListener('click', () => {
    document.getElementById('timelineEditId').value = '';
    document.getElementById('timelineTitle').value = '';
    document.getElementById('timelineDesc').value = '';
    document.getElementById('timelineCurrent').checked = false;
    document.getElementById('adminTimelineFormTitle').textContent = 'Add Timeline';
    document.getElementById('adminTimelineFormPanel').style.display = 'block';
    document.getElementById('adminTimelineFormPanel').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('adminTimelineFormCancel').addEventListener('click', () => {
    document.getElementById('adminTimelineFormPanel').style.display = 'none';
  });
  document.getElementById('adminTimelineForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (guardDoubleSubmit(e.target)) return;
    const idRaw = document.getElementById('timelineEditId').value;
    const id = idRaw ? parseInt(idRaw) : null;
    const title = document.getElementById('timelineTitle').value.trim();
    const description = document.getElementById('timelineDesc').value.trim();
    const current = document.getElementById('timelineCurrent').checked;
    if (!title || !description) { showNotice('Title and description are required.', 'error'); return; }
    const promise = id ? DataManager.updateTimeline(id, { title, description, current })
                       : DataManager.addTimeline({ title, description, current });
    promise.then((result) => {
      if (result) {
        document.getElementById('adminTimelineFormPanel').style.display = 'none';
        renderAdminDashboard();
        renderAll();
      }
      notifySaveResult(!!result, 'Timeline item');
    }).catch(() => {
      notifySaveResult(false, 'Timeline item');
    });
  });

  // Stats
  document.getElementById('adminAddStatBtn').addEventListener('click', () => {
    const container = document.getElementById('statsAdminContainer');
    if (container.querySelector('.admin-empty')) container.innerHTML = '';
    container.appendChild(buildStatRow({}));
  });
  document.getElementById('adminStatsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = DataManager.get();
    const container = document.getElementById('statsAdminContainer');
    const rows = container.querySelectorAll('.stat-row');
    const newStats = [];
    let skipped = 0;
    rows.forEach(row => {
      const label = row.querySelector('[data-field="stat-label"]').value.trim();
      const value = row.querySelector('[data-field="stat-value"]').value.trim();
      if (label && value) newStats.push({ label, value });
      else if (label || value) skipped++;
    });
    data.stats = newStats;
    DataManager.set(data).then((ok) => {
      if (ok) {
        renderAdminDashboard();
        renderAll();
        if (skipped > 0) showNotice(`Saved, but ${skipped} stat(s) were skipped — both label and value are required.`, 'error');
        else notifySaveResult(true, 'Stats');
      } else {
        notifySaveResult(false, 'Stats');
      }
    }).catch(() => {
      notifySaveResult(false, 'Stats');
    });
  });

  // Social
  document.getElementById('adminAddSocialBtn').addEventListener('click', () => {
    document.getElementById('socialEditId').value = '';
    document.getElementById('socialPlatform').value = 'other';
    document.getElementById('socialLabel').value = '';
    document.getElementById('socialUrl').value = '';
    document.getElementById('adminSocialFormTitle').textContent = 'Add Social Link';
    document.getElementById('adminSocialFormPanel').style.display = 'block';
    document.getElementById('socialLogoFile').value = '';
    setSocialLogoPreview('');
    document.getElementById('adminSocialFormPanel').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('adminSocialFormCancel').addEventListener('click', () => {
    document.getElementById('adminSocialFormPanel').style.display = 'none';
  });
  document.getElementById('socialLogoFile').addEventListener('change', async function(e) {
    const file = this.files[0];
    if (!file) return;
    if (file.type !== 'image/png') {
      showNotice('Please choose a PNG file.', 'error');
      this.value = '';
      return;
    }
    const MAX_BYTES = 300 * 1024;
    if (file.size > MAX_BYTES) {
      showNotice('Logo is too large (max 300KB). Please use a smaller PNG.', 'error');
      this.value = '';
      return;
    }
    try {
      const compressed = await compressImage(file, { maxWidth: 256, maxHeight: 256, outputType: 'image/png' });
      setSocialLogoPreview(compressed);
    } catch (err) {
      showNotice('Could not read that image file. Please try another.', 'error');
    }
    this.value = '';
  });
  document.getElementById('adminSocialForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (guardDoubleSubmit(e.target)) return;
    const id = parseInt(document.getElementById('socialEditId').value);
    const platform = document.getElementById('socialPlatform').value;
    const label = document.getElementById('socialLabel').value.trim() || platform;
    const url = document.getElementById('socialUrl').value.trim();
    const logo = document.getElementById('socialLogo').value.trim();
    if (!url) { showNotice('URL is required.', 'error'); return; }
    const promise = id ? DataManager.updateSocial(id, { platform, label, url, logo })
                       : DataManager.addSocial({ platform, label, url, logo });
    promise.then((result) => {
      if (result) {
        document.getElementById('adminSocialFormPanel').style.display = 'none';
        renderAdminDashboard();
        renderAll();
      }
      notifySaveResult(!!result, 'Social link');
    }).catch(() => {
      notifySaveResult(false, 'Social link');
    });
  });

  // Contact
  document.getElementById('adminContactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    DataManager.update('contact.text', document.getElementById('contactTextarea').value)
      .then((ok) => {
        if (ok) {
          renderAdminDashboard();
          renderAll();
        }
        notifySaveResult(ok, 'Contact text');
      }).catch(() => {
        notifySaveResult(false, 'Contact text');
      });
  });

  // Resume
  document.getElementById('resumeFileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showNotice('Please choose a PDF file.', 'error');
      this.value = '';
      return;
    }
    const MAX_BYTES = 4 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      showNotice('PDF is too large (max 4MB). Try compressing it or link an external URL instead.', 'error');
      this.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById('resumeFileData').value = event.target.result;
      document.getElementById('resumeFileName').value = file.name;
      renderResumeFileStatus();
      showNotice('PDF loaded — click "Save Resume" to publish it.', 'success');
    };
    reader.onerror = function() {
      showNotice('Could not read that PDF file. Please try another.', 'error');
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('adminResumeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('resumeUrl').value.trim();
    const label = document.getElementById('resumeLabel').value.trim();
    const fileData = document.getElementById('resumeFileData').value;
    const fileName = document.getElementById('resumeFileName').value;
    DataManager.updateResume({ url, label, fileData, fileName })
      .then((ok) => {
        if (ok) {
          renderAdminDashboard();
          renderAll();
        }
        notifySaveResult(ok, 'Resume');
      }).catch(() => {
        notifySaveResult(false, 'Resume');
      });
  });

  // Footer
  document.getElementById('adminFooterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (guardDoubleSubmit(e.target)) return;
    const tagline = document.getElementById('footerTaglineInput').value.trim();
    const data = DataManager.get();
    if (!data.footer) data.footer = {};
    data.footer.tagline = tagline;
    DataManager.save().then((ok) => {
      if (ok) {
        renderAll();
      }
      notifySaveResult(ok, 'Footer');
    }).catch(() => {
      notifySaveResult(false, 'Footer');
    });
  });

  // Password
  document.getElementById('adminPasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const current = document.getElementById('settingsCurrentPw').value;
    const newPw = document.getElementById('settingsNewPw').value;
    const confirm = document.getElementById('settingsConfirmPw').value;
    const err = document.getElementById('settingsPwError');
    const suc = document.getElementById('settingsPwSuccess');
    err.textContent = '';
    suc.textContent = '';
    const hash = localStorage.getItem('rashed_portfolio_hash');
    if (hashPassword(current) !== hash) { err.textContent = 'Current password incorrect.'; return; }
    if (newPw.length < 6) { err.textContent = 'Minimum 6 characters.'; return; }
    if (newPw !== confirm) { err.textContent = 'Passwords do not match.'; return; }
    localStorage.setItem('rashed_portfolio_hash', hashPassword(newPw));
    suc.textContent = 'Password updated! Your portfolio content is unaffected by this change.';
    document.getElementById('settingsCurrentPw').value = '';
    document.getElementById('settingsNewPw').value = '';
    document.getElementById('settingsConfirmPw').value = '';
  });

  // Reset
  document.getElementById('adminResetDataBtn').addEventListener('click', () => {
    if (!confirm('⚠️ Reset ALL data to factory defaults?')) return;
    if (!confirm('This cannot be undone. Continue?')) return;
    DataManager.reset().then((ok) => {
      if (ok) {
        renderAdminDashboard();
        renderAll();
      }
      notifySaveResult(ok, 'Reset');
    }).catch(() => {
      notifySaveResult(false, 'Reset');
    });
  });

  // ---- Public filters ----
  document.querySelectorAll('.project-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.project-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });

  // ---- Back to top ----
  const backBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.pageYOffset > 500);
  });
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- Scroll reveal ----
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => obs.observe(el));

  // ---- Nav active ----
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.pageYOffset >= s.offsetTop - 200) current = s.getAttribute('id');
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href').includes(current));
    });
  });

  // ---- Initial data load ----
  async function initializeApp() {
    await DataManager.init();
    renderAll();

    try {
      if (!localStorage.getItem('rashed_portfolio_hash')) {
        localStorage.setItem('rashed_portfolio_hash', hashPassword('admin123'));
      }
    } catch (err) {
      console.error('Could not seed admin password:', err);
    }

    document.getElementById('year').textContent = new Date().getFullYear();
    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderProjectFilters();
  }

  initializeApp();

});

// ---- Rebuild project filter buttons ----
function renderProjectFilters() {
  const filterContainer = document.querySelector('.project-filters');
  const categories = DataManager.get().categories || [];
  filterContainer.querySelectorAll('.filter-btn:not([data-filter="all"])').forEach(b => b.remove());
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = cat;
    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.textContent = label;
    btn.setAttribute('aria-label', 'Filter projects by ' + label);
    filterContainer.appendChild(btn);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.project-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });
}
