let productosGlobales = [];
const API_URL = 'https://fakestoreapi.com/products';


async function llamarAPI(API) {
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        productosGlobales = await response.json(); 
        return productosGlobales;
    } catch (error) {
        console.error('Error al obtener los productos de la API:', error);
        return [];
    }
}


function Producto(producto) {
    const displayTitle = producto.title.split(",")[0];

    return `
    <div class="producto">
        <img src="${producto.image}" alt="${producto.title}">
        <div class="producto-descripcion">
            <span>${producto.category.toUpperCase()}</span>
            <h5>${displayTitle}</h5>
            <h4>$${producto.price.toFixed(2)}</h4>
        </div>
        <a id="btn-agregar-${producto.id}" class="carrito">
            <i class="fa-solid fa-shopping-cart"></i>
        </a>
    </div>
    `;
}

function dibujarDatos(json) {
    const filas = json.map(obj => Producto(obj));
    document.querySelector('.productos-container').innerHTML = filas.join('');

    adjuntarEventosCarrito();
}

function adjuntarEventosCarrito() {
    
    productosGlobales.forEach(producto => {
        const boton = document.getElementById(`btn-agregar-${producto.id}`);
        if (boton) { 
            boton.addEventListener('click', () => {
                agregarProductoAlCarrito(producto);
            });
        }
    });
}

function agregarProductoAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

    const indiceProductoExistente = carrito.findIndex(item => item.id === producto.id);

    if (indiceProductoExistente !== -1) {
        carrito[indiceProductoExistente].cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            title: producto.title,
            price: producto.price,
            image: producto.image,
            cantidad: 1
        });
    }

    localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
    alert(`¡Producto agregado al carrito!`);
}

document.addEventListener('DOMContentLoaded', async () => {
    await llamarAPI(API_URL); 
    if (productosGlobales.length > 0) {
        console.log(productosGlobales)
        dibujarDatos(productosGlobales);
    }
});