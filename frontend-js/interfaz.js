$(document).ready(function() {
    
    // Se identifican los elementos clave
    const botonModoOscuro = $('#btn-modo-oscuro');
    const htmlElement = $('html'); // Bootstrap 5.3 requiere aplicar el tema en la etiqueta <html>
    const iconoModo = botonModoOscuro.find('i');

    // 1. Cargar preferencia previa al iniciar la página
    const temaGuardado = localStorage.getItem('tema_tienda');
    if (temaGuardado === 'dark') {
        htmlElement.attr('data-bs-theme', 'dark');
        iconoModo.removeClass('bi-moon').addClass('bi-sun');
    } else {
        htmlElement.attr('data-bs-theme', 'light');
        iconoModo.removeClass('bi-sun').addClass('bi-moon');
    }

    // 2. Alternar el tema al hacer clic
    botonModoOscuro.on('click', function() {
        const temaActual = htmlElement.attr('data-bs-theme');
        
        if (temaActual === 'dark') {
            // Cambiar a Modo Claro
            htmlElement.attr('data-bs-theme', 'light');
            localStorage.setItem('tema_tienda', 'light');
            iconoModo.removeClass('bi-sun').addClass('bi-moon');
        } else {
            // Cambiar a Modo Oscuro
            htmlElement.attr('data-bs-theme', 'dark');
            localStorage.setItem('tema_tienda', 'dark');
            iconoModo.removeClass('bi-moon').addClass('bi-sun');
        }
    });

});