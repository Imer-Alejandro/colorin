let tabla = document.querySelector('table');

// Colores válidos
const validColors = {
    rojo: "red",
    azul: "blue",
    naranja: "orange",
    verde: "green",
    amarillo: "yellow",
    morado: "purple",
    negro: "black",
};

// Contadores de colores
let colorCounters = {
    rojo: 0,
    azul: 0,
    naranja: 0,
    verde: 0,
    amarillo: 0,
    morado: 0,
    negro: 0,
};

// Inicializar la tabla desde el localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedTable = JSON.parse(localStorage.getItem("tabla"));
    if (savedTable) {
        recreateTable(savedTable);
    }
    updateColorCounters();
});

function Create_table() {
    // Validar que no existan más tablas antes de crear otra
    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }

    // Datos de entrada
    let Input_Filas = document.querySelector('#filas');
    let Input_Columnas = document.querySelector('#columnas');

    let filas = parseInt(Input_Filas.value);
    let columnas = parseInt(Input_Columnas.value);

    // Validación de datos
    if (isNaN(filas) || isNaN(columnas) || filas <= 0 || columnas <= 0) {
        alert("Por favor, ingresa valores válidos para filas y columnas.");
        return;
    }

    // Crear columnas
    let containerColumnas = document.createElement('tr');
    for (let i = 0; i < columnas; i++) {
        let nuevaColumna = document.createElement('th');
        let inputColumna = document.createElement('input');
        nuevaColumna.appendChild(inputColumna);
        containerColumnas.appendChild(nuevaColumna);
    }
    tabla.appendChild(containerColumnas);

    // Crear filas
    for (let f = 0; f < filas; f++) {
        let containerFilas = document.createElement('tr');
        for (let r = 0; r < columnas; r++) {
            let nuevaFila = document.createElement('td');
            let inputFila = document.createElement('input');

            // Crear un ID único basado en la posición de la celda
            let idInput = `celda-${f}-${r}`;
            inputFila.setAttribute("id", idInput);

            // Agregar evento para cambiar color al perder foco
            inputFila.addEventListener("blur", function () {
                cambiarColor(idInput);
            });

            nuevaFila.appendChild(inputFila);
            containerFilas.appendChild(nuevaFila);
        }
        tabla.appendChild(containerFilas);
    }

    // Mostrar botón para eliminar tabla manualmente
    document.querySelector('.container_btn_delete_table').style.display = 'block';

    // Guardar la tabla en localStorage
    saveTableState();

    // Limpiar los inputs
    Input_Filas.value = '';
    Input_Columnas.value = '';
}

// Función para cambiar el color de fondo
function cambiarColor(inputId) {
    const input = document.getElementById(inputId);
    const colorTexto = input.value.trim().toLowerCase(); // Convertir texto a minúsculas y eliminar espacios
    const colorCSS = validColors[colorTexto];

    if (colorCSS) {
        input.parentElement.style.backgroundColor = colorCSS;
        input.style.backgroundColor = colorCSS;
        input.style.border = `3px ${colorCSS} solid`;
        input.style.color = 'white';

        // Actualizar contadores
        if (colorCounters[colorTexto] !== undefined) {
            colorCounters[colorTexto]++;
            updateColorCounters();
        }

        input.value = ''; // Limpiar el texto del input
    } else {
        input.parentElement.style.backgroundColor = ''; // Restablecer color si no es válido
    }

    saveTableState();
}


// Eliminar tabla de forma manual
function delete_table() {
    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }
    document.querySelector('.container_btn_delete_table').style.display = 'none';

    // Limpiar localStorage
    localStorage.removeItem("tabla");

    // Reiniciar contadores
    resetColorCounters();
    updateColorCounters();
}

// Reiniciar contadores de colores
function resetColorCounters() {
    Object.keys(colorCounters).forEach(color => {
        colorCounters[color] = 0;
    });
}

// Guardar el estado de la tabla en localStorage
function saveTableState() {
    const tableState = [];
    const rows = tabla.querySelectorAll("tr");
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll("td input").forEach(input => {
            rowData.push({
                value: input.value,
                color: input.parentElement.style.backgroundColor || ""
            });
        });
        tableState.push(rowData);
    });
    localStorage.setItem("tabla", JSON.stringify(tableState));
}

// Reconstruir la tabla desde el localStorage
function recreateTable(savedTable) {
    savedTable.forEach(rowData => {
        const row = document.createElement("tr");
        rowData.forEach(cellData => {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            if (cellData.color) {
                cell.style.backgroundColor = cellData.color;
            }
            input.value = cellData.value || "";
            input.addEventListener("blur", function () {
                cambiarColor(input.id);
            });
            cell.appendChild(input);
            row.appendChild(cell);
        });
        tabla.appendChild(row);
    });
}

// Reiniciar contadores de colores
function resetColorCounters() {
    Object.keys(colorCounters).forEach(color => {
        colorCounters[color] = 0;
    });
}

// Actualizar los contadores de colores en el DOM
function updateColorCounters() {
    Object.keys(colorCounters).forEach(color => {
        const counterElement = document.getElementById(`counter-${color}`);
        if (counterElement) {
            counterElement.textContent = colorCounters[color];
        }
    });
}
