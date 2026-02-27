/* ============================================================
   IVAN JETHRO — PORTFOLIO JAVASCRIPT
   Handles: Navbar, Mobile Menu, Scroll Animations, 
   Active Links, Form Handling
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------------------------------------
    // DOM ELEMENT REFERENCES
    // -----------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('section[id]');
    const projectCards = document.querySelectorAll('[data-project-card]');
    const projectModal = document.getElementById('projectModal');
    const projectModalClose = document.getElementById('projectModalClose');
    const projectModalTitle = document.getElementById('projectModalTitle');
    const projectModalDescription = document.getElementById('projectModalDescription');
    const projectModalTags = document.getElementById('projectModalTags');
    const projectModalActions = document.getElementById('projectModalActions');

    // mobile overlay for when menu is open
    const overlay = document.createElement('div');
    overlay.classList.add('mobile-overlay');
    document.body.appendChild(overlay);


    // -----------------------------------------------------------
    // 1. NAVBAR: Background change on scroll
    // -----------------------------------------------------------
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    // Run once on load in case page is already scrolled
    handleNavbarScroll();


    // -----------------------------------------------------------
    // 2. MOBILE MENU: Hamburger toggle
    // -----------------------------------------------------------
    function openMobileMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close mobile menu when clicking overlay
    overlay.addEventListener('click', closeMobileMenu);

    // Close mobile menu when clicking a mobile link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });


    // -----------------------------------------------------------
    // 3. SMOOTH SCROLLING for all anchor links
    // -----------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // -----------------------------------------------------------
    // 4. ACTIVE NAV LINK: Highlight based on scroll position
    // -----------------------------------------------------------
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Desktop nav
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Mobile nav
                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();


    // -----------------------------------------------------------
    // 5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
    // -----------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index within parent
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let index = 0;
                siblings.forEach((sibling, i) => {
                    if (sibling === entry.target) index = i;
                });

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100); // 100ms stagger

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // -----------------------------------------------------------
    // 6. CONTACT FORM HANDLING
    // -----------------------------------------------------------
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const form = this;

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const submitButton = form.querySelector('button[type="submit"]');

            const renderFormMessage = (type, text) => {
                const existingMessages = form.querySelectorAll('.form-success, .form-error');
                existingMessages.forEach(msg => msg.remove());

                const messageDiv = document.createElement('div');
                messageDiv.className = type === 'error' ? 'form-error show' : 'form-success show';
                messageDiv.innerHTML = type === 'error'
                    ? `<i class="fas fa-triangle-exclamation"></i> ${text}`
                    : `<i class="fas fa-check-circle"></i> ${text}`;

                form.appendChild(messageDiv);

                setTimeout(() => {
                    messageDiv.classList.remove('show');
                    setTimeout(() => messageDiv.remove(), 300);
                }, 6000);
            };

            // Basic validation
            if (!name || !email || !message) {
                renderFormMessage('error', 'Please fill in all required fields.');
                return;
            }

            // Simple email format check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                renderFormMessage('error', 'Please enter a valid email address.');
                return;
            }

            // Check if form action is set to Formspree endpoint
            const formAction = form.getAttribute('action');
            if (!formAction || formAction === '#' || formAction.includes('YOUR_FORM_ID')) {
                renderFormMessage('error', 'Contact form is not configured yet. Please set your Formspree form ID in index.html.');
                return;
            }

            try {
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.dataset.originalText = submitButton.innerHTML;
                    submitButton.innerHTML = 'Sending...';
                }

                const response = await fetch(formAction, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (response.ok) {
                    renderFormMessage('success', 'Thank you! Your message has been sent. I\'ll get back to you soon.');
                    form.reset();
                } else {
                    renderFormMessage('error', 'Message failed to send. Please try again in a moment.');
                }
            } catch (error) {
                renderFormMessage('error', 'Network error. Please check your connection and try again.');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = submitButton.dataset.originalText || 'Shoot Message <i class="fas fa-paper-plane"></i>';
                }
            }
        });
    }


    // -----------------------------------------------------------
    // 7. MARQUEE: Pause on hover (accessibility)
    // -----------------------------------------------------------
    const marqueeTrack = document.querySelector('.marquee__track');
    if (marqueeTrack) {
        const marquee = marqueeTrack.closest('.marquee');
        marquee.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });
        marquee.addEventListener('mouseleave', () => {
            marqueeTrack.style.animationPlayState = 'running';
        });
    }


    // -----------------------------------------------------------
    // 8. GALLERY: Lightbox-style click (optional enhancement)
    // -----------------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery__item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                // Simple lightbox: open image in overlay
                const lightbox = document.createElement('div');
                lightbox.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(40,54,24,0.92); display: flex; align-items: center;
                    justify-content: center; z-index: 10000; cursor: pointer;
                    animation: fadeIn 0.3s ease;
                `;

                const lightboxImg = document.createElement('img');
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxImg.style.cssText = `
                    max-width: 90%; max-height: 90%; border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(40,54,24,0.55);
                `;

                lightbox.appendChild(lightboxImg);
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';

                lightbox.addEventListener('click', () => {
                    lightbox.style.opacity = '0';
                    lightbox.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        lightbox.remove();
                        document.body.style.overflow = '';
                    }, 300);
                });

                // Close on Escape
                const handleEsc = (e) => {
                    if (e.key === 'Escape') {
                        lightbox.click();
                        document.removeEventListener('keydown', handleEsc);
                    }
                };
                document.addEventListener('keydown', handleEsc);
            }
        });
    });


    // -----------------------------------------------------------
    // 9. STATS COUNTER ANIMATION
    // -----------------------------------------------------------
    const statNumbers = document.querySelectorAll('.stat__number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const match = text.match(/(\d+)/);

                if (match) {
                    const target = parseInt(match[1]);
                    const suffix = text.replace(match[1], '');
                    let current = 0;
                    const increment = target / 40;
                    const duration = 1500;
                    const stepTime = duration / 40;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = Math.floor(current) + suffix;
                    }, stepTime);
                }

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));


    // -----------------------------------------------------------
    // 10. TYPING EFFECT for hero title (subtle)
    // -----------------------------------------------------------
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transition = 'opacity 0.5s ease';
        }, 500);
    }


    // -----------------------------------------------------------
    // 11. PROJECTS: Dynamic details modal with gallery
    // -----------------------------------------------------------
    const projectModalGallery = document.getElementById('projectModalGallery');
    let allGalleryImages = [];
    let currentImageIndex = 0;
    let currentTitle = '';
    let totalGalleryCount = 0;
    let zoomOverlay = null;
    let zoomImage = null;

    function closeProjectModal() {
        if (!projectModal) return;
        closeZoomOverlay();
        projectModal.classList.remove('open');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function buildModalAction(label, href, classes) {
        const action = document.createElement('a');
        action.href = href;
        action.target = '_blank';
        action.rel = 'noopener';
        action.className = classes;
        action.textContent = label;
        return action;
    }

    function updateCounter() {
        const counter = projectModalGallery?.querySelector('.project-modal__counter');
        if (counter) {
            counter.textContent = (currentImageIndex + 1) + ' / ' + allGalleryImages.length;
        }
    }

    function ensureZoomOverlay() {
        if (zoomOverlay) return;

        zoomOverlay = document.createElement('div');
        zoomOverlay.className = 'project-modal__zoom';
        zoomOverlay.setAttribute('aria-hidden', 'true');

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'project-modal__zoom-close';
        closeBtn.setAttribute('aria-label', 'Close zoom preview');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';

        zoomImage = document.createElement('img');
        zoomImage.alt = 'Zoomed project image';

        zoomOverlay.appendChild(closeBtn);
        zoomOverlay.appendChild(zoomImage);
        document.body.appendChild(zoomOverlay);

        closeBtn.addEventListener('click', closeZoomOverlay);
        zoomOverlay.addEventListener('click', (event) => {
            if (event.target === zoomOverlay) closeZoomOverlay();
        });
    }

    function openZoomOverlay() {
        const mainImg = projectModalGallery?.querySelector('.project-modal__main-img img');
        if (!mainImg || !mainImg.src) return;

        ensureZoomOverlay();
        if (!zoomOverlay || !zoomImage) return;

        zoomImage.src = mainImg.src;
        zoomImage.alt = mainImg.alt || currentTitle + ' preview';
        zoomOverlay.classList.add('open');
        zoomOverlay.setAttribute('aria-hidden', 'false');
    }

    function closeZoomOverlay() {
        if (!zoomOverlay) return;
        zoomOverlay.classList.remove('open');
        zoomOverlay.setAttribute('aria-hidden', 'true');
    }

    function setMainImage(index) {
        if (index < 0 || index >= allGalleryImages.length) return;
        const mainImg = projectModalGallery?.querySelector('.project-modal__main-img img');
        if (!mainImg) return;

        const src = allGalleryImages[index];
        if (mainImg.src === src && currentImageIndex === index) return;

        // Animate the swap
        mainImg.classList.add('swapping');
        setTimeout(() => {
            mainImg.src = src;
            mainImg.alt = currentTitle + ' screenshot ' + (index + 1);
            mainImg.classList.remove('swapping');

            if (zoomOverlay?.classList.contains('open') && zoomImage) {
                zoomImage.src = src;
                zoomImage.alt = mainImg.alt;
            }
        }, 180);

        currentImageIndex = index;
        updateCounter();

        // Update active thumbnail
        projectModalGallery?.querySelectorAll('.project-modal__thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    function navigateGallery(direction) {
        let next = currentImageIndex + direction;
        if (next < 0) next = allGalleryImages.length - 1;
        if (next >= allGalleryImages.length) next = 0;
        setMainImage(next);
    }

    function buildGallery(images, title) {
        if (!projectModalGallery) return;
        projectModalGallery.innerHTML = '';
        totalGalleryCount = images.length;
        allGalleryImages = images.slice(0, 5);
        currentImageIndex = 0;
        currentTitle = title;

        // Fallback: no images
        if (allGalleryImages.length === 0) {
            projectModalGallery.classList.add('project-modal__gallery--single');
            const mainDiv = document.createElement('div');
            mainDiv.className = 'project-modal__main-img';
            const fallback = document.createElement('div');
            fallback.className = 'project-card__placeholder';
            fallback.style.cssText = 'position:absolute;inset:0;background:linear-gradient(135deg, var(--amber-dark) 0%, var(--amber) 100%);display:grid;place-items:center;';
            fallback.innerHTML = '<span style="text-align:center;color:#fff;"><i class="fas fa-image" style="font-size:2.5rem;margin-bottom:12px;"></i><br>Preview coming soon</span>';
            mainDiv.appendChild(fallback);
            projectModalGallery.appendChild(mainDiv);
            return;
        }

        const isSingle = allGalleryImages.length === 1;
        projectModalGallery.classList.toggle('project-modal__gallery--single', isSingle);

        // Main image container
        const mainDiv = document.createElement('div');
        mainDiv.className = 'project-modal__main-img';

        const mainImg = document.createElement('img');
        mainImg.src = allGalleryImages[0];
        mainImg.alt = title;
        mainImg.loading = 'eager';
        mainDiv.appendChild(mainImg);
        mainDiv.addEventListener('click', openZoomOverlay);

        // Prev / Next arrow buttons
        if (!isSingle) {
            const prevBtn = document.createElement('button');
            prevBtn.type = 'button';
            prevBtn.className = 'project-modal__nav project-modal__nav--prev';
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.setAttribute('aria-label', 'Previous image');
            prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateGallery(-1); });
            mainDiv.appendChild(prevBtn);

            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.className = 'project-modal__nav project-modal__nav--next';
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.setAttribute('aria-label', 'Next image');
            nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateGallery(1); });
            mainDiv.appendChild(nextBtn);

            // Counter badge "1 / 4"
            const counter = document.createElement('span');
            counter.className = 'project-modal__counter';
            counter.textContent = '1 / ' + allGalleryImages.length;
            mainDiv.appendChild(counter);
        }

        if (totalGalleryCount > allGalleryImages.length) {
            const moreBadge = document.createElement('span');
            moreBadge.className = 'project-modal__more';
            moreBadge.textContent = '+' + (totalGalleryCount - allGalleryImages.length) + ' more images';
            mainDiv.appendChild(moreBadge);
        }

        projectModalGallery.appendChild(mainDiv);

        // Thumbnail strip (all images including the first)
        if (!isSingle) {
            const thumbsDiv = document.createElement('div');
            thumbsDiv.className = 'project-modal__thumbs';

            allGalleryImages.forEach((src, i) => {
                const thumb = document.createElement('div');
                thumb.className = 'project-modal__thumb' + (i === 0 ? ' active' : '');
                const img = document.createElement('img');
                img.src = src;
                img.alt = title + ' screenshot ' + (i + 1);
                img.loading = 'lazy';
                thumb.appendChild(img);
                thumb.addEventListener('click', () => setMainImage(i));
                thumbsDiv.appendChild(thumb);
            });

            projectModalGallery.appendChild(thumbsDiv);
        }
    }

    function openProjectModal(card) {
        if (!projectModal || !card) return;

        const title = card.querySelector('.project-card__title')?.textContent?.trim() || 'Project';
        const description = card.querySelector('.project-card__desc')?.textContent?.trim() || 'No project details available yet.';
        const tags = Array.from(card.querySelectorAll('.project-card__tags .tag')).map(tag => tag.textContent.trim());
        const frontImage = card.querySelector('.project-card__image img');
        const deploymentLink = card.getAttribute('data-deployment-url')?.trim() || '';
        const extraImagesAttr = card.getAttribute('data-images')?.trim() || '';

        // Build image list: front image + any extras from data-images (comma-separated)
        const imageList = [];
        if (frontImage) imageList.push(frontImage.src);
        if (extraImagesAttr) {
            extraImagesAttr.split(',').forEach(src => {
                const trimmed = src.trim();
                if (trimmed) imageList.push(trimmed);
            });
        }

        // Build gallery (capped at 5)
        buildGallery(imageList, title);

        // Populate text content
        projectModalTitle.textContent = title;
        projectModalDescription.textContent = description;

        projectModalTags.innerHTML = '';
        tags.forEach(tagText => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = tagText;
            projectModalTags.appendChild(tag);
        });

        projectModalActions.innerHTML = '';
        if (deploymentLink) {
            projectModalActions.appendChild(buildModalAction('Deployment', deploymentLink, 'btn btn--red'));
            projectModalActions.style.display = 'flex';
        } else {
            projectModalActions.style.display = 'none';
        }

        projectModal.classList.add('open');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    if (projectCards.length && projectModal) {
        projectCards.forEach(card => {
            const detailsButton = card.querySelector('.project-card__details-btn');
            if (detailsButton) {
                detailsButton.addEventListener('click', () => openProjectModal(card));
            }
        });

        projectModal.addEventListener('click', (event) => {
            const isCloseTrigger = event.target.matches('[data-project-modal-close]') || event.target.closest('[data-project-modal-close]');
            if (isCloseTrigger) {
                closeProjectModal();
            }
        });

        if (projectModalClose) {
            projectModalClose.addEventListener('click', closeProjectModal);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (zoomOverlay?.classList.contains('open')) {
                    closeZoomOverlay();
                    return;
                }
                if (projectModal.classList.contains('open')) {
                    closeProjectModal();
                    return;
                }
            }
            // Arrow key navigation when modal is open
            if (projectModal.classList.contains('open') && allGalleryImages.length > 1) {
                if (event.key === 'ArrowLeft') navigateGallery(-1);
                if (event.key === 'ArrowRight') navigateGallery(1);
            }
        });
    }

});
