document.getElementById('pedidoForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const pedido = {
      mesa: document.getElementById('mesa').value,
      producto: document.getElementById('producto').value,
      cantidad: document.getElementById('cantidad').value,
      area: document.getElementById('area').value,
    };
  
    // Validar datos antes de enviar
    if (!pedido.mesa || !pedido.producto || !pedido.cantidad || !pedido.area) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    // Enviar el pedido al backend
    fetch('http://localhost:4000/api/pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al enviar el pedido.');
        }
        return response.text();
      })
      .then((data) => {
        alert(data); // Mostrar mensaje de éxito
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un problema al enviar el pedido.');
      });
  });
  