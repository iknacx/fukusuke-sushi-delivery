import './global.css'
import './global.css'
import './styles.css'
import productos from './productos.json'

// Variables globales
let carrito = [];
let productosData = productos;

// Función para actualizar contadores del carrito
function actualizarContadorCarrito() {
	const contadorDesktop = document.getElementById('contador-carrito');
	const contadorMobile = document.getElementById('contador-carrito-mobile');
	
	if (contadorDesktop) {
		contadorDesktop.textContent = carrito.length;
	}
	if (contadorMobile) {
		contadorMobile.textContent = carrito.length;
	}
}

// Función para mostrar el modal de login
function mostrarLogin() {
	const loginModal = document.getElementById('login-modal');
	if (loginModal) {
		loginModal.style.display = 'flex';
	}
}

// Función para cerrar el modal de login
function cerrarLogin() {
	const loginModal = document.getElementById('login-modal');
	if (loginModal) {
		loginModal.style.display = 'none';
	}
}

// Función para manejar el submit del formulario de login
function manejarSubmitLogin(event) {
	event.preventDefault();
	const password = document.getElementById('password').value;
	const regex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
	if (!regex.test(password)) {
		alert('La contraseña debe tener al menos 6 caracteres, una mayúscula y un símbolo.');
		return false;
	}
	// Simular login exitoso
	alert('¡Inicio de sesión exitoso!');
	cerrarLogin();
	// Limpiar formulario
	document.getElementById('login-modal').querySelector('form').reset();
	return false;
}

// Hacer funciones accesibles globalmente
window.mostrarLogin = mostrarLogin;
window.cerrarLogin = cerrarLogin;
window.manejarSubmitLogin = manejarSubmitLogin;

// Función para renderizar productos destacados en la página principal
function renderizarProductosDestacados() {
	const productosDestacados = productosData.filter(producto => producto.destacado);
	const grid = document.querySelector('.productos-grid');
	
	if (!grid) return;
	
	grid.innerHTML = '';
	
	productosDestacados.forEach((producto, index) => {
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

// Lista de productos con precios (se eliminará - ahora viene del JSON)
const productosLegacy = [
	{ nombre: "Sushi Clásico", precio: 120 },
	{ nombre: "Sushi Tempura", precio: 140 },
	{ nombre: "Sashimi Variado", precio: 180 },
	{ nombre: "Combo Familiar", precio: 450 }
];

document.addEventListener('DOMContentLoaded', () => {
	// Renderizar productos destacados si estamos en la página principal
	if (document.querySelector('.productos-grid')) {
		renderizarProductosDestacados();
	}
	
	// Inicializar carrito de compra
	document.addEventListener('click', (e) => {
		if (e.target.matches('.producto-card button')) {
			const productoId = parseInt(e.target.dataset.productoId);
			const producto = productosData.find(p => p.id === productoId);
			if (producto) {
				carrito.push(producto);
				actualizarContadorCarrito();
			}
		}
	});

	// Eventos para los carritos (desktop y móvil)
	const carritoDesktop = document.getElementById('carrito');
	const carritoMobile = document.getElementById('carrito-mobile');
	
	if (carritoDesktop) {
		carritoDesktop.addEventListener('click', mostrarPopupCarrito);
	}
	if (carritoMobile) {
		carritoMobile.addEventListener('click', mostrarPopupCarrito);
	}
});

function mostrarPopupCarrito() {
	// Cerrar menú móvil si está abierto
	closeMobileMenu();
	
	const lista = document.getElementById('lista-carrito');
	lista.innerHTML = '';
	let total = 0;
	const btnPagar = document.getElementById('btn-pagar');
	if (carrito.length === 0) {
		lista.innerHTML = '<li>El carrito está vacío.</li>';
		btnPagar.style.display = 'none';
	} else {
		carrito.forEach((producto, i) => {
			const item = document.createElement('li');
			item.style.display = 'flex';
			item.style.justifyContent = 'space-between';
			item.style.alignItems = 'center';
			item.innerHTML = `
				<span>${producto.nombre} - $${producto.precio.toLocaleString()}</span>
				<button class="eliminar-item" data-index="${i}" style="margin-left:12px; background:#d72638; color:#fff; border:none; border-radius:4px; padding:2px 8px; cursor:pointer;">Eliminar</button>
			`;
			lista.appendChild(item);
			total += producto.precio;
		});
		btnPagar.style.display = 'inline-block';
	}
	document.getElementById('total-carrito').textContent = 'Total: $' + total.toLocaleString();
	document.getElementById('popup-carrito').style.display = 'block';
	document.getElementById('popup-fondo').style.display = 'block';

	// Evento para eliminar productos
	document.querySelectorAll('.eliminar-item').forEach(btn => {
		btn.onclick = function() {
			const index = parseInt(this.getAttribute('data-index'));
			carrito.splice(index, 1);
			actualizarContadorCarrito();
			mostrarPopupCarrito();
		};
	});

	// Evento para continuar al pago
	btnPagar.onclick = function() {
		alert('¡Gracias por tu compra! Aquí iría el proceso de pago.');
		// Aquí podrías redirigir a una página de pago real
		cerrarPopupCarrito();
		carrito = [];
		actualizarContadorCarrito();
	};
}

function cerrarPopupCarrito() {
	document.getElementById('popup-carrito').style.display = 'none';
	document.getElementById('popup-fondo').style.display = 'none';
}
window.cerrarPopupCarrito = cerrarPopupCarrito;

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
