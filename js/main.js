// ==============================
// PDFMaster - Main JavaScript
// ==============================

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
}

// FAQ Toggle
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('active');
  }
}

// Drag and Drop Upload
function initUploadBox() {
  const boxes = document.querySelectorAll('.upload-box');
  boxes.forEach(box => {
    box.addEventListener('dragover', e => { e.preventDefault(); box.classList.add('dragover'); });
    box.addEventListener('dragleave', () => box.classList.remove('dragover'));
    box.addEventListener('drop', e => {
      e.preventDefault();
      box.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length) handleFiles(files, box);
    });
    const input = box.querySelector('input[type="file"]');
    const btn = box.querySelector('.upload-btn');
    if (btn && input) btn.addEventListener('click', () => input.click());
    if (input) input.addEventListener('change', e => handleFiles(e.target.files, box));
  });
}

function handleFiles(files, box) {
  const file = files[0];
  if (!file) return;
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    showAlert('File too large. Maximum size is 100MB.', 'error');
    return;
  }
  showUploadProgress(box, file.name);
}

function showUploadProgress(box, filename) {
  box.innerHTML = `
    <div class="upload-success">
      <div class="file-icon">📄</div>
      <h3>${filename}</h3>
      <div class="progress-bar-wrap">
        <div class="progress-bar" id="progress-bar"></div>
      </div>
      <p class="upload-status">Uploading...</p>
    </div>
  `;
  let pct = 0;
  const bar = document.getElementById('progress-bar');
  const status = box.querySelector('.upload-status');
  const interval = setInterval(() => {
    pct += Math.random() * 15;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      if (bar) bar.style.width = '100%';
      if (status) {
        status.textContent = '✅ File uploaded! Configure options below.';
        status.style.color = '#059669';
      }
      // Show process button
      const processSection = document.getElementById('process-section');
      if (processSection) processSection.style.display = 'block';
    }
    if (bar) bar.style.width = pct + '%';
  }, 150);
}

function showAlert(msg, type = 'info') {
  const div = document.createElement('div');
  div.className = `alert alert-${type}`;
  div.textContent = msg;
  div.style.cssText = `position:fixed;top:80px;right:20px;z-index:9999;padding:12px 20px;border-radius:10px;font-size:0.88rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.15);background:${type==='error'?'#FEF2F2':'#F0FDF4'};color:${type==='error'?'#E8293B':'#059669'};border:1.5px solid ${type==='error'?'#FCA5A5':'#6EE7B7'};`;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3500);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// Sticky header shadow
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header) header.style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.12)' : '';
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showAlert('Message sent! We\'ll reply within 24 hours.', 'success');
    contactForm.reset();
  });
}

// Newsletter form
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    showAlert('Subscribed! Thank you for joining PDFMaster.', 'success');
    newsletterForm.reset();
  });
}

// Auth forms
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    showAlert('Login successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = '../index.html', 1500);
  });
}

const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    showAlert('Account created! Welcome to PDFMaster!', 'success');
    setTimeout(() => window.location.href = '../index.html', 1500);
  });
}

// Process button
const processBtn = document.querySelector('.process-btn');
if (processBtn) {
  processBtn.addEventListener('click', () => {
    processBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Processing...';
    processBtn.disabled = true;
    setTimeout(() => {
      processBtn.innerHTML = '✅ Done! Your file is ready.';
      processBtn.style.background = '#059669';
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = '#'; link.download = 'processed.pdf';
        link.click();
        showAlert('File processed! Download started.', 'success');
        processBtn.innerHTML = 'Process File';
        processBtn.disabled = false;
        processBtn.style.background = '';
      }, 1500);
    }, 2500);
  });
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.spin { animation: spin 1s linear infinite; }
.upload-success { padding: 20px; }
.file-icon { font-size: 2.5rem; margin-bottom: 10px; }
.upload-success h3 { font-size: 1rem; margin-bottom: 16px; color: #343A40; }
.progress-bar-wrap { background: #E9ECEF; border-radius: 100px; height: 6px; margin-bottom: 10px; overflow: hidden; }
.progress-bar { height: 100%; background: #E8293B; border-radius: 100px; width: 0; transition: width 0.2s; }
.upload-status { font-size: 0.85rem; color: #6C757D; }
#process-section { display: none; }
`;
document.head.appendChild(style);

// Google AdSense init (uncomment when you have your Publisher ID)
// (adsbygoogle = window.adsbygoogle || []).push({});

document.addEventListener('DOMContentLoaded', () => {
  initUploadBox();
});
