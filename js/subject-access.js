(function () {
    'use strict';

    const config = window.ACCESS_CONFIG || {};
    const isConfigured = Boolean(
        config.supabaseUrl &&
        config.supabaseAnonKey &&
        !config.supabaseUrl.startsWith('REEMPLAZAR_') &&
        !config.supabaseAnonKey.startsWith('REEMPLAZAR_')
    );

    const supabaseClient = isConfigured && window.supabase
        ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
            auth: { persistSession: false }
        })
        : null;

    const accessModalElement = document.getElementById('subject-access-modal');
    const teacherModalElement = document.getElementById('teacher-pin-modal');
    if (!accessModalElement || !teacherModalElement) return;

    const accessModal = bootstrap.Modal.getOrCreateInstance(accessModalElement);
    const teacherModal = bootstrap.Modal.getOrCreateInstance(teacherModalElement);
    const accessForm = document.getElementById('subject-access-form');
    const accessPin = document.getElementById('subject-access-pin');
    const accessError = document.getElementById('subject-access-error');
    const accessSubmit = document.getElementById('subject-access-submit');
    const accessSubjectName = document.getElementById('subject-access-name');
    const teacherButton = document.getElementById('teacher-pin-button');
    const teacherLoginForm = document.getElementById('teacher-login-form');
    const teacherPinForm = document.getElementById('teacher-pin-form');
    const teacherSession = document.getElementById('teacher-session');
    const teacherError = document.getElementById('teacher-pin-error');
    const teacherSuccess = document.getElementById('teacher-pin-success');
    const teacherLogout = document.getElementById('teacher-logout');
    let pendingSubject = null;

    function showMessage(element, message) {
        element.textContent = message;
        element.classList.remove('d-none');
    }

    function hideMessage(element) {
        element.textContent = '';
        element.classList.add('d-none');
    }

    function setLoading(button, loading, label) {
        button.disabled = loading;
        button.innerHTML = loading
            ? '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Verificando...'
            : label;
    }

    document.querySelectorAll('.subject-link[data-subject-id]').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            pendingSubject = {
                id: link.dataset.subjectId,
                name: link.dataset.subjectName,
                href: link.getAttribute('href')
            };

            if (sessionStorage.getItem(`subject_access_${pendingSubject.id}`) === 'granted') {
                window.location.assign(pendingSubject.href);
                return;
            }

            accessSubjectName.textContent = pendingSubject.name;
            accessPin.value = '';
            hideMessage(accessError);

            if (!isConfigured) {
                showMessage(accessError, 'El acceso todavía no ha sido configurado por el docente.');
            }

            accessModal.show();
            accessModalElement.addEventListener('shown.bs.modal', () => accessPin.focus(), { once: true });
        });
    });

    accessForm.addEventListener('submit', async event => {
        event.preventDefault();
        hideMessage(accessError);

        if (!supabaseClient || !pendingSubject) {
            showMessage(accessError, 'El servicio de acceso no está configurado.');
            return;
        }

        const pin = accessPin.value.trim();
        if (!/^\d{4,8}$/.test(pin)) {
            showMessage(accessError, 'Ingresa un PIN de 4 a 8 dígitos.');
            return;
        }

        setLoading(accessSubmit, true, 'Ingresar');
        const { data, error } = await supabaseClient.rpc('verify_subject_pin', {
            p_subject_id: pendingSubject.id,
            p_pin: pin
        });
        setLoading(accessSubmit, false, 'Ingresar');

        if (error) {
            showMessage(accessError, 'No fue posible validar el PIN. Intenta nuevamente.');
            return;
        }

        if (!data) {
            accessPin.select();
            showMessage(accessError, 'PIN incorrecto. Solicítalo a tu docente.');
            return;
        }

        sessionStorage.setItem(`subject_access_${pendingSubject.id}`, 'granted');
        window.location.assign(pendingSubject.href);
    });

    async function refreshTeacherView() {
        hideMessage(teacherError);
        hideMessage(teacherSuccess);

        if (!supabaseClient) {
            teacherLoginForm.classList.remove('d-none');
            teacherSession.classList.add('d-none');
            showMessage(teacherError, 'Primero configura la conexión con Supabase.');
            return;
        }

        const { data: { session } } = await supabaseClient.auth.getSession();
        teacherLoginForm.classList.toggle('d-none', Boolean(session));
        teacherSession.classList.toggle('d-none', !session);
        if (session) {
            document.getElementById('teacher-email-current').textContent = session.user.email;
        }
    }

    teacherButton.addEventListener('click', async () => {
        await refreshTeacherView();
        teacherModal.show();
    });

    teacherLoginForm.addEventListener('submit', async event => {
        event.preventDefault();
        hideMessage(teacherError);
        if (!supabaseClient) {
            showMessage(teacherError, 'Primero configura la conexión con Supabase.');
            return;
        }
        const email = document.getElementById('teacher-email').value.trim();
        const password = document.getElementById('teacher-password').value;
        const submit = teacherLoginForm.querySelector('button[type="submit"]');
        submit.disabled = true;

        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        submit.disabled = false;
        if (error) {
            showMessage(teacherError, 'Credenciales incorrectas o usuario no autorizado.');
            return;
        }

        teacherLoginForm.reset();
        await refreshTeacherView();
    });

    teacherPinForm.addEventListener('submit', async event => {
        event.preventDefault();
        hideMessage(teacherError);
        hideMessage(teacherSuccess);
        const subjectId = document.getElementById('teacher-subject').value;
        const pin = document.getElementById('teacher-new-pin').value.trim();
        const confirmation = document.getElementById('teacher-confirm-pin').value.trim();

        if (!/^\d{4,8}$/.test(pin)) {
            showMessage(teacherError, 'El PIN debe contener entre 4 y 8 dígitos.');
            return;
        }
        if (pin !== confirmation) {
            showMessage(teacherError, 'La confirmación no coincide con el PIN.');
            return;
        }

        const submit = teacherPinForm.querySelector('button[type="submit"]');
        submit.disabled = true;
        const { error } = await supabaseClient.rpc('set_subject_pin', {
            p_subject_id: subjectId,
            p_pin: pin
        });
        submit.disabled = false;

        if (error) {
            showMessage(teacherError, 'No se pudo guardar. Verifica que tu usuario esté autorizado como docente.');
            return;
        }

        teacherPinForm.reset();
        showMessage(teacherSuccess, 'PIN actualizado correctamente. Ya puedes compartirlo con tus estudiantes.');
    });

    teacherLogout.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        await refreshTeacherView();
    });

    const requestedSubject = new URLSearchParams(window.location.search).get('access');
    if (requestedSubject) {
        const requestedLink = document.querySelector(
            `.subject-link[data-subject-id="${CSS.escape(requestedSubject)}"]`
        );
        if (requestedLink) requestedLink.click();
    }
})();
