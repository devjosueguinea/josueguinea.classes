// Funcionalidades interactivas principales

// 1. Detectar página actual y resaltar el elemento del menú
document.addEventListener('DOMContentLoaded', function() {
    // Resaltar enlace activo (reforzamiento)
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Inicializar tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Animación de fade-in para el contenido
    const content = document.querySelector('.container');
    if (content && !content.classList.contains('fade-in')) {
        content.classList.add('fade-in');
    }

    // Función para marcar progreso de clase (si existe el elemento)
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        if (targetWidth) {
            setTimeout(() => {
                bar.style.width = targetWidth + '%';
                bar.setAttribute('aria-valuenow', targetWidth);
            }, 300);
        }
    });
});

// 2. Función para crear tarjetas de contenido dinámico
function createContentCard(title, content, className = '') {
    const card = document.createElement('div');
    card.className = `card ${className} mb-3`;
    card.innerHTML = `
        <div class="card-header">
            <h5 class="card-title mb-0">${title}</h5>
        </div>
        <div class="card-body">
            <p class="card-text">${content}</p>
        </div>
    `;
    return card;
}

// 3. Función para mostrar notificaciones
function showNotification(message, type = 'info', duration = 3000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.maxWidth = '400px';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    // Auto-dismiss
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, duration);
}

// 4. Función para manejar el progreso de estudio
function updateProgress(sectionId, progress) {
    const progressElement = document.querySelector(`#${sectionId} .progress-bar`);
    if (progressElement) {
        progressElement.style.width = progress + '%';
        progressElement.setAttribute('aria-valuenow', progress);
        progressElement.textContent = progress + '%';
        
        // Cambiar color según progreso
        if (progress < 30) {
            progressElement.className = 'progress-bar bg-danger';
        } else if (progress < 60) {
            progressElement.className = 'progress-bar bg-warning';
        } else if (progress < 90) {
            progressElement.className = 'progress-bar bg-info';
        } else {
            progressElement.className = 'progress-bar bg-success';
        }
        
        // Guardar en localStorage
        localStorage.setItem(`progress_${sectionId}`, progress);
    }
}

// 5. Cargar progreso guardado
function loadSavedProgress() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const sectionId = bar.closest('.progress-container')?.id;
        if (sectionId) {
            const savedProgress = localStorage.getItem(`progress_${sectionId}`);
            if (savedProgress !== null) {
                const progress = parseInt(savedProgress);
                bar.style.width = progress + '%';
                bar.setAttribute('aria-valuenow', progress);
                bar.textContent = progress + '%';
            }
        }
    });
}

// 6. Función interactiva para marcar conceptos importantes
function toggleImportant(element) {
    element.classList.toggle('bg-warning');
    element.classList.toggle('p-2');
    element.classList.toggle('rounded');
    
    if (element.classList.contains('bg-warning')) {
        showNotification('¡Concepto marcado como importante!', 'success', 1500);
    } else {
        showNotification('Importante removido', 'info', 1500);
    }
}

// 7. Función para buscar contenido (demo)
function searchContent(query) {
    const cards = document.querySelectorAll('.card');
    let results = 0;
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            card.style.display = 'block';
            card.style.border = '2px solid #0dcaf0';
            results++;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (results === 0) {
        showNotification('No se encontraron resultados', 'warning', 2000);
    } else {
        showNotification(`Se encontraron ${results} resultados`, 'info', 2000);
    }
}

// 8. Inicializar eventos
document.addEventListener('DOMContentLoaded', function() {
    loadSavedProgress();
    
    // Agregar event listener para elementos importantes
    document.querySelectorAll('.important-toggle').forEach(element => {
        element.addEventListener('click', function() {
            toggleImportant(this);
        });
    });
    
    // Si existe el botón de búsqueda
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = document.getElementById('search-input').value;
            if (query.trim()) {
                searchContent(query);
            }
        });
    }
});

// Exportar funciones para uso global
window.createContentCard = createContentCard;
window.showNotification = showNotification;
window.updateProgress = updateProgress;
window.toggleImportant = toggleImportant;
window.searchContent = searchContent;

console.log('✅ Sitio interactivo cargado correctamente');