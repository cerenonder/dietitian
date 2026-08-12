/* ==========================================================================
   Dyt. Şevval Zeren Önder - Premium JS Controls (Updated Phone & Email)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. DOM Elements
    const mainHeader = document.getElementById('main-header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const navBackdrop = document.getElementById('nav-backdrop');
    const hamburgerIconPath = document.getElementById('hamburger-icon-path');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const appointmentForm = document.getElementById('appointment-form');
    const submitEmailBtn = document.getElementById('submit-email');

    // WhatsApp and Email configurations
    const dietitianWhatsappNumber = "905070700277"; // Updated target dietitian phone
    const dietitianEmailAddress = "dyt.sevvalzeren@gmail.com";

    // 2. Sticky Header & Active Nav Link Highlight on Scroll
    const handleScroll = () => {
        // Sticky Header Toggle
        if (window.scrollY > 20) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset header height
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial run

    // 3. Mobile Sidebar Menu Toggle Controls
    const toggleMobileMenu = () => {
        const isOpen = mobileNav.classList.contains('translate-x-0');

        if (isOpen) {
            // Close menu
            mobileNav.classList.remove('translate-x-0');
            mobileNav.classList.add('translate-x-full');
            navBackdrop.classList.add('hidden');
            // Reset to hamburger lines
            hamburgerIconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        } else {
            // Open menu
            mobileNav.classList.remove('translate-x-full');
            mobileNav.classList.add('translate-x-0');
            navBackdrop.classList.remove('hidden');
            // Change to 'X' close symbol
            hamburgerIconPath.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    navBackdrop.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking navigation items in drawer
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('translate-x-0')) {
                toggleMobileMenu();
            }
        });
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    const revealElements = document.querySelectorAll('.scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-up');
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 5. Booking / Contact Form Integrations

    // Fetch input values
    const getFormData = () => {
        const nameVal = document.getElementById('name').value.trim();
        const phoneVal = document.getElementById('phone').value.trim();
        const emailVal = document.getElementById('email').value.trim();
        const serviceSelect = document.getElementById('service-select');
        const serviceVal = serviceSelect.options[serviceSelect.selectedIndex].value;
        const messageVal = document.getElementById('message').value.trim();

        return { name: nameVal, phone: phoneVal, email: emailVal, service: serviceVal, message: messageVal };
    };

    // WhatsApp Message Submission Redirect
    const sendToWhatsApp = (e) => {
        e.preventDefault();

        if (!appointmentForm.checkValidity()) {
            appointmentForm.reportValidity();
            return;
        }

        const data = getFormData();
        const msgText = `Merhaba Diyetisyen Şevval Hanım, Randevu Başvurusu yapmak istiyorum:\n\n` +
            `👤 *Ad Soyad:* ${data.name}\n` +
            `📞 *Telefon:* ${data.phone}\n` +
            `✉️ *E-Posta:* ${data.email}\n` +
            `🥗 *Hizmet:* ${data.service}\n` +
            `📝 *Not:* ${data.message ? data.message : 'Ek not belirtilmedi.'}`;

        const encText = encodeURIComponent(msgText);
        const waUrl = `https://api.whatsapp.com/send?phone=${dietitianWhatsappNumber}&text=${encText}`;

        window.open(waUrl, '_blank');
    };

    // Email Submission Redirect
    const sendToEmail = () => {
        if (!appointmentForm.checkValidity()) {
            appointmentForm.reportValidity();
            return;
        }

        const data = getFormData();
        const subject = `Randevu Başvurusu - ${data.name}`;
        const emailBody = `Merhaba Diyetisyen Şevval Hanım,\n\n` +
            `Aşağıdaki bilgilerle beslenme danışmanlığı randevusu oluşturmak istiyorum:\n\n` +
            `Ad Soyad: ${data.name}\n` +
            `Telefon: ${data.phone}\n` +
            `E-Posta: ${data.email}\n` +
            `Hizmet Türü: ${data.service}\n` +
            `Not: ${data.message ? data.message : 'Not girilmedi.'}\n\n` +
            `İyi çalışmalar dilerim.`;

        const mailtoUrl = `mailto:${dietitianEmailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

        window.location.href = mailtoUrl;
    };

    // Listeners
    appointmentForm.addEventListener('submit', sendToWhatsApp);
    submitEmailBtn.addEventListener('click', sendToEmail);
});
