// Funcionalidades interactivas principales para la plataforma de clases

document.addEventListener('DOMContentLoaded', function() {
    // === 1. CONTROL DE TEMA (CLARO / OSCURO) ===
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    
    // Obtener tema preferido guardado o el valor por defecto
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.className = 'bi bi-sun-fill';
        } else {
            themeIcon.className = 'bi bi-moon-fill';
        }
    }

    // === 2. NAVEGACIÓN LATERAL DE CLASES ===
    const classItems = document.querySelectorAll('.class-item');
    const classDetailSections = document.querySelectorAll('.class-detail-section');
    const subjectSidebar = document.getElementById('subject-sidebar');
    const fabMenuBtn = document.getElementById('fab-menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    // Toggle para el menú flotante
    if (fabMenuBtn && subjectSidebar) {
        fabMenuBtn.addEventListener('click', () => {
            subjectSidebar.classList.toggle('show');
        });
    }

    if (closeSidebarBtn && subjectSidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            subjectSidebar.classList.remove('show');
        });
    }

    classItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Si el clic fue en el checkbox, no cambiar de pestaña aquí (se maneja por separado)
            if (e.target.closest('.class-checkbox')) return;

            const classId = this.getAttribute('data-class-id');
            
            // Desactivar todos los items del menú lateral
            classItems.forEach(i => i.classList.remove('active'));
            // Activar el seleccionado
            this.classList.add('active');

            // Ocultar todas las secciones de detalle
            classDetailSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección correspondiente
            const targetSection = document.getElementById(`${classId}-detail`);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Ocultar el menú flotante tras seleccionar clase
            if (subjectSidebar) {
                subjectSidebar.classList.remove('show');
            }
        });
    });

    // === 3. CHECKBOXES DE COMPLETADO Y CÁLCULO DE PROGRESO ===
    const checkboxes = document.querySelectorAll('.class-checkbox');
    
    // Cargar estado inicial de checkboxes y progreso al iniciar
    initCheckboxesAndProgress();

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const key = this.getAttribute('data-class-key');
            const isChecked = this.classList.contains('checked');
            
            if (isChecked) {
                this.classList.remove('checked');
                this.querySelector('.bi-check-lg').classList.add('d-none');
                localStorage.setItem(key, 'false');
            } else {
                this.classList.add('checked');
                this.querySelector('.bi-check-lg').classList.remove('d-none');
                localStorage.setItem(key, 'true');
            }

            // Recalcular el progreso de la materia actual
            calculateSubjectProgress();
        });
    });

    function initCheckboxesAndProgress() {
        checkboxes.forEach(checkbox => {
            const key = checkbox.getAttribute('data-class-key');
            const savedState = localStorage.getItem(key);
            
            if (savedState === 'true') {
                checkbox.classList.add('checked');
                const checkIcon = checkbox.querySelector('.bi-check-lg');
                if (checkIcon) {
                    checkIcon.classList.remove('d-none');
                }
            } else {
                checkbox.classList.remove('checked');
                const checkIcon = checkbox.querySelector('.bi-check-lg');
                if (checkIcon) {
                    checkIcon.classList.add('d-none');
                }
            }
        });

        // Calcular el progreso inicial de la materia actual si estamos en una vista de materia
        calculateSubjectProgress();

        // Si estamos en el Dashboard index.html, actualizar los componentes visuales
        if (document.getElementById('subjects-container')) {
            updateDashboardProgress();
        }
    }

    function calculateSubjectProgress() {
        // Determinar qué materia es según los checkboxes presentes
        const bd2Checkboxes = document.querySelectorAll('[data-class-key^="bd2_"]');
        const redesCheckboxes = document.querySelectorAll('[data-class-key^="redes_"]');

        if (bd2Checkboxes.length > 0) {
            let completed = 0;
            bd2Checkboxes.forEach(cb => {
                if (cb.classList.contains('checked')) completed++;
            });
            const progress = Math.round((completed / bd2Checkboxes.length) * 100);
            localStorage.setItem('progress_bd2', progress);
        }

        if (redesCheckboxes.length > 0) {
            let completed = 0;
            redesCheckboxes.forEach(cb => {
                if (cb.classList.contains('checked')) completed++;
            });
            const progress = Math.round((completed / redesCheckboxes.length) * 100);
            localStorage.setItem('progress_redes', progress);
        }
    }

    function updateDashboardProgress() {
        // Recuperar porcentajes
        const progressBd2 = localStorage.getItem('progress_bd2') || 0;
        const progressRedes = localStorage.getItem('progress_redes') || 0;

        // Actualizar barras de progreso y textos en Dashboard
        const progressBarBd2 = document.getElementById('progress-bar-bd2');
        const progressTextBd2 = document.getElementById('progress-text-bd2');
        if (progressBarBd2 && progressTextBd2) {
            progressBarBd2.style.width = `${progressBd2}%`;
            progressTextBd2.textContent = `${progressBd2}%`;
        }

        const progressBarRedes = document.getElementById('progress-bar-redes');
        const progressTextRedes = document.getElementById('progress-text-redes');
        if (progressBarRedes && progressTextRedes) {
            progressBarRedes.style.width = `${progressRedes}%`;
            progressTextRedes.textContent = `${progressRedes}%`;
        }

        // Calcular y actualizar total de temas completados
        let totalCompleted = 0;
        const keys = ['bd2_clase1', 'bd2_clase2', 'bd2_clase3', 'bd2_clase4', 'bd2_clase5', 
                      'redes_clase1', 'redes_clase2', 'redes_clase3', 'redes_clase4', 'redes_clase5'];
        
        keys.forEach(k => {
            if (localStorage.getItem(k) === 'true') {
                totalCompleted++;
            }
        });

        const totalStatsElement = document.getElementById('total-completed-stats');
        if (totalStatsElement) {
            totalStatsElement.textContent = `${totalCompleted} / 10`;
        }
    }

    // === 4. BÚSQUEDA DE MATERIAS EN EL DASHBOARD ===
    const searchInput = document.getElementById('dashboard-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const subjectWrappers = document.querySelectorAll('.subject-card-wrapper');
            
            subjectWrappers.forEach(wrapper => {
                const title = wrapper.getAttribute('data-subject-title') || '';
                if (title.includes(query)) {
                    wrapper.style.display = 'block';
                } else {
                    wrapper.style.display = 'none';
                }
            });
        });
    }

    // === 5. MENÚ FLOTANTE EN VISTA DE CLASE DETALLE ===
    const classFabBtn = document.getElementById('class-fab-btn');
    const classFloatingSidebar = document.getElementById('class-floating-sidebar');
    const closeFloatingSidebarBtn = document.getElementById('close-floating-sidebar-btn');

    if (classFabBtn && classFloatingSidebar) {
        classFabBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            classFloatingSidebar.classList.toggle('show');
        });
    }

    if (closeFloatingSidebarBtn && classFloatingSidebar) {
        closeFloatingSidebarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            classFloatingSidebar.classList.remove('show');
        });
    }

    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', (e) => {
        if (classFloatingSidebar && classFloatingSidebar.classList.contains('show')) {
            if (!classFloatingSidebar.contains(e.target) && e.target !== classFabBtn && !classFabBtn.contains(e.target)) {
                classFloatingSidebar.classList.remove('show');
            }
        }
    });

    // Activar clase desde parámetro URL (ej: ?class=clase2)
    const urlParams = new URLSearchParams(window.location.search);
    const classParam = urlParams.get('class');
    if (classParam) {
        const targetItem = document.querySelector(`.class-item[data-class-id="${classParam}"]`);
        if (targetItem) {
            targetItem.click();
        }
    }
});