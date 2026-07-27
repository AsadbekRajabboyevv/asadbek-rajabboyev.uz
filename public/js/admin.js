/* public/js/admin.js */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Switching
    const tabLinks = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Read initial tab from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const urlTab = urlParams.get('tab');
    
    function switchTab(targetId) {
        // Hide all contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        // Remove active class from all tabs
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Show target content
        const targetContent = document.getElementById(targetId);
        if(targetContent) {
            targetContent.classList.add('active');
            // Add active class to corresponding tab
            const activeTab = document.querySelector(`[data-tab-target="${targetId}"]`);
            if(activeTab) activeTab.classList.add('active');
            
            // Update URL without reload
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('tab', targetId);
            window.history.pushState({}, '', newUrl);
        }
    }
    
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.tabTarget);
            
            // On mobile, close sidebar when clicking a tab
            if(window.innerWidth < 1024) {
                document.getElementById('sidebar').classList.add('-translate-x-full');
            }
        });
    });
    
    // Initial load active tab
    if(urlTab) {
        switchTab(urlTab);
    } else {
        // Find element with data-initial-tab if any, otherwise first
        const initialTabElem = document.querySelector('[data-initial-tab="true"]');
        if(initialTabElem) {
            switchTab(initialTabElem.dataset.tabTarget);
        }
    }
    
    // 2. Mobile Sidebar Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('sidebar');
    
    if(mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
        });
    }
    
    if(closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
        });
    }
    
    // 3. Delete Confirmation
    const deleteForms = document.querySelectorAll('.delete-form');
    deleteForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if(!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                e.preventDefault();
            }
        });
    });
    
    // 4. Flash Messages Auto-dismiss
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 300);
        }, 3000);
        
        // Setup close buttons
        const closeBtn = msg.querySelector('.close-flash');
        if(closeBtn) {
            closeBtn.addEventListener('click', () => {
                msg.remove();
            });
        }
    });

    // Handle query params success/error
    if(urlParams.get('success') || urlParams.get('error')) {
        // Clean URL to not show alerts again on refresh
        const cleanUrl = window.location.origin + window.location.pathname + '?tab=' + (urlParams.get('tab') || 'dashboard');
        window.history.replaceState({}, document.title, cleanUrl);
    }
    
    // 5. Image Upload Preview
    const imageInputs = document.querySelectorAll('input[type="file"][accept="image/*"]');
    imageInputs.forEach(input => {
        input.addEventListener('change', function() {
            if(this.files && this.files[0]) {
                const previewId = this.dataset.previewTarget;
                if(previewId) {
                    const previewElem = document.getElementById(previewId);
                    if(previewElem) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            if(previewElem.tagName.toLowerCase() === 'img') {
                                previewElem.src = e.target.result;
                            } else {
                                previewElem.style.backgroundImage = `url(${e.target.result})`;
                            }
                            previewElem.classList.remove('hidden');
                        }
                        reader.readAsDataURL(this.files[0]);
                    }
                }
            }
        });
    });
    
    // 6. Skill Icon Preview
    const iconInputs = document.querySelectorAll('.icon-input');
    iconInputs.forEach(input => {
        input.addEventListener('input', function() {
            const previewId = this.dataset.previewTarget;
            if(previewId) {
                const previewElem = document.getElementById(previewId);
                if(previewElem) {
                    previewElem.className = this.value || 'fas fa-question';
                }
            }
        });
    });
    
    // 7. Range Slider Value Display
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
        input.addEventListener('input', function() {
            const displayId = this.dataset.displayTarget;
            if(displayId) {
                const displayElem = document.getElementById(displayId);
                if(displayElem) {
                    displayElem.textContent = this.value + '%';
                }
            }
        });
    });
    
    // 8. Technologies Input Helper (Comma separated to JSON string before submit)
    const formsWithTech = document.querySelectorAll('form[data-has-tech="true"]');
    formsWithTech.forEach(form => {
        form.addEventListener('submit', function(e) {
            const techInput = this.querySelector('.tech-input');
            const hiddenTechInput = this.querySelector('.tech-hidden-input');
            if(techInput && hiddenTechInput) {
                const val = techInput.value.trim();
                if(val) {
                    const arr = val.split(',').map(s => s.trim()).filter(s => s);
                    hiddenTechInput.value = JSON.stringify(arr);
                } else {
                    hiddenTechInput.value = '[]';
                }
            }
        });
    });
});
