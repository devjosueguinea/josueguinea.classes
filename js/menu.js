// Menú dinámico que se inyecta en todas las páginas
(function() {
    // Configuración del menú
    const menuConfig = {
        brand: {
            name: '📚 Mis Clases',
            url: '../index.html'
        },
        items: [
            { name: 'Inicio', url: '../index.html', icon: 'bi-house-fill' },
            { name: 'Clase 1', url: 'clase1.html', icon: 'bi-book-fill' },
            { name: 'Clase 2', url: 'clase2.html', icon: 'bi-code-square' },
            { name: 'Clase 3', url: 'clase3.html', icon: 'bi-layers-fill' }
        ]
    };

    // Función para crear el menú
    function createMenu() {
        const currentPath = window.location.pathname;
        const isInClasesFolder = currentPath.includes('/clases/');
        
        // Ajustar rutas relativas
        const basePath = isInClasesFolder ? '../' : '';
        
        const menuHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container">
                    <a class="navbar-brand" href="${basePath}index.html">
                        <i class="bi bi-mortarboard-fill"></i> ${menuConfig.brand.name}
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto">
                            ${menuConfig.items.map(item => `
                                <li class="nav-item">
                                    <a class="nav-link ${isActive(item.url)}" href="${basePath}${item.url}">
                                        <i class="bi ${item.icon}"></i> ${item.name}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                        <span class="navbar-text text-light">
                            <i class="bi bi-person-circle"></i> Estudiante
                        </span>
                    </div>
                </div>
            </nav>
        `;
        
        return menuHTML;
    }

    // Función para verificar si el enlace está activo
    function isActive(url) {
        const currentPage = window.location.pathname.split('/').pop();
        const linkPage = url.split('/').pop();
        return currentPage === linkPage ? 'active' : '';
    }

    // Inyectar el menú
    document.addEventListener('DOMContentLoaded', function() {
        const menuContainer = document.getElementById('menu-container');
        if (menuContainer) {
            menuContainer.innerHTML = createMenu();
            
            // Agregar evento para cerrar el menú al hacer clic en un enlace (móvil)
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            const navbarCollapse = document.getElementById('navbarNav');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 992) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: false
                        });
                        bsCollapse.hide();
                    }
                });
            });
        }
    });
})();