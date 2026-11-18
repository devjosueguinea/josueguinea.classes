# Configuración del acceso por PIN

El sitio usa Supabase para que el PIN no aparezca en HTML ni JavaScript. En la base de datos solo se guarda un hash `bcrypt`.

1. Crea un proyecto gratuito en Supabase.
2. Abre **SQL Editor**, pega el contenido de `supabase/subject-access.sql` y ejecútalo.
3. En **Authentication > Users**, crea el usuario del docente con correo y contraseña.
4. En **SQL Editor**, ejecuta la última consulta comentada del archivo SQL cambiando el correo por el del docente.
5. En **Project Settings > API**, copia la URL del proyecto y la clave pública `anon` en `js/access-config.js`.
6. Publica los cambios. En `materias.html`, pulsa **Configurar PIN**, inicia sesión y define uno para cada materia.

La clave `anon` y la URL de Supabase son datos públicos previstos para usarse en el navegador. No coloques allí la clave `service_role`.

## Alcance de seguridad

La validación del PIN y su hash están protegidos en el servidor. Sin embargo, GitHub Pages sirve los archivos de las clases como contenido público: una persona que conozca la URL directa podría saltarse la pantalla del PIN. Para protección estricta del contenido se necesita servir las clases desde un backend que valide una sesión en cada solicitud.
