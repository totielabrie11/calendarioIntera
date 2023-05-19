// Obtenemos los elementos HTML relevantes
const calendarBody = document.getElementById("calendar-body");
const calendarMonth = document.getElementById("calendar-month");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const clockTime = document.getElementById("clock-time");
const clockDate = document.getElementById("clock-date");

async function obtenerDatosDB() {
  try {
    const response = await fetch('app/db.json');
    if (response.ok) {
      const parsedEvents = await response.json();
      events = parsedEvents;
      console.log("🚀 ~ file: app.js:25 ~ obtenerDatosDB ~ events:", events);

      //generateCalendar(); // Llamamos a generateCalendar una vez que se obtengan los eventos
    } else {
      console.error('Error al obtener los datos del archivo db.json');
    }
  } catch (error) {
    console.error('Error al obtener los datos del archivo db.json:', error);
  }
}

obtenerDatosDB();

// Configuramos el formato de fecha y hora
const dateFormat = new Intl.DateTimeFormat("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const timeFormat = new Intl.DateTimeFormat("es-ES", { hour: "numeric", minute: "numeric", second: "numeric" });

// Obtenemos la fecha y hora actuales
let currentDate = new Date();

// Arreglo de eventos
let events = [];

// Función para generar el calendario para un mes y año dados
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
  
    // Limpiamos el contenido actual del calendario
    calendarBody.innerHTML = "";
  
    // Creamos un nuevo objeto de fecha para el primer día del mes
    let firstDay = new Date(year, month, 1);
  
    // Obtenemos el número de días en el mes actual
    let numDays = new Date(year, month + 1, 0).getDate();
  
    // Creamos las filas del calendario
    let row = document.createElement("tr");
    for (let i = 0; i < firstDay.getDay(); i++) {
      row.appendChild(document.createElement("td"));
    }
    for (let i = 1; i <= numDays; i++) {
      let cell = document.createElement("td");
      cell.innerText = i;
  
      // Obtener la fecha actual
      let currentCellDate = new Date(year, month, i);
  
      // Buscar eventos en la fecha actual
      const event = events.find(e => {
        const eDate = new Date(e.year, e.month - 1, e.day);
        return eDate.toDateString() === currentCellDate.toDateString();
      });
  
      if (
        currentDate.getFullYear() === year &&
        currentDate.getMonth() === month &&
        currentDate.getDate() === i
      ) {
        cell.classList.add("today");
      }
  
      // Agregar la clase "pintadoClassVerde" si hay un evento en la fecha actual
      if (event) {
        cell.classList.add(event.pintado);
      }
  
      row.appendChild(cell);
  
      if ((i + firstDay.getDay()) % 7 === 0) {
        calendarBody.appendChild(row);
        row = document.createElement("tr");
      }
    }
    if (row.children.length < 7) {
      for (let i = row.children.length; i < 7; i++) {
        row.appendChild(document.createElement("td"));
      }
    }
    calendarBody.appendChild(row);
  
    // Actualizamos el título del calendario con el mes y año actuales
    calendarMonth.innerText = firstDay.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    // Añadimos los listeners de los días del calendario
    let daysContainer = document.querySelectorAll("#calendar-body td");
    daysContainer.forEach(day => {
      day.addEventListener("click", () => {
        console.log(`Día seleccionado: ${day.innerText}`);
      });
    });
  
    // Iteramos sobre los eventos obtenidos mediante la llamada AJAX
    events.forEach(event => {
      const { date } = event;
      const eventDate = new Date(date);
      const eventDateString = eventDate.toISOString().split("T")[0];
      const dayElement = document.querySelector(`[data-date="${eventDateString}"]`);
  
      console.log("Fecha del evento:", eventDateString);
      console.log("Elemento del día correspondiente:", dayElement);
  
      if (dayElement) {
        console.log("Aplicando clase 'pintarVerde' al día:", eventDateString);
        dayElement.classList.add("pintarVerde");
      } else {
        console.log("No se encontró el día correspondiente:", eventDateString);
      }
    });
  }
  


// Función para actualizar el reloj digital
function updateClock() {
    // Obtenemos la fecha y hora actuales
    currentDate = new Date();

    // Actualizamos el reloj digital
    clockTime.innerText = timeFormat.format(currentDate);
    clockDate.innerText = dateFormat.format(currentDate);
}

// Generamos el calendario y actualizamos el reloj digital por primera vez
let displayDate = new Date(currentDate);
generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
updateClock();

// Añadimos los listeners de los botones del calendario
prevBtn.addEventListener("click", function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    addClickEventToCells();
});

nextBtn.addEventListener("click", function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    addClickEventToCells();
});

function addClickEventToCells() {
    // Obtenemos los elementos td de la tabla
    const tdElements = document.querySelectorAll("#calendar-body td");

    // Agregamos el evento click a cada elemento td
    tdElements.forEach(function(td) {
        td.addEventListener("click", function() {
            handleDayClick(td, currentDate.getFullYear(), currentDate.getMonth());
        });
    });
}

// Creamos un objeto de mapeo para almacenar la información de clase de cada fecha
const eventClassMap = {};

function openModal(newEvent) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Agregar evento</h2>
            <label for="event-content">Contenido:</label>
            <input type="text" id="event-content" name="event-content">
            <button id="save-event-btn">Guardar</button>
        </div>
    `;
    document.body.appendChild(modal);

    const saveEventBtn = document.getElementById("save-event-btn");
    saveEventBtn.addEventListener("click", function() {
        const taskInput = document.getElementById("event-content");
        newEvent.task = taskInput.value;
        newEvent.pintado = "pintarVerde";
        console.log(newEvent);
        modal.remove();

        // Volvemos a generar el calendario para reflejar el evento guardado
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        addClickEventToCells(); // Agregamos nuevamente el evento de clic a las celdas del calendario
       
        enviarEventoDb(newEvent)
    });
}


// Función para manejar el evento de clic en un día del calendario
// Función para manejar el evento de clic en un día del calendario
function handleDayClick(td, year, month) {
  const selectedDate = new Date(year, month, td.innerText);
  console.log(`Se hizo clic en el día ${selectedDate.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`);

  // Creamos un objeto de evento con la fecha seleccionada
  const newEvent = {
    date: selectedDate,
    day: selectedDate.getDate(),
    month: selectedDate.getMonth() + 1,
    year: selectedDate.getFullYear(),
    task: "",
    pintado: "pintarVerde" // Actualizamos el valor de pintado
  };

  // Validar los datos del nuevo evento antes de agregarlo
  if (validarDatosEvento(newEvent)) {
    // Agregamos el objeto de evento al arreglo de eventos
    events.push(newEvent);

    // Almacenamos la información de clase en el objeto de mapeo
    eventClassMap[selectedDate.toISOString().split("T")[0]] = newEvent.pintado;

    openModal(newEvent);
  }
}


// Función para validar los datos del nuevo evento
function validarDatosEvento(newEvent) {
  // Verificar que se haya proporcionado un valor para la fecha del evento
  if (!newEvent.date) {
    alert("La fecha del evento es obligatoria.");
    return false;
  }

  // Verificar que la fecha no sea en el pasado
  const currentDate = new Date();
  if (newEvent.date < currentDate) {
    alert("La fecha del evento no puede ser en el pasado.");
    return false;
  }

  // Verificar que no exista un evento con la misma fecha
  const existingEvent = events.find((event) => {
    const eventDate = new Date(event.year, event.month - 1, event.day);
    return eventDate.toDateString() === newEvent.date.toDateString();
  });

  if (existingEvent) {
    alert("Ya existe un evento en la fecha seleccionada.");
    return false;
  }

  return true; // Los datos son válidos
}

// Función para manejar el evento de clic en un día del calendario
function handleDayClick(td, year, month) {
  const selectedDate = new Date(year, month, td.innerText);
  console.log(`Se hizo clic en el día ${selectedDate.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`);

  // Creamos un objeto de evento con la fecha seleccionada
  const newEvent = {
    date: selectedDate,
    day: selectedDate.getDate(),
    month: selectedDate.getMonth() + 1,
    year: selectedDate.getFullYear(),
    task: "",
    pintado: "pintarVerde" // Actualizamos el valor de pintado
  };

  // Validar los datos del nuevo evento antes de agregarlo
  if (validarDatosEvento(newEvent)) {
    // Agregamos el objeto de evento al arreglo de eventos
    events.push(newEvent);

    // Almacenamos la información de clase en el objeto de mapeo
    eventClassMap[selectedDate.toISOString().split("T")[0]] = newEvent.pintado;

    openModal(newEvent);
  }
}

// Función para manejar el nuevo evento creado
function nuevoEventoCreado(event) {
    console.log(`Nuevo evento creado: ${event.task}`);
    console.log(`Fecha: ${event.date.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`);

    // Almacenar la fecha actual en eventDate
    const eventDate = new Date();

    // Generar el calendario y actualizar la celda correspondiente
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

    console.log(eventDate);
}

// Generamos el calendario y actualizamos el reloj digital por primera vez
generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
addClickEventToCells();
updateClock();

// Actualizamos el reloj digital cada segundo
setInterval(updateClock, 1000);

function enviarEventoDb(newEvent){
// Realizar una solicitud POST al servidor

    fetch('http://localhost:3000/events', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEvent)
    })
    .then(response => response.json())
    .then(data => {
    console.log('Usuario agregado:', data);
    alert('Usuario agregado correctamente.');
    // Aquí puedes realizar acciones adicionales después de agregar el usuario
    })
    .catch(error => {
    console.error('Error al agregar el usuario:', error);
    alert('Ocurrió un error al agregar el usuario. Por favor, revisa la consola para más información.');
    });

}