

/* USUARIO */
const Usuario = function(nombre, edad, profesion){
    this.nombre = nombre,
    this.edad = edad,
    this.profesion = profesion
}

// Función para capitalizar     ************
function capitalizarPrimeraLetra(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const formulario = document.getElementById("miFormulario");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const nombre = document.getElementById("nombre").value;
    const edad = document.getElementById("edad").value;
    const profesion = document.getElementById("profesion").value;
    
    // Cartel si no está completo
    if (!nombre || !edad || !profesion) {
        Swal.fire(
            'Error',
            'Por favor, completa todos los campos del formulario',
            'error'
            );
            return; // Detener ejecución 
    }
    const nombreCapitalizado = capitalizarPrimeraLetra(nombre)  // que el nombre aparezca capitalizado
    const usuario1 = new Usuario(nombreCapitalizado, edad, profesion);
    console.log(usuario1);
  
    sessionStorage.setItem("usuario1", JSON.stringify(usuario1))
    const usuario1Guardado = JSON.parse(sessionStorage.getItem("usuario1"));
  
    console.log(usuario1Guardado);
    document.getElementById("titulo").textContent = `Góndola de compras de ${usuario1Guardado.nombre}`;

    // Todo completo
    Swal.fire(
        'Usuario ingresado!',
        'disfruta tus compras',
        'success'
    )
    // Se borra cuando enviado
    formulario.reset();
});

/* DOLAR */
const divDolar = document.getElementById("divDolar")
function consultarDolar (){
    fetch("https://criptoya.com/api/dolar")
    .then(response => response.json())   
    .then(({blue, solidario, oficial, mep, ccl}) => {
        divDolar.innerHTML = `
        <div>
            <h2>Cotización dolar: </h2>
            <p class="inline-p">Oficial: ${oficial}</p>
            <p class="inline-p">Blue: ${blue}</p>
            <p class="inline-p">Solidario: ${solidario}</p>
            <p class="inline-p">MEP: ${mep}</p>
            <p class="inline-p">CCL: ${ccl}</p>
        </div>`
    })
}
consultarDolar()

// Argentina, no lo entenderías
setInterval(()=>{
    consultarDolar()
}, 30000)   



/* PRODUCTOS */
//Base de datos
const url = `./data/products.json`

document.addEventListener('DOMContentLoaded', traerProductos);
const botonFinalizar = document.querySelector('#finalizar');

document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carritoGuardado')) || [];
    mostrarCarrito();
});

vaciarCarrito.addEventListener('click', () => {
    carrito.length = [];
    mostrarCarrito();
});


//Función
async function traerProductos() {
    try {
        const resultados = await fetch(url);
        const respuestas = await resultados.json();
        aparecerProd(respuestas);
    } catch (error) {
        console.log(error);}
}
        
function aparecerProd(Productos) {
    Productos.forEach((prod) => {
        const { id, title, price, category, description, image } = prod;
        contenedor.innerHTML += `
        <div class="card" style="width: 18rem;">
        <img src="${image}" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">Marca: ${description}.</p>
        <p class="card-subtitle mb-2 text-body-secondary">Precio: ${price}</p>
        <button class="btn btn-primary" onclick="agregarProducto(${id})">AGREGAR</button>
        </div>
        </div>`;});
}

async function traerProducto() {
    try {
        const resultado = await fetch(url);
        const respuesta = await resultado.json();
        aparecerProd(respuesta);
    } catch (error) {
        console.log(error);
    }
}


let carrito = [];

const agregarProducto = async (id) => {
    try {
        const response = await fetch(url);
        const productos = await response.json();
        const producto = productos.find((prod) => prod.id === id);
        const buscarProducto = carrito.find((prod) => prod.id === id);
        if (!buscarProducto) {
            carrito.push({
                id: producto.id,
                cantidad: 1,
                price: producto.price,
                image: producto.image,
                title: producto.title,
            });
        } else {
            buscarProducto.cantidad++;
        }
    } catch (error) {
        console.log(error);
    }
    mostrarCarrito();
};

const mostrarCarrito = () => {
    const modalBody = document.querySelector('.modal-body');
    const total = document.querySelector('#precioTotal');
    
    modalBody.innerHTML = '';
    carrito.forEach((prod) => {
        const { id, title, price, image, cantidad } = prod;
        const row = document.createElement('div');
        row.classList.add('row', 'my-3');
        row.innerHTML = `
            <div class="col-md-3">
                <img src="${image}" class="img-fluid" alt="Producto">
            </div>
            <div class="col-md-9">
                <div class="d-flex justify-content-between align-items-center">
                    <h6>${title}</h6>
                    <span class="badge bg-primary">$${price}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <span>Cantidad: ${cantidad}</span>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${id})">Eliminar</button>
                </div>
            </div>
        `;
        modalBody.appendChild(row);
    })
    total.innerHTML = calcularTotal();
    localStorage.setItem('carritoGuardado', JSON.stringify(carrito));
    carritoContenedor.textContent = `${calcularCantidad()}`;
};

const eliminarProducto = (id) => {
    const productoEliminado = carrito.find((prod) => prod.id === id);
    productoEliminado.cantidad--;
    if (productoEliminado.cantidad === 0) {
        const indice = carrito.indexOf(productoEliminado);
        carrito.splice(indice, 1);
    }
    mostrarCarrito();
};

const calcularTotal = () => {
    let total = 0;
    carrito.forEach((prod) => {
        const { price, cantidad } = prod;
        total += price * cantidad;
    });
    return total.toFixed(2);
};

const calcularCantidad = () => {
    let cantidad = 0;
    carrito.forEach((prod) => {
        cantidad += prod.cantidad;
    });
    return cantidad;
};

botonFinalizar.addEventListener('click', () => {
    if (carrito.length === 0) {
        Swal.fire('Oops...', 'El carrito está vacío', 'error');
    } else {
        Swal.fire({
            title: '¡Gracias por tu compra!',
            text: 'Tu pedido fue recibido y será procesado',
            icon: 'success',
            confirmButtonText: 'Aceptar',
        });
        carrito = [];
        mostrarCarrito();
    }
});
