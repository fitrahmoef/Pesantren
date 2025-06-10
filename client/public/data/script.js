// ============== GLOBAL VARIABLES ==============
let currentStep = 1;
const totalSteps = 5;

// ============== DOM ELEMENTS ==============
const formContainer = document.getElementById('formContainer');
const form = document.getElementById('registrationForm');
const formSteps = document.querySelectorAll('.form-step');
const steps = document.querySelectorAll('.step');
const progressLine = document.getElementById('progressLine');
const successMessage = document.getElementById('successMessage');

// Navigation buttons
const step1Next = document.getElementById('step1Next');
const step2Prev = document.getElementById('step2Prev');
const step2Next = document.getElementById('step2Next');
const step3Prev = document.getElementById('step3Prev');
const step3Next = document.getElementById('step3Next');
const step4Prev = document.getElementById('step4Prev');
const step4Next = document.getElementById('step4Next');
const step5Prev = document.getElementById('step5Prev');
const submitForm = document.getElementById('submitForm');
const resetForm = document.getElementById('resetForm');

// ============== INITIALIZATION ==============
document.addEventListener('DOMContentLoaded', function() {
  // Form container animation
  setTimeout(() => {
    formContainer.classList.add('show');
  }, 300);
  
  // Setup event listeners
  setupEventListeners();
  
  // Setup file upload handlers
  setupFileUploads();
  
  // Setup phone number formatting
  setupPhoneFormatting();
  
  // Initialize progress
  updateProgress();
  
  console.log('Form validation demo initialized successfully');
});

// ============== EVENT LISTENERS SETUP ==============
function setupEventListeners() {
  // Navigation events
  step1Next.addEventListener('click', () => {
    if (validateStep(1)) {
      goToStep(2);
    }
  });
  
  step2Prev.addEventListener('click', () => {
    goToStep(1);
  });
  
  step2Next.addEventListener('click', () => {
    if (validateStep(2)) {
      goToStep(3);
    }
  });
  
  step3Prev.addEventListener('click', () => {
    goToStep(2);
  });
  
  step3Next.addEventListener('click', () => {
    if (validateStep(3)) {
      goToStep(4);
    }
  });
  
  step4Prev.addEventListener('click', () => {
    goToStep(3);
  });
  
  step4Next.addEventListener('click', () => {
    if (validateStep(4)) {
      generateSummary();
      goToStep(5);
    }
  });
  
  step5Prev.addEventListener('click', () => {
    goToStep(4);
  });
  
  // Form submission
  form.addEventListener('submit', handleFormSubmission);
  
  // Reset functionality
  resetForm.addEventListener('click', function(e) {
    e.preventDefault();
    resetFormToStep1();
  });
  
  // Real-time validation
  setupRealTimeValidation();
}

// ============== STEP NAVIGATION ==============
function goToStep(step) {
  if (step < 1 || step > totalSteps) return;
  
  // Update form steps
  formSteps.forEach((formStep, index) => {
    formStep.classList.remove('active');
    
    if (index + 1 === step) {
      formStep.classList.add('active');
    }
  });
  
  // Update step indicators
  steps.forEach((stepElement, index) => {
    stepElement.classList.remove('active', 'completed');
    
    if (index + 1 < step) {
      stepElement.classList.add('completed');
    } else if (index + 1 === step) {
      stepElement.classList.add('active');
    }
  });
  
  currentStep = step;
  updateProgress();
  
  // Scroll to top of form
  formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  console.log(`Moved to step ${step}`);
}

function updateProgress() {
  const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
  progressLine.style.width = `${percent}%`;
}

// ============== VALIDATION ==============
function validateStep(step) {
  const activeStep = document.getElementById(`form-step-${step}`);
  const requiredFields = activeStep.querySelectorAll('[required]');
  let isValid = true;
  let errorCount = 0;
  
  requiredFields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
      errorCount++;
    }
  });
  
  if (!isValid) {
    showNotification(`Step ${step}: ${errorCount} field${errorCount > 1 ? 's' : ''} perlu diperbaiki`, 'error');
  } else {
    showNotification(`Step ${step}: Validasi berhasil!`, 'success');
  }
  
  return isValid;
}

function validateField(field) {
  const formGroup = field.closest('.form-group') || field.closest('.checkbox-item');
  
  // Remove previous error state
  formGroup.classList.remove('has-error');
  
  let isValid = true;
  
  if (field.type === 'file') {
    if (field.files.length === 0) {
      formGroup.classList.add('has-error');
      isValid = false;
    }
  } else if (field.type === 'checkbox') {
    if (!field.checked) {
      formGroup.classList.add('has-error');
      isValid = false;
    }
  } else {
    const value = field.value.trim();
    
    if (value === '') {
      formGroup.classList.add('has-error');
      isValid = false;
    } else {
      // Additional specific validations
      if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          formGroup.classList.add('has-error');
          isValid = false;
        }
      }
      
      if (field.type === 'tel') {
        const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
          formGroup.classList.add('has-error');
          isValid = false;
        }
      }
      
      if (field.type === 'date') {
        const selectedDate = new Date(value);
        const minDate = new Date('1900-01-01');
        const maxDate = new Date();
        
        if (selectedDate < minDate || selectedDate > maxDate) {
          formGroup.classList.add('has-error');
          isValid = false;
        }
      }
    }
  }
  
  return isValid;
}

function setupRealTimeValidation() {
  const allInputs = form.querySelectorAll('input, select, textarea');
  
  allInputs.forEach(input => {
    // Validate on blur for better UX
    input.addEventListener('blur', function() {
      if (this.hasAttribute('required') || this.value.trim() !== '') {
        validateField(this);
      }
    });
    
    // Clear error state on input
    input.addEventListener('input', function() {
      const formGroup = this.closest('.form-group') || this.closest('.checkbox-item');
      if (formGroup.classList.contains('has-error')) {
        formGroup.classList.remove('has-error');
      }
    });
  });
}

// ============== FILE UPLOAD HANDLING ==============
function setupFileUploads() {
  const fileInputs = document.querySelectorAll('.file-input');
  
  fileInputs.forEach(input => {
    input.addEventListener('change', function() {
      handleFileUpload(this);
    });
    
    // Drag and drop functionality
    const fileLabel = input.parentNode.querySelector('.file-label');
    
    fileLabel.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.style.borderColor = '#1a75ff';
      this.style.background = '#e3f2fd';
    });
    
    fileLabel.addEventListener('dragleave', function(e) {
      e.preventDefault();
      this.style.borderColor = '#ddd';
      this.style.background = 'transparent';
    });
    
    fileLabel.addEventListener('drop', function(e) {
      e.preventDefault();
      this.style.borderColor = '#ddd';
      this.style.background = 'transparent';
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        input.files = files;
        handleFileUpload(input);
      }
    });
  });
}

function handleFileUpload(input) {
  const fileInfo = document.getElementById(`${input.id}-info`);
  const formGroup = input.closest('.form-group');
  
  if (input.files.length > 0) {
    const file = input.files[0];
    const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB
    
    // Validate file size (max 2MB)
    if (parseFloat(fileSize) > 2) {
      fileInfo.textContent = `${file.name} - Ukuran file terlalu besar (max 2MB)`;
      fileInfo.style.color = '#dc3545';
      input.value = ''; // Reset file input
      formGroup.classList.add('has-error');
      return;
    }
    
    // Validate file type
    const allowedTypes = input.getAttribute('accept').split(',');
    const fileType = file.type;
    const isValidType = allowedTypes.some(type => {
      if (type.trim() === 'image/*') {
        return fileType.startsWith('image/');
      } else if (type.trim() === 'application/pdf') {
        return fileType === 'application/pdf';
      }
      return fileType === type.trim();
    });
    
    if (!isValidType) {
      fileInfo.textContent = `${file.name} - Format file tidak didukung`;
      fileInfo.style.color = '#dc3545';
      input.value = '';
      formGroup.classList.add('has-error');
      return;
    }
    
    // File is valid
    fileInfo.textContent = `✓ ${file.name} (${fileSize} MB)`;
    fileInfo.style.color = '#28a745';
    formGroup.classList.remove('has-error');
    
  } else {
    fileInfo.textContent = 'Belum ada file dipilih';
    fileInfo.style.color = '#1a75ff';
  }
}

// ============== PHONE NUMBER FORMATTING ==============
function setupPhoneFormatting() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', function() {
      let value = this.value.replace(/\D/g, ''); // Remove non-digits
      
      // Format Indonesian phone numbers
      if (value.startsWith('62')) {
        value = '0' + value.substring(2);
      } else if (value.startsWith('8')) {
        value = '0' + value;
      }
      
      this.value = value;
    });
    
    input.addEventListener('keypress', function(e) {
      // Only allow numbers
      if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }
    });
  });
}

// ============== SUMMARY GENERATION ==============
function generateSummary() {
  const summaryContainer = document.getElementById('summary-container');
  const formData = new FormData(form);
  
  let summaryHTML = '';
  
  // Personal data
  summaryHTML += `
    <div class="summary-section">
      <h4>Data Pribadi</h4>
      <p><strong>Nama Lengkap:</strong> ${formData.get('fullname') || '-'}</p>
      <p><strong>Nama Panggilan:</strong> ${formData.get('nickname') || '-'}</p>
      <p><strong>Tempat, Tanggal Lahir:</strong> ${formData.get('birthplace') || '-'}, ${formatDate(formData.get('birthdate'))}</p>
      <p><strong>Jenis Kelamin:</strong> ${formData.get('gender') || '-'}</p>
      <p><strong>Golongan Darah:</strong> ${formData.get('blood_type') || '-'}</p>
      <p><strong>Alamat:</strong> ${formData.get('address') || '-'}</p>
      <p><strong>No. HP:</strong> ${formData.get('phone') || '-'}</p>
      <p><strong>Email:</strong> ${formData.get('email') || '-'}</p>
    </div>
  `;
  
  // Parent data
  summaryHTML += `
    <div class="summary-section">
      <h4>Data Orang Tua</h4>
      <p><strong>Nama Ayah:</strong> ${formData.get('father_name') || '-'}</p>
      <p><strong>Pekerjaan Ayah:</strong> ${formData.get('father_occupation') || '-'}</p>
      <p><strong>Nama Ibu:</strong> ${formData.get('mother_name') || '-'}</p>
      <p><strong>Pekerjaan Ibu:</strong> ${formData.get('mother_occupation') || '-'}</p>
      <p><strong>No. HP Orang Tua:</strong> ${formData.get('parent_phone') || '-'}</p>
    </div>
  `;
  
  // Education data
  summaryHTML += `
    <div class="summary-section">
      <h4>Data Pendidikan</h4>
      <p><strong>Pendaftaran untuk Tingkat:</strong> ${formData.get('education_level') || '-'}</p>
      <p><strong>Asal Sekolah:</strong> ${formData.get('previous_school') || '-'}</p>
      <p><strong>Tahun Lulus:</strong> ${formData.get('graduation_year') || '-'}</p>
      <p><strong>NISN:</strong> ${formData.get('nisn') || '-'}</p>
      <p><strong>Kemampuan Membaca Al-Quran:</strong> ${formData.get('quran_ability') || '-'}</p>
      <p><strong>Kemampuan Shalat:</strong> ${formData.get('shalat_ability') || '-'}</p>
      <p><strong>Prestasi:</strong> ${formData.get('achievements') || '-'}</p>
    </div>
  `;
  
  // Payment data
  summaryHTML += `
    <div class="summary-section">
      <h4>Data Pembayaran</h4>
      <p><strong>Tanggal Pembayaran:</strong> ${formatDate(formData.get('payment_date'))}</p>
      <p><strong>Nama Pengirim:</strong> ${formData.get('payment_name') || '-'}</p>
    </div>
  `;
  
  // File uploads summary
  summaryHTML += `
    <div class="summary-section">
      <h4>Dokumen yang Diunggah</h4>
      <p><strong>Pas Foto:</strong> ${getFileStatus('photo')}</p>
      <p><strong>Akta Kelahiran:</strong> ${getFileStatus('birth-certificate')}</p>
      <p><strong>Kartu Keluarga:</strong> ${getFileStatus('family-card')}</p>
      <p><strong>KTP Orang Tua:</strong> ${getFileStatus('parent-id')}</p>
      <p><strong>Rapor Terakhir:</strong> ${getFileStatus('report-card')}</p>
      <p><strong>Bukti Pembayaran:</strong> ${getFileStatus('payment-proof')}</p>
    </div>
  `;
  
  summaryContainer.innerHTML = summaryHTML;
}

function getFileStatus(fieldId) {
  const fileInput = document.getElementById(fieldId);
  if (fileInput && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    return `✓ ${file.name} (${fileSize} MB)`;
  }
  return '❌ Belum diunggah';
}

// ============== FORM SUBMISSION ==============
function handleFormSubmission(e) {
  e.preventDefault();
  
  if (!validateStep(5)) {
    return;
  }
  
  // Simulate successful validation
  setTimeout(() => {
    showSuccess();
    showNotification('Semua validasi berhasil! Form siap untuk integrasi backend.', 'success');
  }, 500);
}

// ============== SUCCESS HANDLING ==============
function showSuccess() {
  form.style.display = 'none';
  successMessage.style.display = 'block';
  
  // Scroll to success message
  successMessage.scrollIntoView({ behavior: 'smooth' });
}

function resetFormToStep1() {
  // Reset form data
  form.reset();
  
  // Clear all error states
  const errorGroups = form.querySelectorAll('.form-group.has-error, .checkbox-item.has-error');
  errorGroups.forEach(group => {
    group.classList.remove('has-error');
  });
  
  // Reset file info displays
  const fileInfos = form.querySelectorAll('.file-info');
  fileInfos.forEach(info => {
    info.textContent = 'Belum ada file dipilih';
    info.style.color = '#1a75ff';
  });
  
  // Go back to step 1
  currentStep = 1;
  goToStep(1);
  
  // Show form, hide success message
  form.style.display = 'block';
  successMessage.style.display = 'none';
  
  showNotification('Form telah direset ke langkah awal', 'info');
}

// ============== DEMO FUNCTIONS ==============
function fillTestData() {
  // Step 1 data
  document.getElementById('fullname').value = 'Ahmad Fadhil Rahman';
  document.getElementById('nickname').value = 'Fadhil';
  document.getElementById('birthplace').value = 'Pekanbaru';
  document.getElementById('birthdate').value = '2010-05-15';
  document.getElementById('gender').value = 'Laki-laki';
  document.getElementById('blood-type').value = 'A';
  document.getElementById('address').value = 'Jl. Soekarno Hatta No. 123, Pekanbaru, Riau';
  document.getElementById('phone').value = '081234567890';
  document.getElementById('email').value = 'fadhil@gmail.com';
  document.getElementById('father-name').value = 'Rahman Hidayat';
  document.getElementById('father-occupation').value = 'PNS';
  document.getElementById('mother-name').value = 'Siti Aminah';
  document.getElementById('mother-occupation').value = 'Guru';
  document.getElementById('parent-phone').value = '081234567891';
  
  // Step 2 data
  document.getElementById('education-level').value = 'SLTP';
  document.getElementById('previous-school').value = 'SDN 001 Pekanbaru';
  document.getElementById('graduation-year').value = '2025';
  document.getElementById('nisn').value = '1234567890';
  document.getElementById('quran-ability').value = 'Menengah';
  document.getElementById('shalat-ability').value = 'Mandiri';
  document.getElementById('achievements').value = 'Juara 2 Lomba Tahfidz Tingkat Kecamatan 2024';
  
  // Step 4 data
  document.getElementById('payment-date').value = '2025-06-01';
  document.getElementById('payment-name').value = 'Rahman Hidayat';
  
  showNotification('Data test berhasil diisi!', 'success');
  console.log('Test data filled successfully');
}

function clearForm() {
  if (confirm('Apakah Anda yakin ingin mengosongkan semua data form?')) {
    resetFormToStep1();
  }
}

function validateCurrentStep() {
  const isValid = validateStep(currentStep);
  if (isValid) {
    showNotification(`Step ${currentStep} valid! ✓`, 'success');
  }
}

function showValidationSummary() {
  let summary = 'RINGKASAN VALIDASI FORM:\n\n';
  let totalErrors = 0;
  
  for (let i = 1; i <= totalSteps; i++) {
    const stepElement = document.getElementById(`form-step-${i}`);
    const requiredFields = stepElement.querySelectorAll('[required]');
    let stepErrors = 0;
    
    requiredFields.forEach(field => {
      if (!validateField(field)) {
        stepErrors++;
      }
    });
    
    totalErrors += stepErrors;
    const stepStatus = stepErrors === 0 ? '✓ VALID' : `❌ ${stepErrors} error(s)`;
    summary += `Step ${i}: ${stepStatus}\n`;
  }
  
  summary += `\nTotal Errors: ${totalErrors}`;
  summary += totalErrors === 0 ? '\n🎉 Form siap untuk submit!' : '\n⚠️ Perbaiki error untuk melanjutkan.';
  
  alert(summary);
}

// ============== UTILITY FUNCTIONS ==============
function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return '-';
  }
}

function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notif => notif.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// ============== KEYBOARD SHORTCUTS ==============
document.addEventListener('keydown', function(e) {
  // Ctrl + Enter to validate current step
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    validateCurrentStep();
  }
  
  // Ctrl + R to reset form (prevent default browser reload)
  if (e.ctrlKey && e.key === 'r') {
    e.preventDefault();
    if (confirm('Reset form?')) {
      resetFormToStep1();
    }
  }
  
  // Arrow keys for navigation (when not in input)
  if (!e.target.matches('input, select, textarea')) {
    if (e.key === 'ArrowRight' && currentStep < totalSteps) {
      if (validateStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    } else if (e.key === 'ArrowLeft' && currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }
});

// ============== BROWSER COMPATIBILITY ==============
// Check for required features
if (!window.fetch) {
  showNotification('Browser Anda tidak mendukung fitur yang diperlukan. Silakan gunakan browser yang lebih baru.', 'error');
}

// ============== DEVELOPMENT HELPERS ==============
window.formValidationDemo = {
  fillTestData,
  clearForm,
  validateCurrentStep,
  showValidationSummary,
  goToStep,
  getCurrentStep: () => currentStep,
  getFormData: () => new FormData(form),
  resetForm: resetFormToStep1
};

console.log('=== Form Validation Demo Loaded Successfully ===');
console.log('Available demo functions:');
console.log('- fillTestData()');
console.log('- clearForm()');
console.log('- validateCurrentStep()');
console.log('- showValidationSummary()');
console.log('Keyboard shortcuts:');
console.log('- Ctrl+Enter: Validate current step');
console.log('- Ctrl+R: Reset form');
console.log('- Arrow keys: Navigate steps (when valid)');