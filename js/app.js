const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;



window.onload = () => { //REGISTRAR EL SUBMIT PARA EL FORMULARIO
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){//VALIDAMOS
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === ''){
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();//UNA VES PASAMOS LA VALIDACION BUSCAMOS LAS IMAGENES
}

function mostrarAlerta(mensaje){

    const existeAlerta = document.querySelector('.bg-red-100');
    if(!existeAlerta){
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','max-w-lg','mx-auto','mt-6','text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        },3000);
    }    
}

async function buscarImagenes(){

    const termino = document.querySelector('#termino').value;//TOMAMOS EL VALOR QUE ESCRIBIMOS EN EL INPUT

    const key = '43183949-f96665b258139577ab3728257';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    
    /*fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);//CALCULAMOS LAS PAGINAS DE FORMAS DINAMICA
            mostrarImagenes(resultado.hits);
        })*/

        try{
            const respuesta = await fetch(url); //el await bloquea la ejecucion hasta tener respuesta
            const resultado = await respuesta.json();
            totalPaginas = calcularPaginas(resultado.totalHits);//CALCULAMOS LAS PAGINAS DE FORMAS DINAMICA
            mostrarImagenes(resultado.hits);
        } catch (error) {
            console.log(error);
        }
}

//Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){//CON EL TOTAL DE PAGINAS QUE TENEMOS ARRIBA Y CON EL GENERADOR REGISTRA CUANTAS PAGINAS VA A VER
    //CON EL GENERADOR VA A PERMITIR ITERAR SOBRE TODO EL REGISTRO Y TE VA A DECIR CUANDO LLEGO AL FINAL
    for(let i = 1; i <= total; i++){
        yield i;
    }
}

function calcularPaginas(total){
    return parseInt( Math.ceil( total / registrosPorPagina ));//TOMA EL TOTAL Y LO DIVIDE POR LA CANTIDAD DE REGISTROS
}

function mostrarImagenes(imagenes){//MOSTRAMOS LAS IMAGENES
    while(resultado.firstChild){//PRIMERO LIMPIAMOS NUESTRO HTML
        resultado.removeChild(resultado.firstChild);
    }

    //Iterar sobre el arreglo de imagenes y construir HTML
    imagenes.forEach( imagen => {//RECORRE SOBRE TODO EL ARREGLO Y VA MOSTRANDO LOS RESULTADOS
        const { previewURL, likes, views, largeImageURL } = imagen;
        
        resultado.innerHTML +=`
            <div class="w-1/2 md:w-1/3 lg-:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">

                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light"> Me Gusta </span></p>
                        <p class="font-bold"> ${views} <span class="font-light"> Veces Vista </span></p>

                        <a 
                            class=" block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                        >
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    //limpiar el paginador previo
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    // Generamos el nuevo HTML
    imprimirPaginador();
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    while(true){
        const { value, done } = iterador.next();
        if(done) return;

        //Caso contrario, genera un boton por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold','mb-4', 'rounded');

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}