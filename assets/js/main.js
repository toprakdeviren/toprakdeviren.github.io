(function () {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDarkScheme.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const switchWrapper = document.createElement('div');
    switchWrapper.className = 'theme-toggle';
    
    switchWrapper.innerHTML = `
        <button id="theme-toggle" aria-label="Toggle dark mode">
            <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        </button>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        #theme-toggle {
            background-color: var(--bg-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            outline: none;
        }
        
        #theme-toggle:hover {
            transform: scale(1.1);
        }
        
        .sun-icon {
            display: none;
        }
        
        .moon-icon {
            display: block;
        }
        
        [data-theme="dark"] .sun-icon {
            display: block;
        }
        
        [data-theme="dark"] .moon-icon {
            display: none;
        }
        
        @media (max-width: 768px) {
            .theme-toggle {
                top: 10px;
                right: 10px;
            }
            
            #theme-toggle {
                width: 35px;
                height: 35px;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(switchWrapper);

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        if (prefersDarkScheme.matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }
    
    document.getElementById('theme-toggle').addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });
    
    prefersDarkScheme.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        }
    });
});

class SiteNavbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        const currentPath = window.location.pathname;
        const isHomePage = currentPath === '/' || currentPath.endsWith('index.html');
        const isAboutPage = currentPath.includes('about.html');
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .main-nav {
                    display: flex;
                    justify-content: center;
                    padding: 1.5rem 0 0;
                    gap: 1.5rem;
                }
                
                .nav-item {
                    color: var(--nav-link-color, #666);
                    text-decoration: none;
                    font-size: 0.95rem;
                    font-weight: 500;
                    padding: 0.5rem 0;
                    transition: color 0.2s ease;
                    position: relative;
                }
                
                .nav-item:hover {
                    color: var(--nav-link-active-color, #111);
                }
                
                .nav-item.active {
                    color: var(--nav-link-active-color, #111);
                }
                
                .nav-item.active:after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 20px;
                    height: 2px;
                    background-color: var(--nav-active-border-color, #111);
                }
            </style>
            
            <nav class="main-nav">
                <a href="${this.getRelativePath()}index.html" class="nav-item ${isHomePage ? 'active' : ''}">Home</a>
                <a href="${this.getRelativePath()}about.html" class="nav-item ${isAboutPage ? 'active' : ''}">About</a>
            </nav>
        `;
    }
    
    getRelativePath() {
        const path = window.location.pathname;
        if (path.includes('/posts/')) {
            return '../';
        }
        return '';
    }
}

class SiteHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        const isBlogPost = window.location.pathname.includes('/posts/');
        
        const subtitle = this.getAttribute('subtitle') || "E2E Encryption Researcher | Secure Messaging Architect";

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                header.site-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    padding-top: 3rem;
                }
                
                .site-title {
                    font-size: 2.5rem;
                    font-weight: 600;
                    letter-spacing: -0.025em;
                    margin-bottom: 0.5rem;
                    color: var(--header-color, #111);
                }
                
                .subtitle {
                    font-size: 1.1rem;
                    font-weight: 400;
                    color: var(--subtitle-color, #666);
                    margin-bottom: 1.5rem;
                }
                
                .social-links {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .social-icon {
                    width: 22px;
                    height: 22px;
                    filter: var(--svg-filter-color, invert(60%));
                    transition: filter 0.2s ease;
                }
                
                .social-links a:hover .social-icon {
                    filter: invert(30%);
                }
                
                .back-link {
                    display: inline-block;
                    color: var(--nav-link-color, #666);
                    text-decoration: none;
                    transition: color 0.2s ease;
                    margin-top: 1rem;
                    font-weight: 500;
                    font-size: 0.95rem;
                }
                
                .back-link:hover {
                    color: var(--nav-link-active-color, #111);
                }
                
                .back-link i {
                    margin-right: 6px;
                }
            </style>
            
            <header class="site-header">
                <h1 class="site-title">Uğur Toprakdeviren</h1>
                <p class="subtitle">${subtitle}</p>
                <div class="social-links">
                    <a href="https://github.com/toprakdeviren" target="_blank" aria-label="GitHub">
                        <img src="${this.getRelativePath()}assets/icons/github.svg" alt="GitHub" class="social-icon">
                    </a>
                    <a href="https://x.com/toprakdevos" target="_blank" aria-label="X">
                        <img src="${this.getRelativePath()}assets/icons/x.svg" alt="X" class="social-icon">
                    </a>
                    <a href="mailto:mail@thread.ist" aria-label="Email">
                        <img src="${this.getRelativePath()}assets/icons/email.svg" alt="Email" class="social-icon">
                    </a>
                </div>
                ${isBlogPost ? '<a href="../index.html" class="back-link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; vertical-align: -2px;"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg> All Posts</a>' : ''}
            </header>
        `;
    }
    
    getRelativePath() {
        const path = window.location.pathname;
        if (path.includes('/posts/')) {
            return '../';
        }
        return '';
    }
}

class SiteFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        const year = this.getAttribute('year') || new Date().getFullYear();
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                footer {
                    margin-top: 5rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border-color, #eee);
                    text-align: center;
                    color: var(--footer-color, #888);
                    font-size: 0.9rem;
                }
            </style>
            
            <footer>
                <p>&copy; ${year} Uğur Toprakdeviren. All rights reserved.</p>
            </footer>
        `;
    }
}

customElements.define('site-navbar', SiteNavbar);
customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);