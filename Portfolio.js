import { db } from './firebase.js'; 
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

function initLoader() {
    const loader = document.getElementById('loader');
    const progressBar = loader.querySelector('.loader-progress-bar');
    const loaderPercent = loader.querySelector('.loader-percentage');
    
    if (!loader || !progressBar) return;
    
    let progress = 0;
    const terminalLines = loader.querySelectorAll('.terminal-line');
    
    terminalLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
        }, index * 200);
    });
    
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: loader,
                        opacity: [1, 0],
                        duration: 500,
                        easing: 'easeInOutQuad',
                        complete: () => {
                            loader.classList.add('hidden');
                            initPageAnimations();
                        }
                    });
                } else {
                    loader.classList.add('hidden');
                    initPageAnimations();
                }
            }, 500);
        }
        
        progressBar.style.width = progress + '%';
        if (loaderPercent) {
            loaderPercent.textContent = Math.floor(progress) + '%';
        }
    }, 80);
}

function initMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 14, 26, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(text, x, y);
            
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function initParticles() {
    const container = document.getElementById('hackParticles');
    if (!container) return;
    
    const particleCount = 30;
    const chars = ['0', '1', '{', '}', '[', ']', '<', '>', '/', '*'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = chars[Math.floor(Math.random() * chars.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        container.appendChild(particle);
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const header = document.getElementById('header');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                const sections = document.querySelectorAll('section[id]');
                const scrollPos = window.scrollY + 200;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${sectionId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

function initPageAnimations() {
    setTimeout(() => {
        initHeroAnimations();
        initScrollAnimations();
    }, 300);
}

function initHeroAnimations() {
    if (typeof anime === 'undefined') return;
    
    const titleWords = document.querySelectorAll('.title-word');
    titleWords.forEach((word, index) => {
        anime({
            targets: word,
            opacity: [0, 1],
            translateY: [50, 0],
            delay: index * 200,
            duration: 1000,
            easing: 'easeOutExpo'
        });
    });
    
    const badge = document.querySelector('.hero-badge');
    if (badge) {
        anime({
            targets: badge,
            opacity: [0, 1],
            scale: [0.8, 1],
            delay: 300,
            duration: 800,
            easing: 'easeOutBack'
        });
    }
    
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        anime({
            targets: subtitle,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: 800,
            duration: 800,
            easing: 'easeOutExpo'
        });
    }
    
    const description = document.querySelector('.hero-description');
    if (description) {
        anime({
            targets: description,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: 1000,
            duration: 800,
            easing: 'easeOutExpo'
        });
    }
    
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length > 0) {
        anime({
            targets: statCards,
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(100, {start: 1200}),
            duration: 800,
            easing: 'easeOutExpo'
        });
    }
    
    const buttons = document.querySelectorAll('.hero-buttons .btn');
    if (buttons.length > 0) {
        anime({
            targets: buttons,
            opacity: [0, 1],
            scale: [0.8, 1],
            delay: anime.stagger(100, {start: 1800}),
            duration: 800,
            easing: 'easeOutBack'
        });
    }
    
    const monitor = document.querySelector('.security-monitor');
    if (monitor) {
        anime({
            targets: monitor,
            opacity: [0, 1],
            scale: [0.9, 1],
            rotate: [5, 0],
            delay: 1000,
            duration: 1200,
            easing: 'easeOutElastic(1, .8)'
        });
    }
    
    const floatIcons = document.querySelectorAll('.float-icon');
    if (floatIcons.length > 0) {
        anime({
            targets: floatIcons,
            opacity: [0, 1],
            scale: [0, 1],
            delay: anime.stagger(150, {start: 1500}),
            duration: 800,
            easing: 'easeOutBack'
        });
    }
}

function initScrollAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        try {
            gsap.registerPlugin(ScrollTrigger);
            
            gsap.utils.toArray('.section').forEach(section => {
                const header = section.querySelector('.section-header');
                if (header) {
                    gsap.from(header, {
                        opacity: 0,
                        y: -50,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        }
                    });
                }
            });
            
            gsap.utils.toArray('.service-card, .cert-card, .feature-card, .contact-card').forEach(card => {
                gsap.from(card, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            });
        } catch (e) {
            console.log('GSAP ScrollTrigger not available, using fallback');
            initScrollAnimationsFallback();
        }
    } else {
        initScrollAnimationsFallback();
    }
}

function initScrollAnimationsFallback() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [50, 0],
                        duration: 800,
                        easing: 'easeOutExpo'
                    });
                } else {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    const animateElements = document.querySelectorAll('.service-card, .cert-card, .feature-card, .contact-card, .section-header');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

function initStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count') || 0);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (typeof anime !== 'undefined') {
                        anime({
                            targets: { value: 0 },
                            value: target,
                            duration: 2000,
                            easing: 'easeOutExpo',
                            update: function(anim) {
                                stat.textContent = Math.floor(anim.animatables[0].target.value);
                            }
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (isActive) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });
        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
}

function initParallax() {
    const monitor = document.querySelector('.security-monitor');
    const floatIcons = document.querySelectorAll('.float-icon');
    
    if (!monitor) return;
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroSection = document.querySelector('.hero');
                const heroHeight = heroSection.offsetHeight;
                
                if (scrolled < heroHeight) {
                    const parallaxSpeed = 0.2;
                    const offset = scrolled * parallaxSpeed;
                    
                    if (monitor) {
                        monitor.style.transform = `translateY(${offset}px)`;
                    }
                    
                    floatIcons.forEach((icon, index) => {
                        const speed = 0.15 + (index * 0.05);
                        const iconOffset = scrolled * speed;
                        icon.style.transform = `translateY(${iconOffset}px)`;
                    });
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

function initScrollEffects() {
    const sections = document.querySelectorAll('.section');
    let useGSAP = false;
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        try {
            gsap.registerPlugin(ScrollTrigger);
            useGSAP = true;
            
            sections.forEach((section) => {
                const bg = section.querySelector('.section-bg');
                if (bg) {
                    gsap.set(bg, { y: 0, clearProps: 'transform' });
                    
                    gsap.to(bg, {
                        y: -20,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1,
                            invalidateOnRefresh: true,
                            onLeave: () => {
                                gsap.set(bg, { y: 0, clearProps: 'transform' });
                            },
                            onEnterBack: () => {
                                gsap.set(bg, { y: 0, clearProps: 'transform' });
                            },
                            onUpdate: (self) => {
                                if (self.progress === 0) {
                                    gsap.set(bg, { y: 0, clearProps: 'transform' });
                                } else if (self.progress === 1) {
                                    gsap.set(bg, { y: -20 });
                                }
                            }
                        }
                    });
                }
            });
            
            const scanLine = document.querySelector('.scan-line');
            if (scanLine) {
                gsap.to(scanLine, {
                    y: window.innerHeight * 2,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            }
        } catch (e) {
            console.log('GSAP ScrollTrigger error:', e);
            useGSAP = false;
        }
    }
    
    if (!useGSAP) {
        let ticking = false;
        
        function updateParallax() {
            sections.forEach(section => {
                const bg = section.querySelector('.section-bg');
                if (bg) {
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const sectionHeight = rect.height;
                    
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const viewportProgress = (windowHeight - rect.top) / (windowHeight + sectionHeight);
                        const progress = Math.max(0, Math.min(1, viewportProgress));
                        const maxOffset = 20;
                        const offset = progress * maxOffset;
                        bg.style.transform = `translateY(${offset}px)`;
                    } else if (rect.bottom < 0 || rect.top > windowHeight) {
                        bg.style.transform = 'translateY(0)';
                    }
                }
            });
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
        
        updateParallax();
        
        window.addEventListener('resize', () => {
            updateParallax();
        }, { passive: true });
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                const bg = entry.target.querySelector('.section-bg');
                if (bg && !useGSAP) {
                    bg.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    window.addEventListener('load', () => {
        sections.forEach(section => {
            const bg = section.querySelector('.section-bg');
            if (bg) {
                bg.style.transform = 'translateY(0)';
            }
        });
    });
}

function initLanguage() {
    const dirToggle = document.getElementById('dirToggle');
    
    const translations = [
        { pt: "Início", en: "Home" },
        { pt: "Projetos", en: "Projects" },
        { pt: "Sobre Mim", en: "About Me" },
        { pt: "Feedbacks", en: "Feedbacks" },
        { pt: "Certificações", en: "Certifications" },
        { pt: "Contato", en: "Contact" },
        { pt: "Seu nome", en: "Your name" },
        { pt: "Sua mensagem", en: "Your message" },
        { pt: "Deixe seu feedback", en: "Leave your feedback" },
        { pt: "Enviar", en: "Submit" },
        { pt: "Idioma", en: "Language" },
        { pt: " Desenvolvedor Full-Stack", en: " Full-Stack Developer" },
        { pt: " Desenvolvedor Backend", en: "BackEnd Developer" },
        { pt: " Padrões de Design", en: "Design Patterns" },
        { pt: "BEM VINDO", en: "WELCOME" },
        { pt: "AO MEU", en: "TO MY" },
        { pt: "AO MEU ", en: "TO MY " },
        { pt: "PORTIFÓLIO", en: "PORTFOLIO" },
        { pt: "Desenvolvimento Full-Stack", en: "Full-Stack Development" },
        { pt: "Design de API", en: "API Design" },
        { pt: "Arquitetura de Software", en: "Software Architecture" },
        
        // --- TEXTO HERO ATUALIZADO ---
        { pt: "Estudante de Engenharia de Software, com foco principal no desenvolvimento em Java. Possuo experiência em desenvolvimento Full-Stack (Spring Boot, React), automação de processos (RPA) e modelagem de dados (SQL). Atualmente, atuo na Agência Experimental da PUC Minas e no CRC - Centro de Recursos Computacionais, além de estar desenvolvendo um projeto dedicado a uma empresa de eventos musicais. Meu objetivo é criar lógicas de negócios complexas, resolver problemas do mundo real e construir soluções web robustas e inovadoras.", 
          en: "Software Engineering Student and Digital Game Programming Technician, with a primary focus on Java development. I have experience in Full-Stack development (Spring Boot, React), process automation (RPA), and data modeling (SQL). Currently, I work at the PUC Minas Experimental Agency and at CRC, in addition to developing a dedicated project for a music events company. My goal is to create complex business logic, solve real-world problems, and build robust and innovative web solutions." },

        { pt: "Anos de Experiência", en: "Years Experience" },
        { pt: "Recomendações", en: "Recommendations" },
        { pt: "Entre em contato", en: "Contact Me" },
        { pt: "Baixar Currículo", en: "Download Resume" },

        // --- TEXTOS SOBRE MIM ATUALIZADOS ---
        { pt: "Sou estudante de Engenharia de Software (PUC Minas) e desenvolvedor Full-stack com forte atuação no ecossistema de backend (Java, Spring Boot, Python). Tenho interesse em aprender sobre Desing Sistems, Arquitetura de Software e Desing Patterns, construindo sistemas que vão desde a automação corporativa até plataformas de impacto social.", 
          en: "I am a Software Engineering student (PUC Minas) and Full-stack developer with a strong focus on the backend ecosystem (Java, Spring Boot, Python). I have a problem-solving mindset and apply agile methodologies (SCRUM), building systems ranging from corporate automation to social impact platforms." },
        
        { pt: "🚀 O que eu construo e os impactos que gero", en: "🚀 What I build and the impacts I generate" },
        
        { pt: "Automação de Processos e RPA (MRV):", en: "Process Automation and RPA (MRV):" },
        { pt: "Desenvolvi scripts em Python e integrações com SAP S/4HANA.", 
        en: " Developed Python scripts and integrations with SAP S/4HANA." },
        { pt: "O que melhorou:", en: "What improved:" },
        { pt: "Eliminação de gargalos operacionais, reduzindo drasticamente a perda de tempo e a taxa de erros na esteira de produção.", en: "Elimination of operational bottlenecks, drastically reducing time loss and error rates in the production pipeline." },
        
        { pt: "IA e Transformação Digital (AES):", en: "AI and Digital Transformation (AES):" },
        { pt: "Atuei no desenvolvimento de uma IA para suporte técnico na MRV.", en: "Worked on developing an AI for technical support at MRV." },
        { pt: "Aprimoramento e otimização do processo de recebimento e controle tecnológico de concreto.", en: "Enhancement and optimization of the concrete receiving and technological control process." },
        
        { pt: "Plataformas Educacionais (\"Plantei\"):", en: "Educational Platforms (\"Plantei\"):" },
        { pt: "Criação de uma solução full-stack para o ambiente escolar.", en: "Creation of a full-stack solution for the school environment." },
        { pt: "Aumento direto no interesse e no engajamento dos alunos com os estudos.", en: "Direct increase in students' interest and engagement with their studies." },
        
        { pt: "🤝 Como eu trabalho", en: "🤝 How I work" },
        { pt: "Valorizo a comunicação eficaz, a colaboração em equipe e a organização do código. Gosto de aprender novos desafios tanto quando Desenhar requisitos junto a Product Owners ou estruturar novos sistemas, meu foco é sempre a qualidade da entrega e o aprendizado contínuo.", en: "I value effective communication, team collaboration, and code organization. Whether providing technical support to users, designing requirements with Product Owners, or structuring new systems, my focus is always on delivery quality and continuous learning." },
        
        // --- PROJETO ATUAL ---

        { pt: "Em Desenvolvimento", en: "Currently Building" },
        { pt: "Status: Coding...", en: "Status: Coding..." },
        { pt: "Plataforma de Eventos Musicais para a empresa Boteco do Hudson", en: "Music Events Company Platform for Boteco do Hudson" },
        { pt: "Desenvolvimento de um sistema completo dedicado à gestão e engajamento no cenário de eventos musicais. O objetivo é aplicar conceitos avançados de arquitetura backend, padrões de projeto Desenhos de Sistemas para criar uma aplicação robusta, escalável e de alta performance.", 
            en: "Development of a complete system dedicated to management and engagement in the music events scene. The goal is to apply advanced backend architecture concepts, design patterns, and System Design to create a robust, scalable, and high-performance application." },        { pt: "> Techs & Frameworks_", en: "> Techs & Frameworks_" },
        { pt: "Acessar Repositório Atual", en: "Access Current Repository" },
        { pt: "Microsserviços", en: "Microservices" },




        // --- CARDS ABOUT ---
        { pt: "Dados & Automação", en: "Data & Automation" },
        { pt: "Construção de lógicas de negócio e arquiteturas robustas utilizando Java, Spring Boot, Python e C/C++.", en: "Building business logic and robust architectures using Java, Spring Boot, Python, and C/C++." },
        { pt: "Modelagem de dados (SQL Server, PostgreSQL, MySQL, GCP) e automação de processos corporativos com RPA e SAP S/4HANA.", en: "Data modeling (SQL Server, PostgreSQL, MySQL, GCP) and corporate process automation with RPA and SAP S/4HANA." },
        { pt: "Desenvolvimento de interfaces modernas, dinâmicas e intuitivas utilizando React e JavaScript.", en: "Building modern, dynamic, and intuitive interfaces using React and JavaScript." },
        { pt: "Metodologias Ágeis", en: "Agile Methodologies" },
        { pt: "Trabalho colaborativo e entregas incrementais utilizando versionamento (Git/GitHub) e frameworks como SCRUM e Kanban.", en: "Collaborative work and incremental delivery using version control (Git/GitHub) and frameworks like SCRUM and Kanban." },

        // --- PROJETOS E DEMAIS INFOS ---
        { pt: "Busca personalizada de restaurantes com filtros inteligentes de culinária e preço.", en: "Personalized restaurant search with smart filters for cuisine and price." },
        { pt: "Calculadora de impacto ambiental em rotas brasileiras, desenvolvida com IA aplicada.", en: "Environmental impact calculator for Brazilian routes, developed with applied AI." },
        { pt: "Fundamentos de lógica de programação e estruturação de dados complexos em JSON.", en: "Fundamentals of programming logic and complex data structuring in JSON." },
        { pt: "Desenvolvimento de um sistema de gerenciamento para concessionária de veículos.", en: "Management system built for a vehicle dealership." },
        { pt: "Desenvolvimento de um sistema de gerenciamento para investimentos.", en: "Investment management system development." },
        { pt: "Plataforma de aprendizado sobre plantas e jardinagem. Desenvolvido para um cliente real.", en: "Learning platform about plants and gardening, built for a real client." },
        
        { pt: "Certificações", en: "Certifications" },
        { pt: "Lógica", en: "Logic" },
        { pt: "Lógica de Programação (27h)", en: "Programming Logic (27h)" },
        { pt: "Introdução ao Machine Learning", en: "Introduction to Machine Learning" },
        { pt: "Agência Experimental de Software", en: "Software Experimental Agency" }, 

        { pt: "Nome", en: "Name" },
        { pt: "E-mail", en: "Email" },
        { pt: "Telefone", en: "Phone" },
        { pt: "Localização", en: "Location" },
        { pt: "Assunto", en: "Subject" },
        { pt: "Mensagem", en: "Message" },
        { pt: "Enviar Mensagem", en: "Send Message" },
        { pt: "© 2026 João Pedro Moura Santos. Todos os direitos reservados.", en: "© 2026 João Pedro Moura Santos. All rights reserved." },
        
        { pt: "INICIALIZAÇÃO DO PROCESSO DE BUILD", en: "BUILD PROCESS INITIALIZATION" },
        { pt: "[INFO] Compilando módulos...", en: "[INFO] Compiling modules..." },
        { pt: "[INFO] Construindo backend Java/Spring Boot robusto: ", en: "[INFO] Building robust Java/Spring Boot backend: " },
        { pt: "[INFO] Otimizando assets do frontend Angular: ", en: "[INFO] Optimizing Angular frontend assets: " },
        { pt: "[SUCESSO] Sistema pronto. Iniciando aplicação.", en: "[SUCCESS] System ready. Launching application." },
        { pt: "ATIVO", en: "ACTIVE" },
        { pt: "ONLINE", en: "ONLINE" },
        { pt: "CONSOLE DO DESENVOLVEDOR", en: "DEVELOPER CONSOLE" }
    ];

    let currentLang = localStorage.getItem('lang') || 'en';

    function translatePage(lang) {
const elements = document.querySelectorAll('span, p, h1, h2, h3, h4, a, label, div, button, strong, em, li');        
        elements.forEach(el => {
            if (el.childNodes.length > 0) {
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        let text = node.textContent.trim();
                        if (text) {
                            const match = translations.find(t => t.pt === text || t.en === text);
                            if (match) {
                                node.textContent = node.textContent.replace(text, match[lang]);
                            }
                        }
                    }
                });
            }
        });
        
        // translate input/textarea placeholders
        const formElems = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        formElems.forEach(el => {
            const text = el.getAttribute('placeholder').trim();
            const match = translations.find(t => t.pt === text || t.en === text);
            if (match) {
                el.setAttribute('placeholder', match[lang]);
            }
        });
        
        const dirText = dirToggle?.querySelector('.dir-text');
        if (dirText) dirText.textContent = lang === 'pt' ? 'EN' : 'PT-BR';
    }

    translatePage(currentLang);

    if (dirToggle) {
        dirToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'pt' : 'en';
            localStorage.setItem('lang', currentLang);
            translatePage(currentLang);
            
            if (typeof anime !== 'undefined') {
                anime({
                    targets: dirToggle,
                    rotate: [0, 360],
                    duration: 500,
                    easing: 'easeInOutQuad'
                });
            }
        });
    }
}

function initFeedback() {
    const form = document.getElementById('feedbackForm');
    const listEl = document.getElementById('feedbackList');

    const feedbacksRef = collection(db, "feedbacks");

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
    }

    if (listEl) {
        const q = query(feedbacksRef, orderBy("date", "desc"));
        
        onSnapshot(q, (snapshot) => {
            let htmlContent = '';
            
            snapshot.forEach((doc) => {
                const f = doc.data();
                
                // O Firebase salva a data num formato especial (Timestamp). 
                // Precisamos converter de volta para texto legível.
                let dateStr = '';
                if (f.date && f.date.toDate) {
                    dateStr = f.date.toDate().toLocaleString();
                } else {
                    dateStr = 'Data indisponível'; 
                }

                htmlContent += `
                    <div class="feedback-item">
                        <div class="feedback-name">${escapeHtml(f.name || 'Anônimo')}</div>
                        <div class="feedback-date">${escapeHtml(dateStr)}</div>
                        <div class="feedback-text">${escapeHtml(f.message || '')}</div>
                    </div>
                `;
            });
            
            listEl.innerHTML = htmlContent;
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('feedbackName');
            const msgInput = document.getElementById('feedbackMessage');
            const name = nameInput.value.trim();
            const message = msgInput.value.trim();
            
            if (!name || !message) return;

            try {
                await addDoc(feedbacksRef, {
                    name: name,
                    message: message,
                    date: serverTimestamp() 
                });
                
                form.reset();
            } catch (error) {
                console.error("Erro ao enviar o feedback: ", error);
                alert("Poxa, deu um erro ao enviar seu feedback. Tente novamente!");
            }
        });
    }
}

function initHacksSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    const sliderProgress = document.getElementById('sliderProgress');
    const sliderIndicators = document.getElementById('sliderIndicators');
    const sliderViewport = document.querySelector('.slider-viewport');
    
    if (!sliderTrack || !prevBtn || !nextBtn) return;
    
    const slides = sliderTrack.querySelectorAll('.slider-slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let isTransitioning = false;
    
    if (totalSlidesEl) totalSlidesEl.textContent = String(totalSlides).padStart(2, '0');
    
    function createIndicators() {
        if (!sliderIndicators) return;
        sliderIndicators.innerHTML = '';
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'slider-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            sliderIndicators.appendChild(indicator);
        });
    }
    
    function updateSlider() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        const isRTL = document.documentElement.dir === 'rtl';
        const translateX = isRTL ? currentSlide * 100 : -currentSlide * 100;
        sliderTrack.style.transform = `translateX(${translateX}%)`;
        
        const viewportWidth = sliderViewport ? sliderViewport.offsetWidth : window.innerWidth;
        slides.forEach((slide) => {
            slide.style.width = `${viewportWidth}px`;
        });
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        if (currentSlideEl) {
            currentSlideEl.textContent = String(currentSlide + 1).padStart(2, '0');
        }
        
        if (sliderProgress) {
            sliderProgress.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
        }
        
        if (sliderIndicators) {
            const indicators = sliderIndicators.querySelectorAll('.slider-indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }
        
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
    
    function resizeSlider() {
        if (sliderViewport && sliderTrack) {
            const viewportWidth = sliderViewport.offsetWidth;
            slides.forEach((slide) => {
                slide.style.width = `${viewportWidth}px`;
            });
            updateSlider();
        }
    }
    
    window.addEventListener('resize', resizeSlider);
    
    function goToSlide(index) {
        if (isTransitioning || index === currentSlide || index < 0 || index >= totalSlides) return;
        currentSlide = index;
        updateSlider();
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
    });
    
    let autoSlideInterval;
    function startAutoSlide() {
        if (window.innerWidth <= 768) return;
        if (autoSlideInterval) return;
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    if (sliderViewport) {
        sliderViewport.addEventListener('mouseenter', stopAutoSlide);
        sliderViewport.addEventListener('mouseleave', startAutoSlide);
    }
    
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    
    if (sliderViewport) {
        sliderViewport.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
            stopAutoSlide();
        }, { passive: true });
        
        sliderViewport.addEventListener('touchmove', (e) => {
            if (isDragging) {
                touchEndX = e.touches[0].clientX;
            }
        }, { passive: true });
        
        sliderViewport.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isDragging = false;
            touchStartX = 0;
            touchEndX = 0;
        }, { passive: true });
    }
    
    window.addEventListener('resize', () => {
        stopAutoSlide();
        if (window.innerWidth > 768) {
            startAutoSlide();
        }
    });
    
    createIndicators();
    updateSlider();
    startAutoSlide();
}

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const closeModalBtn = document.getElementById('closeModal');
    const projectCards = document.querySelectorAll('.project-card');

    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const modalTechList = document.getElementById('modalTechList');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-description');
            const techs = card.getAttribute('data-tech').split(',');
            const imgSrc = card.getAttribute('data-gif');

            modalTitle.textContent = title;
            modalDescription.textContent = desc;
            modalImage.src = imgSrc;

            modalTechList.innerHTML = '';
            techs.forEach(tech => {
                const span = document.createElement('span');
                span.className = 'tech-tag';
                span.textContent = tech.trim();
                modalTechList.appendChild(span);
            });

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initMatrix();
    initParticles();
    initNavigation();
    initStats();
    initMobileMenu();
    initParallax();
    initScrollEffects();
    initLanguage(); 
    initFeedback();
    initHacksSlider();
    initProjectModal();
});

function initEmailJS() {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}


async function enviarEmail({ nome, email, mensagem }) {
  const templateParams = {
    from_name: nome,
    from_email: email,
    message: mensagem,
  };

  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceID,
      EMAILJS_CONFIG.templateID,
      templateParams
    );
    console.log("Email enviado com sucesso!", response.status, response.text);
    return { sucesso: true, mensagem: "Email enviado com sucesso!" };
  } catch (erro) {
    console.error("Erro ao enviar email:", erro);
    return { sucesso: false, mensagem: "Erro ao enviar. Tente novamente." };
  }
}

const EMAILJS_CONFIG = {
  serviceID: "service_l23vpl6",
  templateID: "template_csy41dh",
  publicKey: "zdpBnZG_sKiw_msOv",
};


emailjs.init(EMAILJS_CONFIG.publicKey);


const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const btn = contactForm.querySelector("button[type=submit]");
    const span = btn.querySelector("span"); 
    const originalText = span.textContent;

    btn.disabled = true;
    span.textContent = "Enviando...";


            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const assunto = document.getElementById("assunto").value;
            const mensagem = document.getElementById("mensagem").value;

    try {
      const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, assunto, mensagem })
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Mensagem enviada com sucesso!");
                    contactForm.reset();
                } else {
                    console.error("Erro detalhado do servidor:", result.error);
                    alert("Erro ao enviar mensagem: " + (result.error || "Tente novamente."));
                }
    } catch (err) {
   console.error("Erro na requisição:", err);
                alert("Ocorreu um erro ao enviar a mensagem. Verifique sua conexão.");
            } finally {
                btn.disabled = false;
                span.textContent = originalText;
    }

  });
}

