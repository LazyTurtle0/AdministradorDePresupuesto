//Variables y Selectores
const  formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos 
eventListener();

function eventListener() {
    
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGastos);

}


//Clases
class Presupuesto{
    
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }


    nuevoGasto( gastos){

        this.gastos = [...this.gastos, gastos];
        this.calcularRestante()
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;

        console.log(this.restante);

    } 
    eliminarGasto(id){
        console.log(id);
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    } 
}

class UI {

    insertarPresupuesto (cant){
        // Extraemos valores
        const {presupuesto, restante} = cant;
        // console.log(`total = ${presupuesto} y restante ${restante}`);
        // Insertamos los datos en el html
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
 
 
    }

    imprimirAlerta(mensaje, tipo){
         // crear el div
         const divMensaje = document.createElement('div');
         divMensaje.classList.add('text-center', 'alert');

         if(tipo === 'error'){
           divMensaje.classList.add('alert-danger');
         } else{
             divMensaje.classList.add('alert-success');
        }

        //mensaje de error

        divMensaje.textContent = mensaje;

        // insertar en el html

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() =>  {
            divMensaje.remove();

        }, 3000);
    }

    agregarGastoListado(gasto){
        // iterar sobre los gastos
        this.limpiarHTML();
        gasto.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;

            //crear un LI

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            // Aca se muestran las 2 formas de setear el id; uno con sel setAttribute el otro con la forma mas nueva el data set
            //nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id = id;
            

            // Agreagar el gasto

            nuevoGasto.innerHTML = ` ${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`;

            //Bottom borrar gastos
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            // si se hace con arrow function hasta que se aplique el evento se ejecuta la funcion de eliminar gastos.
            btnBorrar.onclick = () =>{
                eliminarGasto(id );
            }

            
            nuevoGasto.appendChild(btnBorrar);

            // agregar al html
            gastoListado.appendChild(nuevoGasto);

        });
    }

    limpiarHTML(){
        while (gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);

        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }
    comprobarPresupuesto(presupuestoObj){
        const{presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');
        if((presupuesto /4 ) > restante){
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
            
        }else if((presupuesto /2 ) > restante){
            restanteDiv.classList.remove('alert-success','alert-danger');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-warning','alert-danger');
            restanteDiv.classList.add('alert-success')
        }
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
        }
    }


    //
    

}


//Instamcias
let ui = new UI();
let presupuesto



// Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    //console.log( Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        
        window.location.reload();
    } 
    presupuesto = new Presupuesto(presupuestoUsuario);


    ui.insertarPresupuesto(presupuesto);
}




// anade gastos

function agregarGastos(e){

    e.preventDefault();

    //leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad =  Number( document.querySelector('#cantidad').value);
    // console.log(`total = ${nombre} y restante ${cantidad}`);

    if(nombre === '' || cantidad === ''){
        
        ui.imprimirAlerta('Ambos campos son obligatorios' ,  'error');

        return;
    }else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error' );
        return;
    }

    // Generar objeto con el gastos

    const gasto = {nombre, cantidad, id:Date.now()};


    //anade un nuevo gasto

    presupuesto.nuevoGasto(gasto);


    //Mensaje de correcto
    
    ui.imprimirAlerta('Gasto agregado correctamente');

    // Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    

    //Reinicia el formulario


    formulario.reset();
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}




 
