document.addEventListener("DOMContentLoaded", () => {
    // Definimos el HTML del menú manteniendo exactamente la estructura y clases originales
    const menuHTML = `
    <aside class="sidebar">
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
        // Inyectamos el menú al principio del contenedor para respetar la estructura CSS
        appContainer.insertAdjacentHTML('afterbegin', menuHTML);
        
        // --- LÓGICA DE RUTAS Y CLASE ACTIVA ---
        const currentPath = window.location.pathname;
        const links = appContainer.querySelectorAll('.sidebar-link');
        
        // 1. Corregir rutas relativas si estamos dentro de carpetas (ej. clases/redcom/)
        const depth = (currentPath.match(/\//g) || []).length;
        // Asumiendo que el proyecto corre en un entorno local o raíz de servidor
        // Si estás en subcarpetas de profundidad mayor a 1, adaptamos los enlaces:
        if (depth > 1) {
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    // Calculamos los niveles de retroceso necesarios (../)
                    const stepsBack = "../".repeat(depth - 1);
                    link.setAttribute('href', stepsBack + href);
                }
            });
        }

        // 2. Asignar dinámicamente la clase 'active' a la página actual
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                // Obtenemos solo el nombre del archivo final
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