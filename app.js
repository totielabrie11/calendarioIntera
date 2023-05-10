// Obtenemos los elementos HTML relevantes
const calendarBody = document.getElementById("calendar-body");
const calendarMonth = document.getElementById("calendar-month");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const clockTime = document.getElementById("clock-time");
const clockDate = document.getElementById("clock-date");

// Configuramos el formato de fecha y hora
const dateFormat = new Intl.DateTimeFormat("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const timeFormat = new Intl.DateTimeFormat("es-ES", { hour: "numeric", minute: "numeric", second: "numeric" });

// Obtenemos la fecha y hora actuales
let currentDate = new Date();

// Función para generar el calendario para un mes y año dados
function generateCalendar(year, month) {
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
		if (currentDate.getFullYear() === year && currentDate.getMonth() === month && currentDate.getDate() === i) {
			cell.classList.add("today");
		}
		row.appendChild(cell);
		if ((i + firstDay.getDay()) % 7 === 0) {
			calendarBody.appendChild(row);
			row = document.createElement("tr");
		}
	}
	if (row.children.length > 0) {
		calendarBody.appendChild(row);
	}

	// Actualizamos el título del calendario con el mes y año actuales
	calendarMonth.innerText = firstDay.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
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
generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
updateClock();

// Añadimos los listeners de los botones del calendario
prevBtn.addEventListener("click", function() {
	currentDate.setMonth(currentDate.getMonth() - 1);
	generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});
nextBtn.addEventListener("click", function() {
	currentDate.setMonth(currentDate.getMonth() + 1);
	generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

// Actualizamos el reloj digital cada segundo
setInterval(updateClock, 1000);