/**
 * Agile Assembly — Premium Interactions
 * Lightweight, vanilla JavaScript for scroll reveals, mobile nav, and sticky header.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Header & Active Nav State
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        // Sticky Header Toggle
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Nav State based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 2. Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-links');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Change SVG icon based on state
            const isOpen = navMenu.classList.contains('active');
            menuToggle.innerHTML = isOpen 
                ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            });
        });
    }

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Stat Counter Animation
    const stats = document.querySelectorAll('.stat-num');
    let hasCounted = false;

    const startCounting = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target + '+';
                }
            };
            updateCounter();
        });
    };

    // Trigger counter when hero section is in view
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                startCounting();
                hasCounted = true;
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(heroSection);
    }
    // 6. Load Team Members from team.json
    const teamGrid = document.getElementById('team-grid');

    if (teamGrid) {
        fetch('team.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load team data');
                return response.json();
            })
            .then(members => {
                teamGrid.innerHTML = members.map((member, index) => {
                    const initials = member.name
                        .split(' ')
                        .map(w => w[0])
                        .join('')
                        .toUpperCase();

                    const isLeadership = member.designation.toLowerCase().includes('founder') || member.designation.toLowerCase().includes('director') || member.designation.toLowerCase().includes('cto');
                    const leadershipBadge = isLeadership ? '<div class="leadership-badge">Leadership</div>' : '';
                    const cardClass = isLeadership ? 'glass-card team-member leadership-card' : 'glass-card team-member';

                    const skillsHTML = member.skills
                        .map(skill => `<span class="member-chip">${skill}</span>`)
                        .join('');

                    const photoHTML = member.photo
                        ? `<img src="${member.photo}" alt="${member.name}" class="member-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                           <div class="member-avatar" style="display: none;">${initials}</div>`
                        : `<div class="member-avatar">${initials}</div>`;

                    const linkedinHTML = member.linkedin && member.linkedin !== 'https://linkedin.com/in/'
                        ? `<a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" class="member-linkedin" aria-label="LinkedIn profile of ${member.name}">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                           </a>`
                        : '';

                    return `
                        <div class="${cardClass}" style="animation-delay: ${index * 0.08}s;">
                            ${leadershipBadge}
                            <div class="member-photo-wrapper">
                                ${photoHTML}
                            </div>
                            <h4 class="member-name">${member.name}</h4>
                            <span class="member-role">${member.designation}</span>
                            <div class="member-skills">${skillsHTML}</div>
                            ${linkedinHTML}
                        </div>
                    `;
                }).join('');

                // Re-observe the team grid for reveal animation
                revealObserver.observe(teamGrid);
            })
            .catch(error => {
                console.warn('Team data could not be loaded:', error);
                teamGrid.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">Team information is being updated. Check back soon.</p>';
            });
    }
});
