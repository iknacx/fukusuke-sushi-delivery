// JS para la página de menú
import '../global.css'
import productos from '../productos.json'

// Función para renderizar todos los productos del menú
function renderizarMenu() {
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

// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
	renderizarMenu();
	
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
