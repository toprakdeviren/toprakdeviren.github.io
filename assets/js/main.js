(function () {
    const savedTheme = localStorage.getItem('theme');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDarkScheme.matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    const themeToggleButton = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                applyTheme('light');
            } else {
                applyTheme('dark');
            }
        });
    } else {
        console.warn("Theme toggle button (#theme-toggle) not found in the DOM.");
    }

    prefersDarkScheme.addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
        }
    });

    class SiteNavbar extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
            const currentPath = window.location.pathname;

            const isHomePage = currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.split('/').pop() === '';
            const isAboutPage = currentPath.includes('about.html');
            const basePath = this.getRelativePath();

            this.shadowRoot.innerHTML = `
                <style>
                    /* CSS Variables from the global scope are accessible in Shadow DOM */
                    :host {
                        display: block;
                    }
                    .main-nav {
                        display: flex;
                        justify-content: center;
                        /* Removed padding-top, let container handle spacing */
                        gap: 1.5rem; /* Use rem */
                        margin-bottom: 1.5rem; /* Add some bottom margin */
                    }
                    .nav-item {
                        color: var(--nav-link-color, #666); /* Fallback color */
                        text-decoration: none;
                        font-size: 0.95rem;
                        font-weight: 500;
                        padding: 0.5rem 0;
                        transition: color 0.2s ease;
                        position: relative;
                        border-bottom: 2px solid transparent; /* Placeholder for underline */
                    }
                    .nav-item:hover {
                        color: var(--nav-link-active-color, #111);
                        border-bottom-color: transparent; /* Prevent hover underline if not active */
                    }
                    .nav-item.active {
                        color: var(--nav-link-active-color, #111);
                        border-bottom-color: var(--nav-active-border-color, #111); /* Use border instead of pseudo-element */
                    }
                   /* Removed :after pseudo-element style */

                </style>

                <nav class="main-nav">
                    <a href="${basePath}index.html" class="nav-item ${isHomePage ? 'active' : ''}">Home</a>
                    <a href="${basePath}about.html" class="nav-item ${isAboutPage ? 'active' : ''}">About</a>
                </nav>
            `;
        }

        getRelativePath() {
            if (window.location.pathname.includes('/posts/')) {
                return '../';
            }

            return './';
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
            const basePath = this.getRelativePath();

            this.shadowRoot.innerHTML = `
                <style>
                    /* CSS Variables from the global scope are accessible in Shadow DOM */
                    :host {
                        display: block;
                        padding-top: 3rem; /* Moved padding here */
                        margin-bottom: 3rem; /* Moved margin here */
                    }
                    header.site-header { /* Use a class or tag inside shadow DOM */
                        text-align: center;
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
                        max-width: 450px; /* Limit subtitle width */
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .social-links {
                        display: flex;
                        justify-content: center;
                        gap: 1.5rem;
                        margin-bottom: 2rem;
                    }
                     .social-links a {
                         display: inline-block; /* Ensure links behave correctly */
                         line-height: 0; /* Prevent extra space below icons */
                     }
                    .social-icon {
                        width: 22px;
                        height: 22px;
                        filter: var(--icon-filter-color, invert(60%));
                        transition: filter 0.2s ease, transform 0.2s ease;
                    }
                    .social-links a:hover .social-icon {
                         filter: var(--social-icon-hover-color, invert(30%)); /* Use hover variable */
                         transform: scale(1.1); /* Add subtle scale on hover */
                    }
                    /* Dark mode hover handled by variable change */

                    .back-link {
                        display: inline-flex; /* Use flex for icon alignment */
                        align-items: center;
                        color: var(--nav-link-color, #666);
                        text-decoration: none;
                        transition: color 0.2s ease;
                        margin-top: 1rem;
                        font-weight: 500;
                        font-size: 0.95rem;
                    }
                    .back-link:hover {
                        color: var(--nav-link-active-color, #111);
                        text-decoration: underline;
                    }
                    .back-link svg { /* Style for the inline SVG */
                         margin-right: 6px;
                         /* vertical-align: -2px; (No longer needed with flex) */
                         stroke: currentColor; /* Inherit color */
                    }
                    @media (max-width: 768px) {
                        .site-title { font-size: 2rem; }
                        .subtitle { font-size: 1rem; }
                    }
                </style>

                <header class="site-header">
                    <h1 class="site-title">Uğur Toprakdeviren</h1>
                    <p class="subtitle">${subtitle}</p>
                    <div class="social-links">
                        <a href="https://github.com/toprakdeviren" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <img src="${basePath}assets/icons/github.svg" alt="GitHub" class="social-icon">
                        </a>
                        <a href="https://x.com/toprakdevos" target="_blank" rel="noopener noreferrer" aria-label="X">
                            <img src="${basePath}assets/icons/x.svg" alt="X" class="social-icon">
                        </a>
                        <a href="mailto:mail@thread.ist" aria-label="Email">
                            <img src="${basePath}assets/icons/email.svg" alt="Email" class="social-icon">
                        </a>
                    </div>
                    ${isBlogPost ? `<a href="${basePath}index.html" class="back-link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg> All Posts</a>` : ''}
                </header>
            `;
        }

        getRelativePath() {
            if (window.location.pathname.includes('/posts/')) {
                return '../';
            }
            return './';
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
                    footer { /* Style the element inside Shadow DOM */
                        margin-top: 5rem;
                        padding-top: 2rem;
                        border-top: 1px solid var(--border-color, #eee);
                        text-align: center;
                        color: var(--footer-color, #888);
                        font-size: 0.9rem;
                        padding-bottom: 1rem; /* Add some bottom padding */
                    }
                </style>

                <footer>
                    <p>© ${year} Uğur Toprakdeviren. All rights reserved.</p>
                </footer>
            `;
        }
    }

    if (!customElements.get('site-navbar')) {
        customElements.define('site-navbar', SiteNavbar);
    }

    if (!customElements.get('site-header')) {
        customElements.define('site-header', SiteHeader);
    }

    if (!customElements.get('site-footer')) {
        customElements.define('site-footer', SiteFooter);
    }
});