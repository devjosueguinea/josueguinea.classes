/**
 * menu.js - Generador dinámico del Menú Flotante de Clases
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Estructura HTML del Menú Flotante y el Botón FAB
    const floatingMenuHTML = `
    <!-- Menú Flotante de Clases (Inyectado dinámicamente) -->
    <div class="class-floating-sidebar" id="class-floating-sidebar">
        <div class="sidebar-floating-header">
            <h6 class="text-muted fw-bold mb-0"
                style="font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase;">Clases Disponibles</h6>
            <button type="button" class="btn-close" id="close-floating-sidebar-btn" aria-label="Close"
                style="font-size: 0.8rem;"></button>
        </div>
        <div class="class-floating-sidebar-content">
            <ul class="class-list">
                <li>
                    <a href="clase1redes.html" class="class-item text-decoration-none">
                        <i class="bi bi-journal-text"></i>
                        <span class="class-item-text" title="Clase 1: Introducción a las redes y CISCO">Clase 1: Introducción a las redes y CISCO</span>
                    </a>
                </li>
                <li>
                    <a href="clase2redes.html" class="class-item text-decoration-none">
                        <i class="bi bi-journal-text"></i>
                        <span class="class-item-text" title="Clase 2: Anatomía de las redes informáticas">Clase 2: Anatomía de las redes informáticas</span>
                    </a>
                </li>
                <li>
                    <a href="clase3redes.html" class="class-item text-decoration-none">
                        <i class="bi bi-journal-text"></i>
                        <span class="class-item-text" title="Clase 3: Direccionamiento IPv4">Clase 3: Direccionamiento IPv4</span>
                    </a>
                </li>
                <li>
                    <a href="clase4redes.html" class="class-item text-decoration-none">
                        <i class="bi bi-journal-text"></i>
                        <span class="class-item-text" title="Clase 4: Direccionamiento IPv4 (Parte II)">Clase 4: Direccionamiento IPv4 (Parte II)</span>
                    </a>
                </li>
                <li>
                    <a href="clase5redes.html" class="class-item text-decoration-none">
                        <i class="bi bi-journal-text"></i>
                        <span class="class-item-text" title="Clase 5: Retroalimentación">Clase 5: Retroalimentación</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>

    <!-- Botón Flotante FAB (Inyectado dinámicamente) -->
    <button type="button" class="class-fab-btn" id="class-fab-btn">
        <i class="bi bi-journal-bookmark-fill"></i>
        <span>Ver Clases</span>
    </button>
    `;

    // 2. Inyectar el bloque de código al final de la etiqueta <body>
    document.body.insertAdjacentHTML('beforeend', floatingMenuHTML);

    // 3. Capturar elementos del DOM del menú inyectado
    const fabBtn = document.getElementById('class-fab-btn');
    const sidebar = document.getElementById('class-floating-sidebar');
    const closeBtn = document.getElementById('close-floating-sidebar-btn');

    // 4. Lógica de apertura y cierre
    if (fabBtn && sidebar && closeBtn) {
        // Abrir menú al pulsar el botón flotante
        fabBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.add('active');
        });

        // Cerrar menú al presionar la "X"
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });

        // Cerrar el menú si el usuario hace clic en cualquier lugar fuera de él
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !fabBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    // 5. Automatización de la clase "active" según la URL del navegador
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const menuLinks = document.querySelectorAll('.class-floating-sidebar .class-item');

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Removemos la clase active por defecto para evitar redundancias
        link.classList.remove('active');

        // Si el enlace coincide con el archivo actual en la URL, se le asigna la clase active
        if (currentPage === linkHref || (currentPage === '' && linkHref === 'clase1redes.html')) {
            link.classList.add('active');
        }
    });
});