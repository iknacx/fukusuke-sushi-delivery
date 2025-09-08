// JS para la página de menú
import '../global.css'

let productos = [];

// Cargar productos desde el archivo JSON
async function cargarProductos() {
    try {
        const response = await fetch('/fukusuke-sushi-delivery/productos.json');
        productos = await response.json();
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Función para renderizar todos los productos del menú
async function renderizarMenu() {
	await cargarProductos();
	const productosDestacados = productos.filter(producto => producto.destacado);
	const productosNoDestacados = productos.filter(producto => !producto.destacado);
	const grid = document.querySelector('.productos-grid');
	
	if (!grid) return;
	
	grid.innerHTML = '';
	
	// Combinar productos: primero destacados, luego no destacados
	const todosLosProductos = [...productosDestacados, ...productosNoDestacados];
	
	todosLosProductos.forEach((producto) => {
		const card = document.createElement('div');
		card.className = 'producto-card';
		card.innerHTML = `
			<img src="${producto.imagen}" alt="${producto.nombre}">
			<h3>${producto.nombre}</h3>
			<p>${producto.descripcion}</p>
			<span class="precio">$${producto.precio.toLocaleString()}</span>
			<button data-producto-id="${producto.id}">Agregar</button>
		`;
		grid.appendChild(card);
	});
}

// Función para buscar productos
function buscarProductos() {
    const terminoBusqueda = document.getElementById('buscarProducto').value.toLowerCase();
    const productosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(terminoBusqueda) ||
        producto.descripcion.toLowerCase().includes(terminoBusqueda)
    );
    renderizarProductosFiltrados(productosFiltrados);
}

// Función para mostrar productos filtrados
function renderizarProductosFiltrados(productosFiltrados) {
    const grid = document.querySelector('.productos-grid');
    grid.innerHTML = '';

    if (productosFiltrados.length === 0) {
        grid.innerHTML = '<p class="no-resultados">No se encontraron productos que coincidan con la búsqueda</p>';
        return;
    }

    productosFiltrados.forEach((producto) => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <span class="precio">$${producto.precio.toLocaleString()}</span>
            <button data-producto-id="${producto.id}">Agregar</button>
        `;
        grid.appendChild(card);
    });
}

// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    renderizarMenu();
    
    // Configurar búsqueda en tiempo real
    const campoBusqueda = document.getElementById('buscarProducto');
    if (campoBusqueda) {
        campoBusqueda.addEventListener('input', buscarProductos);
    }
    
    // Manejar clics en botones de agregar (simple demo)
    document.addEventListener('click', (e) => {
        if (e.target.matches('.producto-card button')) {
            const productoId = parseInt(e.target.dataset.productoId);
            const producto = productos.find(p => p.id === productoId);
            if (producto) {
                alert(`${producto.nombre} agregado al carrito (demo)`);
            }
        }
    });
});

// Funciones para el menú móvil
function toggleMobileMenu() {
	const mobileMenu = document.getElementById('mobile-menu');
	const overlay = document.querySelector('.mobile-menu-overlay');
	const toggle = document.querySelector('.menu-toggle');
	
	if (!mobileMenu || !overlay || !toggle) return;
	
	const isActive = mobileMenu.classList.contains('active');
	
	if (isActive) {
		// Cerrar menú
		mobileMenu.classList.remove('active');
		overlay.classList.remove('active');
		toggle.classList.remove('active');
		document.body.style.overflow = '';
	} else {
		// Abrir menú
		mobileMenu.classList.add('active');
		overlay.classList.add('active');
		toggle.classList.add('active');
		document.body.style.overflow = 'hidden';
	}
}

function closeMobileMenu() {
	const mobileMenu = document.getElementById('mobile-menu');
	const overlay = document.querySelector('.mobile-menu-overlay');
	const toggle = document.querySelector('.menu-toggle');
	
	if (!mobileMenu || !overlay || !toggle) return;
	
	mobileMenu.classList.remove('active');
	overlay.classList.remove('active');
	toggle.classList.remove('active');
	document.body.style.overflow = '';
}

// Hacer funciones accesibles globalmente
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
