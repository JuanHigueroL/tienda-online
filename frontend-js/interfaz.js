$(document).ready(function() {

    // Al cargar la página se intenta ver si hay un tema guardado
    const temaGuardado = localStorage.getItem('tema_tienda');

    // Si existe un tema guardado, lo aplicamos de inmediato
    if (temaGuardado) {
        $('html').attr('data-bs-theme', temaGuardado);
    }

    $('#btn-modo-oscuro').click(function(e) {
        // Evitamos que el botón haga su acción por defecto
        e.preventDefault();
        
        // Miramos qué tiene el HTML ahora mismo
        const esOscuro = $('html').attr('data-bs-theme') === 'dark';

        // Si esOscuro es true, el nuevo tema será 'light', si no, será 'dark'
        const nuevoTema = esOscuro ? 'light' : 'dark';
        const textoBoton = esOscuro ? '<i class="bi bi-moon"></i>' : '<i class="bi bi-sun"></i>';
        
        // Aplicamos el cambio visual
        $('html').attr('data-bs-theme', nuevoTema);
        $(this).html(textoBoton); 
        
        // Guardamos en la memoria
        localStorage.setItem('tema_tienda', nuevoTema);

        console.log("Nuevo tema guardado: " + nuevoTema);
    });
});