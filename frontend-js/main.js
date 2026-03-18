// ==========================================
// 1. VARIABLES GLOBALES Y FUNCIONES DE LA CESTA
// ==========================================
// Estas variables y funciones deben estar fuera del $(document).ready() 
// para que el HTML pueda encontrarlas al hacer clic (onclick).

const API_URL = 'http://localhost:3000/api'; 
let productosEnCesta = []; 
let totalCesta = 0;

function añadirProducto(id, stockInicial) {
    const stockElemento = document.getElementById(`stock-${id}`);
    const elementoContador = document.getElementById('contador-carrito');
    
    // Sincronizar por si es el primer clic
    totalCesta = parseInt(elementoContador.textContent) || 0;
    
    // Asegurarse de que el globo rojo es visible
    if (elementoContador.style.display === 'none') {
        elementoContador.style.display = 'inline-block';
    }

    if (stockElemento) {
        let stockActual = parseInt(stockElemento.textContent);
        
        if (stockActual > 0) {
            // 1. Actualizar contador total
            totalCesta++;
            elementoContador.textContent = totalCesta;
            
            // 2. Actualizar stock visual
            stockActual--;
            stockElemento.textContent = stockActual + " unidades";
            
            // 3. Añadir al array si es nuevo
            if (!productosEnCesta.includes(id)) {
                productosEnCesta.push(id);
            }
            
            // 4. Actualizar cantidad específica de este producto
            let cantidadAñadida = stockInicial - stockActual;
            $(`#span-añadir-${id}`).text(cantidadAñadida);
            
            // 5. Deshabilitar si se agota
            if (stockActual === 0) {
                $(`#btn-añadir-${id}`).prop('disabled', true);
                $(`#img-${id}`).css('opacity', 0.5);
            }
            
            // 6. Refrescar cesta
            printCesta(productosEnCesta);
        }
    }
}

function quitarProducto(id, stockInicial) {
    const spanAñadir = document.getElementById(`span-añadir-${id}`);
    const stockElemento = document.getElementById(`stock-${id}`);
    const elementoContador = document.getElementById('contador-carrito');
    
    totalCesta = parseInt(elementoContador.textContent) || 0;

    if (spanAñadir && stockElemento) {
        let cantidadEnCesta = parseInt(spanAñadir.textContent) || 0;
        let stockActual = parseInt(stockElemento.textContent) || 0;

        if (cantidadEnCesta > 0) {
            $(`#img-${id}`).css('opacity', 1);
            // 1. Actualizar contador total
            totalCesta--;
            elementoContador.textContent = totalCesta;
            
            // Ocultar el globo si llega a cero
            if (totalCesta === 0) {
                elementoContador.style.display = 'none';
            }
            
            // 2. Devolver stock visual
            stockActual++;
            stockElemento.textContent = stockActual + " unidades";
            
            // 3. Restar cantidad específica
            cantidadEnCesta--;
            
            // 4. Lógica de borrado o actualización
            if (cantidadEnCesta === 0) {
                spanAñadir.innerHTML = '<i class="bi bi-cart me-2"></i>Añadir';
                productosEnCesta = productosEnCesta.filter(productoId => productoId !== id);
            } else {
                spanAñadir.textContent = cantidadEnCesta;
            }
            
            // 5. Reactivar botón de añadir
            $(`#btn-añadir-${id}`).prop('disabled', false);
            
            // 6. Refrescar cesta
            printCesta(productosEnCesta);
        }
    }
}

function printCesta(productos) {
    $('#contenedor-cesta').empty();
    
    // Reinicio visual: total a cero y botón deshabilitado
    $('#precio-total-cesta').text('0.00'); 
    $('#btn-finalizar-compra').prop('disabled', true);

    // Si la cesta está vacía, se detiene la ejecución aquí
    if (productos.length === 0) {
        $('#contenedor-cesta').html('<p class="text-muted p-3">Tu cesta está vacía. ¡Agrega productos para verlos aquí!</p>');
        return;
    }

    let totalAcumulado = 0;
    let peticionesCompletadas = 0;

    for (const id of productos) {
        $.get(`${API_URL}/productos/${id}`, function(p) {
            
            let cantidadEnCesta = parseInt($(`#span-añadir-${p.id}`).text()) || 0;
            const subtotal = parseFloat(p.precio) * cantidadEnCesta;
            
            totalAcumulado += subtotal;
            
            // Validación para la imagen (por si algún producto no tiene URL)
            const imagenMostrada = p.imagen_url ? p.imagen_url : '../uploads/placeholder.png';
            
            const itemCesta = `
                <div class="cesta-item p-3 d-flex align-items-center border-bottom">
                    
                    <div class="me-3" style="width: 60px; height: 60px; flex-shrink: 0;">
                        <img src="${imagenMostrada}" class="img-fluid rounded object-fit-cover w-100 h-100 shadow-sm" alt="${p.nombre}">
                    </div>

                    <div class="flex-grow-1 overflow-hidden">
                        <h6 class="mb-1 fw-bold text-truncate">${p.nombre}</h6>
                        <div class="text-muted" style="font-size: 0.75rem;">
                            <span class="fw-bold">Cód:</span> ${p.codigo_unico}
                        </div>
                        <div class="text-muted text-truncate mb-1" style="font-size: 0.75rem;" title="${p.descripcion}">
                            ${p.descripcion}
                        </div>
                        <small class="text-muted">Precio un.: ${p.precio} €</small>
                    </div>

                    <div class="text-end ms-2 d-flex flex-column align-items-end" style="min-width: 85px;">
                        <button type="button" class="btn btn-sm btn-outline-danger p-1 mb-2 lh-1 w-100" onclick="quitarProducto(${p.id}, ${p.stock})" title="Eliminar 1 unidad de la cesta">
                            <i class="bi bi-trash"></i> <span style="font-size: 0.7rem;">Quitar 1</span>
                        </button>
                        
                        <span class="badge bg-secondary rounded-pill mb-1">${cantidadEnCesta} un.</span>
                        <div class="text-primary fw-bold">
                            ${subtotal.toFixed(2)} €
                        </div>
                    </div>
                    
                </div>
            `;
            $('#contenedor-cesta').append(itemCesta);

            peticionesCompletadas++;
            // Cuando se carguen todos los productos de la cesta:
            if (peticionesCompletadas === productos.length) {
                // 1. Se actualiza el total
                $('#precio-total-cesta').text(totalAcumulado.toFixed(2));
                // 2. Se habilita el botón de compra
                $('#btn-finalizar-compra').prop('disabled', false);
            }

        }).fail(function() {
            console.log("Error al cargar producto con id " + id);
            
            peticionesCompletadas++;
            if (peticionesCompletadas === productos.length) {
                $('#precio-total-cesta').text(totalAcumulado.toFixed(2));
                $('#btn-finalizar-compra').prop('disabled', false);
            }
        });
    }
}

// --- LÓGICA: FINALIZAR COMPRA ---
    $('#btn-finalizar-compra').on('click', function() {
        
        const mensajePago = `
            <div class="d-flex flex-column justify-content-center align-items-center h-100 p-4 text-center" style="min-height: 300px;">
                <i class="bi bi-credit-card-2-front text-primary mb-3" style="font-size: 4rem;"></i>
                <h5 class="fw-bold">Redirigiendo...</h5>
                <p class="text-muted">Aquí se realizaría la pasarela de pago.</p>
            </div>
        `;
        
        // Se incluye el mensaje en el panel lateral y se elimina la lista de productos
        $('#contenedor-cesta').html(mensajePago);
        
        // Se deshabilita el propio botón de finalizar compra
        $(this).prop('disabled', true);

        // SE BLOQUEAN TODOS LOS BOTONES DE LA PÁGINA PRINCIPAL
        $('.btn-sumar, .btn-quitar').prop('disabled', true);

        // Se vacían los datos de la cesta para evitar problemas lógicos en segundo plano
        productosEnCesta = [];
        totalCesta = 0;
        $('#contador-carrito').text('0').hide();
    });

    // --- LÓGICA: ABRIR MODAL DE ADMINISTRACIÓN ---
    $('#btn-abrir-admin').on('click', function(e) {
        e.preventDefault(); // Evita que la página salte hacia arriba por el href="#"
        
        // Se limpia el input y se ocultan errores previos cada vez que se abre
        $('#input-password-admin').val('');
        $('#error-password').hide();
        
        // Se inicializa y muestra el modal nativo de Bootstrap
        const modalAdmin = new bootstrap.Modal(document.getElementById('modalAdmin'));
        modalAdmin.show();
    });

    // --- LÓGICA: VALIDAR CONTRASEÑA ---
    $('#btn-validar-admin').on('click', function() {
        const password = $('#input-password-admin').val();
        
        if (password === '123456') {
            // Contraseña correcta: Se redirige a la nueva página de gestión
            window.location.href = 'admin.html';
        } else {
            // Contraseña incorrecta: Se muestra el error y se vacía el campo
            $('#error-password').fadeIn();
            $('#input-password-admin').val('').focus();
        }
    });

    // Pequeña mejora de usabilidad: Permitir validar pulsando la tecla 'Enter'
    $('#input-password-admin').on('keypress', function(e) {
        if (e.which === 13) { // 13 es el código de la tecla Enter
            $('#btn-validar-admin').click();
        }
    });

// ==========================================
// 2. INICIALIZACIÓN Y EVENTOS DEL DOM
// ==========================================
// Todo lo que necesita que carga el DOM para funcionar debe estar dentro de este bloque.

$(document).ready(function() {
    
    // --- FUNCIÓN: CARGAR PRODUCTOS ---
    function cargarProductos() {
        console.log("Conectando con la base de datos...");
        $.get(`${API_URL}/productos`, function(productos) {
            console.log("Datos recibidos:", productos);

            $('#contenedor-productos').empty();

            if (productos.length === 0) {
                $('#contenedor-productos').append('<p class="text-center">No hay productos disponibles.</p>');
                return;
            }
            
            // Se crean las categorías primero y se le añade collapse a cada una
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
                
                // Luego se insertan los productos dentro de su categoría correspondiente
                productos.forEach(p => {
                    const imagenMostrada = p.imagen_url ? p.imagen_url : '../uploads/placeholder.png';
                    const tarjeta = `
                        <div class="col-6 col-md-4 col-lg-3 tarjeta-producto" data-nombre="${p.nombre.toLowerCase()}">
                            <div class="card h-100 shadow-sm border-0">
                                <img id="img-${p.id}" src="${imagenMostrada}" class="imagen-card card-img-top" alt="${p.nombre}">
                                <div class="card-body d-flex flex-column">
                                    <div class="flex-grow-1">
                                        <h5 class="card-title fs-5 fw-bold mb-2">${p.nombre}</h5>
                                        <p class="card-text fw-bold mb-1">Código: ${p.codigo_unico}</p>
                                        <p class="card-text text-muted">Descripción: ${p.descripcion}</p>
                                    </div>
                                    <div class="mt-3">
                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                            <span class="card-text fw-bold text-primary fs-6">Precio: ${p.precio}</span>
                                            <span id="stock-${p.id}" class="badge bg-light text-dark border">${p.stock} unidades</span>
                                        </div>
                                        <div class="btn-group btn-group-sm w-100" role="group" aria-label="Controles de carrito">
                                            <button id="btn-quitar-${p.id}" type="button" class="btn btn-outline-primary px-1 btn-quitar" onclick="quitarProducto(${p.id}, ${p.stock})" title="Quitar unidad">
                                                <i class="bi bi-dash-lg"></i>
                                            </button>
                                            <span id="span-añadir-${p.id}" class="btn btn-outline-primary flex-grow-1 disabled" style="opacity: 1; pointer-events: none; border-left: none; border-right: none;">
                                                <i class="bi bi-cart me-2"></i>Añadir
                                            </span>
                                            <button id="btn-añadir-${p.id}" type="button" class="btn btn-outline-primary px-1 btn-sumar" onclick="añadirProducto(${p.id}, ${p.stock})" title="Añadir unidad">
                                                <i class="bi bi-plus-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    $('#lista-' + p.categoria_id).append(tarjeta);
                });
            }).fail(function() {
                console.log("Error al cargar categorías");
            });
            
        }).fail(function() {
            $('#contenedor-productos').html('<div class="alert alert-danger">Error al conectar con el servidor. Disculpe las molestias</div>');
        });
    }

    /* --- FUNCIÓN: CARGAR CATEGORÍAS --- PARA FILTROS Y DESCARTADO DE USO DE MOMENTO
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

            if(categorias.length === 0) {
                $('.seccion-filtros').append('<p class="text-center">No hay categorías disponibles.</p>');
                return;
            } else {
                categorias.forEach(c => {
                    const filtro = `
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="categoria" id="cat-${c.nombre}" value="${c.id}">
                            <label class="form-check-label small" for="cat-${c.nombre}">${c.nombre}</label>
                        </div>`;
                    $('.seccion-filtros').append(filtro);
                });
            }
        }).fail(function() {
            $('.seccion-filtros').html('<div class="alert alert-danger">Error al conectar con el servidor. Disculpe las molestias</div>');
        });
    }*/

    // Ejecutar carga inicial
    cargarProductos();

    // --- LÓGICA: VISOR DE IMÁGENES ---
    $('body').append(`
        <div id="visor-centro">
            <img src="" id="img-visor" alt="Vista ampliada">
        </div>
    `);

    let temporizadorHover;

    $(document).on('mouseenter', '.imagen-card', function() {
        const rutaImagen = $(this).attr('src'); 
        temporizadorHover = setTimeout(function() {
            $('#img-visor').attr('src', rutaImagen);
            $('#visor-centro').addClass('activo');
        }, 1000); 
    });

    $(document).on('mouseleave', '.imagen-card', function() {
        clearTimeout(temporizadorHover); 
        $('#visor-centro').removeClass('activo');
    });

    // --- LÓGICA: BUSCADOR ---
    function filtrarBuscador() {
        const textoBuscado = $('#input-busqueda').val().toLowerCase();
        
        $('.tarjeta-producto').each(function() {
            const nombreProducto = $(this).attr('data-nombre');
            if (nombreProducto.includes(textoBuscado)) {
                $(this).fadeIn(300); 
            } else {
                $(this).fadeOut(300); 
            }
        });
    }

    $('#input-busqueda').on('keyup', filtrarBuscador);

});