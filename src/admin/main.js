// Estado global de la aplicación
let productos = [];
let pedidos = [];

// Cargar datos desde los archivos JSON
async function cargarDatos() {
    try {
        const [productosResponse, pedidosResponse] = await Promise.all([
            fetch('/src/productos.json'),
            fetch('/src/pedidos.json')
        ]);
        
        productos = await productosResponse.json();
        pedidos = await pedidosResponse.json();
        
        mostrarProductos();
        mostrarPedidos();
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// Función para inicializar las pestañas
function inicializarTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Desactivar todas las pestañas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activar la pestaña seleccionada
            button.classList.add('active');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
                // Asegurarse de que el contenido se actualice
                if (tabId === 'productos') {
                    mostrarProductos();
                } else if (tabId === 'pedidos') {
                    mostrarPedidos();
                } else if (tabId === 'menu') {
                    mostrarConfiguracionMenu();
                }
            }
        });
    });
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    inicializarTabs();
    cargarDatos();
});



// Funciones auxiliares

// Mostrar productos en la lista
function mostrarProductos() {
    const productosLista = document.querySelector('.productos-lista');
    productosLista.innerHTML = '';

    productos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card';
        productoCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p>Precio: $${producto.precio.toLocaleString()}</p>
            <p>Destacado: ${producto.destacado ? 'Sí' : 'No'}</p>
            <div class="acciones">
                <button class="btn-editar" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </div>
        `;
        productosLista.appendChild(productoCard);
    });
}

// Manejo de tabs
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase active de todos los botones y contenidos
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Agregar clase active al botón clickeado y su contenido correspondiente
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Modal de producto
const modal = document.getElementById('productoModal');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('productoForm');
let editandoProductoId = null;

// Abrir modal para agregar producto
document.getElementById('agregarProducto').addEventListener('click', () => {
    editandoProductoId = null;
    form.reset();
    modal.style.display = 'block';
});

// Cerrar modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar modal al hacer click fuera
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Manejar envío del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const productoData = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: parseInt(document.getElementById('precio').value),
        imagen: document.getElementById('imagen').value,
        destacado: document.getElementById('destacado').checked
    };

    if (editandoProductoId === null) {
        // Agregar nuevo producto
        productoData.id = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        productos.push(productoData);
    } else {
        // Actualizar producto existente
        const index = productos.findIndex(p => p.id === editandoProductoId);
        if (index !== -1) {
            productoData.id = editandoProductoId;
            productos[index] = productoData;
        }
    }

    // Actualizar vista y cerrar modal
    mostrarProductos();
    modal.style.display = 'none';
    form.reset();
});

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
});

// Función para editar producto
window.editarProducto = (id) => {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        editandoProductoId = id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('imagen').value = producto.imagen;
        document.getElementById('destacado').checked = producto.destacado;
        modal.style.display = 'block';
    }
};

// Función para eliminar producto
window.eliminarProducto = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        mostrarProductos();
    }
};

function mostrarPedidos() {
    const pedidosLista = document.querySelector('.pedidos-lista');
    pedidosLista.innerHTML = '';

    if (pedidos.length === 0) {
        pedidosLista.innerHTML = '<p>No hay pedidos pendientes</p>';
        return;
    }

    pedidos.forEach(pedido => {
        const pedidoCard = document.createElement('div');
        pedidoCard.className = 'pedido-card';
        
        const productos = pedido.productos.map(p => 
            `${p.cantidad}x ${p.nombre} ($${p.precio.toLocaleString()})`
        ).join('<br>');

        pedidoCard.innerHTML = `
            <div class="pedido-header">
                <h3>Pedido #${pedido.id}</h3>
                <span class="estado-pedido ${pedido.estado}">${formatearEstado(pedido.estado)}</span>
            </div>
            <div class="pedido-info">
                <p><strong>Cliente:</strong> ${pedido.cliente.nombre}</p>
                <p><strong>Contacto:</strong> ${pedido.cliente.telefono}</p>
                <p><strong>Dirección:</strong> ${pedido.cliente.direccion}</p>
                <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleString()}</p>
                <p><strong>Productos:</strong><br>${productos}</p>
                <p><strong>Total:</strong> $${pedido.total.toLocaleString()}</p>
                <p><strong>Notas:</strong> ${pedido.notas || 'Sin notas'}</p>
            </div>
            <div class="pedido-acciones">
                <button onclick="editarPedido(${pedido.id})" class="btn-editar">Editar</button>
                <button onclick="eliminarPedido(${pedido.id})" class="btn-eliminar">Eliminar</button>
                <select onchange="cambiarEstadoPedido(${pedido.id}, this.value)" class="select-estado">
                    <option value="pendiente" ${pedido.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="en_preparacion" ${pedido.estado === 'en_preparacion' ? 'selected' : ''}>En Preparación</option>
                    <option value="en_camino" ${pedido.estado === 'en_camino' ? 'selected' : ''}>En Camino</option>
                    <option value="entregado" ${pedido.estado === 'entregado' ? 'selected' : ''}>Entregado</option>
                    <option value="cancelado" ${pedido.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </div>
        `;
        pedidosLista.appendChild(pedidoCard);
    });
}

function formatearEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'en_preparacion': 'En Preparación',
        'en_camino': 'En Camino',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
}

function cambiarEstadoPedido(id, nuevoEstado) {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
        pedido.estado = nuevoEstado;
        mostrarPedidos();
    }
}

window.editarPedido = (id) => {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;

    // Aquí podrías abrir un modal con un formulario para editar el pedido
    alert('Función de edición en desarrollo');
};

window.eliminarPedido = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
        pedidos = pedidos.filter(p => p.id !== id);
    }
};

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
});

// Función para mostrar la configuración del menú
function mostrarConfiguracionMenu() {
    const menuConfig = document.querySelector('#menu .menu-config');
    if (!menuConfig) return;

    menuConfig.innerHTML = `
        <div class="menu-section">
            <h3>Productos Destacados en la Página Principal</h3>
            <p>Selecciona qué productos aparecerán como destacados en la página de inicio:</p>
            <div class="destacados-grid"></div>
        </div>
        
        <div class="menu-section">
            <h3>Categorías del Menú</h3>
            <p>Organiza los productos por categorías:</p>
            <div class="categorias-config">
                <div class="categoria">
                    <h4>🍣 Sushi y Rolls</h4>
                    <div class="productos-categoria" data-categoria="sushi"></div>
                </div>
                <div class="categoria">
                    <h4>🍜 Sopas y Calientes</h4>
                    <div class="productos-categoria" data-categoria="sopas"></div>
                </div>
                <div class="categoria">
                    <h4>🥟 Entradas y Acompañamientos</h4>
                    <div class="productos-categoria" data-categoria="entradas"></div>
                </div>
                <div class="categoria">
                    <h4>🍱 Combos Familiares</h4>
                    <div class="productos-categoria" data-categoria="combos"></div>
                </div>
            </div>
        </div>
    `;

    // Renderizar productos destacados
    renderizarProductosDestacados();
    // Renderizar productos por categorías
    renderizarProductosPorCategorias();
}

function renderizarProductosDestacados() {
    const destacadosGrid = document.querySelector('.destacados-grid');
    if (!destacadosGrid) return;

    destacadosGrid.innerHTML = '';
    
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = `producto-destacado-card ${producto.destacado ? 'destacado' : ''}`;
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
            <div class="producto-info">
                <h4>${producto.nombre}</h4>
                <p>$${producto.precio.toLocaleString()}</p>
            </div>
            <label class="toggle-destacado">
                <input type="checkbox" ${producto.destacado ? 'checked' : ''} 
                       onchange="toggleDestacado(${producto.id})">
                <span class="checkmark">Destacado</span>
            </label>
        `;
        destacadosGrid.appendChild(card);
    });
}

function renderizarProductosPorCategorias() {
    const categoriasMap = {
        'sushi': ['Sushi', 'Roll', 'Maki', 'Nigiri', 'Sashimi'],
        'sopas': ['Ramen', 'Sopa', 'Caldo'],
        'entradas': ['Gyoza', 'Tempura', 'Entrada'],
        'combos': ['Combo', 'Familiar', 'Variado']
    };

    Object.keys(categoriasMap).forEach(categoria => {
        const container = document.querySelector(`[data-categoria="${categoria}"]`);
        if (!container) return;

        const productosCategoria = productos.filter(producto => {
            return categoriasMap[categoria].some(keyword => 
                producto.nombre.toLowerCase().includes(keyword.toLowerCase())
            );
        });

        container.innerHTML = '';
        
        if (productosCategoria.length === 0) {
            container.innerHTML = '<p class="no-productos">No hay productos en esta categoría</p>';
            return;
        }

        productosCategoria.forEach(producto => {
            const item = document.createElement('div');
            item.className = 'producto-categoria-item';
            item.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="info">
                    <span class="nombre">${producto.nombre}</span>
                    <span class="precio">$${producto.precio.toLocaleString()}</span>
                    ${producto.destacado ? '<span class="badge-destacado">⭐ Destacado</span>' : ''}
                </div>
            `;
            container.appendChild(item);
        });
    });
}

function toggleDestacado(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
        producto.destacado = !producto.destacado;
        renderizarProductosDestacados();
        renderizarProductosPorCategorias();
        
        // También actualizar la vista de productos si está activa
        if (document.querySelector('#productos.active')) {
            mostrarProductos();
        }
    }
}

// Hacer la función accesible globalmente
window.toggleDestacado = toggleDestacado;
