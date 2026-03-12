$(document).ready(function() {
    // URL base de la API de Node.js
    const API_URL = 'http://localhost:3000/api'; 

    //Función para cargar productos y mostrarlos en la página
    function cargarProductos() {
        console.log("Conectando con la base de datos...");
        // Llamada AJAX a tu servidor Node.js de la ruta GET de productos
        $.get(`${API_URL}/productos`, function(productos) {
            console.log("Datos recibidos:", productos);

            // Se elimina el spinner y el mensaje de carga
            $('#contenedor-productos').empty();

            // Si no hay productos se muestra un mensaje de productos no disponibles
            if (productos.length === 0) {
                $('#contenedor-productos').append('<p class="text-center">No hay productos disponibles.</p>');
                return;
            }
            $.get(`${API_URL}/categorias`, function(categorias) {
                categorias.forEach(c => {
                    const categoria = `
                        <div class="container-fluid mt-4">
                            <h3 class="fw-bold" style="cursor:pointer;" data-bs-toggle="collapse" data-bs-target="#collapse-${c.id}">
                                ${c.nombre}
                            </h3>

                            <div class="collapse show" id="collapse-${c.id}">
                                <div class="row g-3" id="lista-${c.id}">
                                </div>
                            </div>
                        </div>`;
                    $('#contenedor-productos').append(categoria);
                });
                // Se recorre el array de productos y se crea una tarjeta para cada uno
                productos.forEach(p => {
                const imagenMostrada = p.imagen_url ? p.imagen_url : '../uploads/placeholder.png';
                const tarjeta = `
                    <div class="col-6 col-md-4 col-lg-3">
                        <div class="card h-100 shadow-sm border-0" value=${p.categoria_id}>
                            <img src="${imagenMostrada}" class="card-img-top" alt="${p.nombre}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title h6">${p.nombre}</h5>
                                <p class="card-text fw-bold text-primary">${p.precio} €</p>
                                <button class="btn btn-outline-primary btn-sm mt-auto w-100 btn-agregar" data-id="${p.id}">
                                    <i class="bi bi-cart-plus me-2"></i>Añadir
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                // Agrega la tarjeta al contenedor de productos
                $('#lista-' + p.categoria_id).append(tarjeta);
            });
            }).fail(function() {
                console.log("Error al cargar categorías");
            });
            
        }).fail(function() {
            // Si el servidor está apagado o hay un error, se muestra un mensaje de error
            $('#contenedor-productos').html('<div class="alert alert-danger">Error al conectar con el servidor. Disculpe las molestias</div>');
        });
    }

    // Ejecutar al cargar la página
    cargarProductos();


    // Función para mostrar las categorías
    function cargarCategorias() {
        console.log("Conectando con la base de datos...");
        $.get(`${API_URL}/categorias`, function(categorias) {
            console.log("Datos recibidos:", categorias);

            $('.seccion-filtros').empty();

            const opcionTodas = `
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="categoria" id="cat-todas" value="0" checked>
                <label class="form-check-label small" for="cat-todas">Todas las categorías</label>
            </div>
            <hr class="opacity-25">`;

            $('.seccion-filtros').append(opcionTodas);

            if(categorias.length ===0) {
                $('.seccion-filtros').append('<p class="text-center">No hay categorías disponibles.</p>');
                return;
            } else {
                categorias.forEach(c => {
                    const filtro =  `<div class="form-check mb-2">
                                        <input class="form-check-input" type="radio" name="categoria" id="cat-${c.nombre}" value="${c.id}">
                                        <label class="form-check-label small" for="cat-${c.nombre}">${c.nombre}</label>
                                    </div>`
                    $('.seccion-filtros').append(filtro);
                });
            }
            
        }).fail(function() {
            $('.seccion-filtros').html('<div class="alert alert-danger">Error al conectar con el servidor. Disculpe las molestias</div>');
        });

    }

    // Ejecutamos la función al cargar
    cargarCategorias();

});