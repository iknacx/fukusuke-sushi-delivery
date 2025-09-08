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

// Función para mostrar los pedidos
function mostrarPedidos() {
    const pedidosLista = document.querySelector('.pedidos-lista');
    if (!pedidosLista) return;

    pedidosLista.innerHTML = '';

    if (pedidos.length === 0) {
        pedidosLista.innerHTML = '<p>No hay pedidos registrados</p>';
        return;
    }

    pedidos.forEach(pedido => {
        const pedidoCard = document.createElement('div');
        pedidoCard.className = 'pedido-card';
        pedidoCard.innerHTML = `
            <div class="pedido-header">
                <h3>Pedido #${pedido.id}</h3>
                <span class="estado-pedido ${pedido.estado}">${formatearEstado(pedido.estado)}</span>
            </div>
            <div class="pedido-info">
                <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                <p><strong>Email:</strong> ${pedido.email}</p>
                <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
                <p><strong>Dirección:</strong> ${pedido.direccion}</p>
                <p><strong>Fecha:</strong> ${formatearFecha(pedido.fecha)}</p>
                ${pedido.notas ? `<p><strong>Notas:</strong> ${pedido.notas}</p>` : ''}
            </div>
            <div class="pedido-items">
                <h4>Items:</h4>
                <ul>
                    ${pedido.items.map(item => `
                        <li>${item.cantidad}x ${item.nombre} - $${item.precio.toLocaleString()}</li>
                    `).join('')}
                </ul>
                <p class="total"><strong>Total:</strong> $${pedido.total.toLocaleString()}</p>
            </div>
            <div class="pedido-acciones">
                <select onchange="cambiarEstado(${pedido.id}, this.value)" class="select-estado">
                    <option value="pendiente" ${pedido.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="en_proceso" ${pedido.estado === 'en_proceso' ? 'selected' : ''}>En Proceso</option>
                    <option value="entregado" ${pedido.estado === 'entregado' ? 'selected' : ''}>Entregado</option>
                </select>
                <button class="btn-editar" onclick="editarPedido(${pedido.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarPedido(${pedido.id})">Eliminar</button>
            </div>
        `;
        pedidosLista.appendChild(pedidoCard);
    });
}

// Funciones auxiliares
function formatearEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En Proceso',
        'entregado': 'Entregado'
    };
    return estados[estado] || estado;
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString('es-CL');
}

// Funciones para gestionar pedidos
function cambiarEstado(pedidoId, nuevoEstado) {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    pedido.estado = nuevoEstado;
    mostrarPedidos();
}

function editarPedido(pedidoId) {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;
    
    // Aquí podrías implementar la lógica para editar el pedido
    alert('Funcionalidad de edición en desarrollo');
}

function eliminarPedido(pedidoId) {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
        pedidos = pedidos.filter(p => p.id !== pedidoId);
        mostrarPedidos();
    }
}

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

// Funciones para gestionar pedidos
async function cargarPedidos() {
    try {
        const response = await fetch('/src/pedidos.json');
        pedidos = await response.json();
        mostrarPedidos();
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
    }
}

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
        mostrarPedidos();
    }
};

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarPedidos();
});
