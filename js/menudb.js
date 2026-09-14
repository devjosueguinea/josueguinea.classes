document.addEventListener("DOMContentLoaded", () => {
    // Evitar inyectar múltiples veces si ya existe
    if (!document.getElementById('class-floating-sidebar')) {
        const floatingMenuHTML = `
        <div class="class-floating-sidebar" id="class-floating-sidebar">
            <div class="sidebar-floating-header">
                <h6 class="text-muted fw-bold mb-0" style="font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase;">Clases Disponibles</h6>
                <button type="button" class="btn-close" id="close-floating-sidebar-btn" aria-label="Close" style="font-size: 0.8rem;"></button>
            </div>
            <div class="class-floating-sidebar-content">
                <ul class="class-list">
                    <li><a href="clase1db.html" class="class-item text-decoration-none"><i class="bi bi-journal-text"></i> <span class="class-item-text">Clase 1: Introducción a NoSQL</span></a></li>
                    <li><a href="clase2db.html" class="class-item text-decoration-none"><i class="bi bi-journal-text"></i> <span class="class-item-text">Clase 2: Creación de DBs</span></a></li>
                    <li><a href="clase3db.html" class="class-item text-decoration-none"><i class="bi bi-journal-text"></i> <span class="class-item-text">Clase 3: Operaciones de lectura</span></a></li>
                    <li><a href="clase4db.html" class="class-item text-decoration-none"><i class="bi bi-journal-text"></i> <span class="class-item-text">Clase 4: CRUD Completo</span></a></li>
                    <li><a href="clase5db.html" class="class-item text-decoration-none"><i class="bi bi-journal-text"></i> <span class="class-item-text">Clase 5: Consultas avanzadas</span></a></li>
                    <li><a href="clase7db.html" class="class-item text-decoration-none"><i class="bi bi-journal-text"></i> <span class="class-item-text">Clase 7: Aggregation Pipeline</span></a></li>
                    <li><a href="clase8db.html" class="class-item text-decoration-none"><i class="bi bi-journal-text"></i> <span class="class-item-text">Clase 8: Modelado de Datos</span></a></li>
                    <li><a href="clase9db.html" class="class-item text-decoration-none"><i class="bi bi-journal-text"></i> <span class="class-item-text">Clase 9: Claves de Partición y Sharding</span></a></li>
                    <li><a href="clase10db.html" class="class-item text-decoration-none"><i class="bi bi-journal-text"></i> <span class="class-item-text">Clase 10: Diseño de Esquemas para Casos Reales</span></a></li>
                </ul>
            </div>
        </div>
        <button type="button" class="class-fab-btn" id="class-fab-btn">
            <i class="bi bi-journal-bookmark-fill"></i>
            <span>Ver Clases</span>
        </button>
        `;
        document.body.insertAdjacentHTML('beforeend', floatingMenuHTML);
    }

    // Activar clase actual según la URL
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const links = document.querySelectorAll('#class-floating-sidebar .class-item');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPage === href || (currentPage === '' && href === 'clase1db.html') || (href && currentPath.includes(href))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Control de eventos con protección contra duplicación de manejadores
    const fab = document.getElementById('class-fab-btn');
    const sidebar = document.getElementById('class-floating-sidebar');
    const closeBtn = document.getElementById('close-floating-sidebar-btn');

    if (fab && sidebar && closeBtn && !fab.dataset.bound) {
        fab.dataset.bound = "true";
        fab.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('show');
            sidebar.classList.toggle('active');
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.remove('show');
            sidebar.classList.remove('active');
        });

        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('show') || sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && !fab.contains(e.target)) {
                    sidebar.classList.remove('show');
                    sidebar.classList.remove('active');
                }
            }
        });
    }
});
