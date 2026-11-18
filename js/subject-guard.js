(function () {
    'use strict';

    const path = window.location.pathname.toLowerCase();
    const subjectByFolder = {
        '/clases/redcom/': 'redes',
        '/clases/bd2/': 'bd2',
        '/clases/ads/': 'ads',
        '/clases/bdr/': 'bdr',
        '/clases/so/': 'so',
        '/clases/poo/': 'poo'
    };

    const match = Object.entries(subjectByFolder).find(([folder]) => path.includes(folder));
    if (!match) return;

    const subjectId = match[1];
    if (sessionStorage.getItem(`subject_access_${subjectId}`) !== 'granted') {
        window.location.replace(`../../materias.html?access=${encodeURIComponent(subjectId)}`);
    }
})();
