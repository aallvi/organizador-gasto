// variables y selectores

const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')





// eventos
eventListeners();
function eventListeners() {

    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)

    formulario.addEventListener('submit', agregarGasto)
}



// clases


class Presupuesto {

   constructor (presupuesto) {
       this.presupuesto = Number(presupuesto)
       this.restante = Number(presupuesto)
       this.gastos = [];
   }

   nuevoGasto(gasto){
       this.gastos = [...this.gastos, gasto]
       
       this.calcularRestante();
   }
    
   calcularRestante(){
    const gastado = this.gastos.reduce( (total,gasto)=> total + gasto.cantidad, 0)
     
    this.restante = this.presupuesto - gastado

   }

   eliminarGasto(id) {

    this.gastos = this.gastos.filter(gasto => gasto.id !== id)

    this.calcularRestante();
   }

}


class UI {

insertarPresupuesto ( cantidad){
    
    const {presupuesto, restante } = cantidad;

    document.querySelector('#total').innerHTML = presupuesto
    document.querySelector('#restante').innerHTML = restante



}

imprimirAlerta(mensaje, tipo) {

    // crear div

    const divMensaje = document.createElement('div')
    divMensaje.classList.add('text-center', 'alert')

    if(tipo === 'error'){
        divMensaje.classList.add('alert-danger')
    } else {
        divMensaje.classList.add('alert-success')
    }
   
    // mensaje de error

    divMensaje.innerHTML = mensaje;


    // insertar en el html

    document.querySelector('.primario').insertBefore(divMensaje, formulario)
    
        setTimeout (() => {
            
        divMensaje.remove();

        }, 3000  )
}


  mostrarGastos(gastos) {
     // iterar sobre los gastos
    this.limpiarHTML();

     gastos.forEach( gasto => {
         const {cantidad, nombre, id} = gasto;

         // crear un LI 

         const nuevoGasto = document.createElement('li')
         nuevoGasto.className = 'list-group-itm d-flex justify-content-between align-items-center';
         nuevoGasto.setAttribute('data-id', id)
        

       // agregar el html edl gasto

       nuevoGasto.innerHTML = `
       ${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>
       
       `
       

       // boton para borrar el gasto
       const btnBorrar = document.createElement('button')
       btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
       btnBorrar.innerHTML = '&times'
       btnBorrar.onclick = () => {
           eliminarGasto(id)
       }
       nuevoGasto.appendChild(btnBorrar)



       // agregar el HTML 

        gastoListado.appendChild(nuevoGasto)


     })



  }

  limpiarHTML() {
      while (gastoListado.firstChild){
          gastoListado.removeChild(gastoListado.firstChild)
      }
  }


  actualizarRestante(restante){

    document.querySelector('#restante').innerHTML = restante


  }

  comprobarPresupuesto(presupuestoObj){

    const restanteDiv = document.querySelector('.restante')

    const {presupuesto,restante} = presupuestoObj;

    // comprobar 25%

    if( (presupuesto / 4) > restante)  {

        restanteDiv.classList.remove('alert-success', 'alert-warning')
        restanteDiv.classList.add('alert-danger')

    } else if ( (presupuesto / 2) > restante && restante > (presupuesto / 4))  {

        restanteDiv.classList.remove('alert-success', 'alert-danger')
        restanteDiv.classList.add('alert-warning')

    } else { 
        restanteDiv.classList.remove('alert-warning', 'alert-danger')
        restanteDiv.classList.add('alert-success')
    }
    // else {
    //     restanteDiv.classList.remove('alert-danger', 'alert-warning')
    //     restanteDiv.classList.add('alert-success')
    // }

    if(restante <= 0) {

        ui.imprimirAlerta('el Presupuesto se ha agotado', 'error')
    }
    

  }



}


// instanciar
const ui = new UI();

let presupuesto;

//funciones


function preguntarPresupuesto() {

    const presupuestoUsuario = prompt('¿Cual es tu Presupuesto?')

    // console.log(Number(presupuestoUsuario) );

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {
        window.location.reload()
    }

    presupuesto = new Presupuesto(presupuestoUsuario)
    
    
    ui.insertarPresupuesto(presupuesto)

}

function agregarGasto(e){
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value) 


    // validar

    if (nombre === '' || cantidad ===''){
        
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    return;

    } else if ( cantidad <= 0 || isNaN(cantidad)) {

        ui.imprimirAlerta('Debes agregar una cantidad valida', 'error');

        return;


    }
    

    // objeto tipo gasto

    const gasto = {nombre, 
                   cantidad, 
                   id: Date.now()  }
    
    presupuesto.nuevoGasto(gasto);

    // mensaje de todo ok

    ui.imprimirAlerta('Gasto Agregado')
    
    // imprimir los gastos
    const {gastos,restante} = presupuesto
    ui.mostrarGastos(gastos)

    ui.actualizarRestante(restante)

    ui.comprobarPresupuesto(presupuesto);

    //reinicia formulario
    formulario.reset();
    
    
}


function eliminarGasto(id) {

    // elimina gastos del objeto

     presupuesto.eliminarGasto(id)

     //elimina gastos html

     const {gastos,restante} = presupuesto
     ui.mostrarGastos(gastos)

     ui.actualizarRestante(restante)

     ui.comprobarPresupuesto(presupuesto);
}