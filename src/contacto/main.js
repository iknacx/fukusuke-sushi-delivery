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
