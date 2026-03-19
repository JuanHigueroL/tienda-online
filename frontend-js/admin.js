const API_URL = 'http://localhost:3000/api';

$(document).ready(function() {

    // ==========================================
    // 1. CARGA INICIAL DE CATEGORÍAS
    // ==========================================
    function cargarCategoriasSelect() {
        $.get(`${API_URL}/categorias`, function(categorias) {
            const select = $('#prod-categoria');
            select.empty();
            select.append('<option value="" selected disabled>Selecciona una categoría...</option>');
            
            categorias.forEach(c => {
                select.append(`<option value="${c.id}">${c.nombre}</option>`);
            });
        }).fail(function() {
            alert("Error de conexión: No se pudieron cargar las categorías.");
        });
    }

    // Ejecutar al abrir la página
    cargarCategoriasSelect();

    // ==========================================
    // 2. GUARDAR NUEVA CATEGORÍA
    // ==========================================
    $('#form-categoria').on('submit', function(e) {
        e.preventDefault(); // Evita que la página se recargue
        
        const nombreCat = $('#nombre-categoria').val().trim();

        // El backend proporcionado ya comprueba si la categoría existe
        // y devuelve un error 400 si hay duplicados.
        $.ajax({
            url: `${API_URL}/categorias`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ nombre: nombreCat }),
            success: function(response) {
                alert("¡Categoría guardada con éxito!");
                $('#nombre-categoria').val(''); // Vaciar el input
                cargarCategoriasSelect(); // Recargar el selector para que aparezca la nueva
            },
            error: function(xhr) {
                if (xhr.status === 400) {
                    alert("Error: Ya existe una categoría con ese nombre en la base de datos.");
                } else {
                    alert("Error crítico al guardar la categoría.");
                }
            }
        });
    });

    // ==========================================
    // 3. GUARDAR NUEVO PRODUCTO (Con FormData)
    // ==========================================
    $('#form-producto').on('submit', function(e) {
        e.preventDefault();

        const codigo = $('#prod-codigo').val().trim();
        const inputArchivo = $('#prod-imagen')[0].files[0];

        // Comprobar que el código sea único
        $.get(`${API_URL}/productos`, function(productosExistentes) {
            
            const codigoDuplicado = productosExistentes.some(p => p.codigo_unico === codigo);

            if (codigoDuplicado) {
                alert(`Error: Ya existe un producto registrado con el código "${codigo}".`);
                return; 
            }

            // Construir el paquete FormData (Archivos + Texto)
            let formData = new FormData();
            formData.append('nombre', $('#prod-nombre').val().trim());
            formData.append('codigo_unico', codigo);
            formData.append('descripcion', $('#prod-descripcion').val().trim());
            formData.append('precio', parseFloat($('#prod-precio').val()));
            formData.append('stock', parseInt($('#prod-stock').val()));
            formData.append('categoria_id', $('#prod-categoria').val());
            
            // Se adjunta el archivo físico bajo el nombre 'imagen' (mismo que espera multer)
            if (inputArchivo) {
                formData.append('imagen', inputArchivo);
            }

            // Paso C: Enviar mediante AJAX sin procesar como JSON
            $.ajax({
                url: `${API_URL}/productos`,
                type: 'POST',
                data: formData,
                processData: false, // Evita que jQuery convierta los datos a string
                contentType: false, // Permite que el navegador establezca el Content-type evitando que jQuery lo transforme en texto plano
                success: function() {
                    alert("¡Producto creado y guardado con éxito!");
                    $('#form-producto')[0].reset(); 
                },
                error: function(xhr) {
                    alert("Error al intentar guardar el producto: " + xhr.responseText);
                }
            });

        }).fail(function() {
            alert("Error de conexión: No se pudo verificar el código de producto.");
        });
    });
});