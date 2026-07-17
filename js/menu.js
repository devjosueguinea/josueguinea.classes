document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. INYECTAR CSS (Sin comentarios para evitar alertas en el editor)
    // ==========================================
    const menuStyles = document.createElement('style');
    menuStyles.textContent = `
.menu-toggle {
    display: none;
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 1100;
    background: #4f46e5;
    color: white;
    border: none;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.sidebar-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

@media (max-width: 768px) {
    .menu-toggle {
        display: block;
    }
    .sidebar-overlay.active {
        display: block;
        opacity: 1;
        pointer-events: auto;
    }
    .sidebar {
        position: fixed;
        top: 0;
        left: -280px;
        width: 260px;
        height: 100vh;
        z-index: 1000;
        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }
    .sidebar.open {
        left: 0;
    }
    .app-container {
        padding-top: 70px;
    }
}
    `;
    document.head.appendChild(menuStyles);

    // ==========================================
    // 2. DEFINIR EL HTML DEL MENÚ
    // ==========================================
    const menuHTML = `
    <!-- Botón Hamburguesa -->
    <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú">
        <i class="bi bi-list"></i>
    </button>

    <!-- Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <aside class="sidebar" id="sidebar">
        <a href="#" class="sidebar-logo">
            <i class="bi bi-mortarboard-fill"></i>
            <span>Portal Académico</span>
        </a>
        <ul class="sidebar-nav">
            <li>
                <a href="index.html" class="sidebar-link" id="link-index">
                    <i class="bi bi-grid-1x2-fill"></i>
                    <span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="clases/redcom/redes-comunicaciones.html" class="sidebar-link" id="link-redes">
                    <i class="bi bi-wifi"></i>
                    <span>Redes</span>
                </a>
            </li>
            <li>
                <a href="clases/bdr/bases-datos-relacionales.html" class="sidebar-link" id="link-bdr">
                    <i class="bi bi-database-fill"></i>
                    <span>Bases de Datos I (SQL)</span>
                </a>
            </li>
            <li>
                <a href="clases/bd2/bases-datos-ii.html" class="sidebar-link" id="link-bd2">
                    <i class="bi bi-database"></i>
                    <span>Bases de Datos II (noSQL)</span>
                </a>
            </li>
            <li>
                <a href="#" class="sidebar-link" id="link-so">
                    <i class="bi bi-cpu"></i>
                    <span>Sistemas Op.</span>
                </a>
            </li>
            <li>
                <a href="clases/ads/ads.html" class="sidebar-link" id="link-ads">
                    <i class="bi bi-diagram-3"></i>
                    <span>Análisis y Diseño</span>
                </a>
            </li>
            <li>
                <a href="clases/poo/programacion-orientada-objetos.html" class="sidebar-link" id="link-poo">
                    <i class="bi bi-code-slash"></i>
                    <span>Prog. Objetos (POO)</span>
                </a>
            </li>
        </ul>
    </aside>
    `;

    // Buscamos el contenedor principal de la app
    const appContainer = document.querySelector('.app-container');
    
    if (appContainer) {
        // Inyectamos el menú
        appContainer.insertAdjacentHTML('afterbegin', menuHTML);
        
        // ==========================================
        // 3. COMPORTAMIENTO DEL MENÚ HAMBURGUESA
        // ==========================================
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (sidebar && menuToggle && sidebarOverlay) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                sidebarOverlay.classList.toggle('active');
                
                const icon = menuToggle.querySelector('i');
                if (sidebar.classList.contains('open')) {
                    icon.className = 'bi bi-x-lg';
                } else {
                    icon.className = 'bi bi-list';
                }
            });

            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
                menuToggle.querySelector('i').className = 'bi bi-list';
            });
        }
        
        // ==========================================
        // 4. LÓGICA DE RUTAS Y CLASE ACTIVA
        // ==========================================
        const currentPath = window.location.pathname;
        const links = appContainer.querySelectorAll('.sidebar-link');
        
        const depth = (currentPath.match(/\//g) || []).length;
        if (depth > 1) {
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    const stepsBack = "../".repeat(depth - 1);
                    link.setAttribute('href', stepsBack + href);
                }
            });
        }

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                const pageName = href.split('/').pop();
                if (currentPath.endsWith(pageName)) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
});