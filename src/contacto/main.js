// JS para la página de contacto
import '../global.css'

// Aquí puedes agregar funcionalidad para el formulario de contacto, etc.
document.addEventListener('DOMContentLoaded', () => {
  // Ejemplo: mostrar alerta al hacer clic en teléfono
  const tel = document.querySelector('a[href^="tel:"]');
  if (tel) {
    tel.addEventListener('click', (e) => {
      alert('Llamando a Fukusuke Sushi...');
    });
  }
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
