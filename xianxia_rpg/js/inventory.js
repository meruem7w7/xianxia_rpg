// js/map.js
import { showMessage } from "./ui.js";

const mapData = {
  aldea_inicial: {
    name: "Aldea Tranquila",
    description: "Una pequeña aldea al pie de la montaña.",
    connections: ["bosque_susurrante"],
  },
  bosque_susurrante: {
    name: "Bosque Susurrante",
    description: "Un bosque lleno de secretos y peligros.",
    connections: ["aldea_inicial", "cueva_olvidada"],
  },
  cueva_olvidada: {
    name: "Cueva Olvidada",
    description: "Una cueva oscura con rumores de tesoros.",
    connections: ["bosque_susurrante"],
  },
};

let currentLocationKey = "aldea_inicial";

function showMap() {
  const mapDiv = document.getElementById("map-panel"); // Asegurando el ID correcto
  if (!mapDiv) return;

  const location = mapData[currentLocationKey];
  if (!location) return;

  mapDiv.innerHTML = `
    <h2>Mapa</h2>
    <p>Estás en: <b>${location.name}</b></p>
    <p>${location.description}</p>
    <h3>Conexiones:</h3>
    <ul>
      ${location.connections
        .map(
          (connection) =>
            `<li><button class="travel-button button" data-location="${connection}">
              ${mapData[connection].name}
            </button></li>`
        )
        .join("")}
    </ul>
  `;

  const travelButtons = mapDiv.querySelectorAll(".travel-button");
  travelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const newLocation = button.dataset.location;
      travelTo(newLocation);
    });
  });
}

function travelTo(newLocationKey) {
  const currentLocation = mapData[currentLocationKey];
  if (!currentLocation) return;

  if (currentLocation.connections.includes(newLocationKey)) {
    currentLocationKey = newLocationKey;
    showMessage(`Viajaste a ${mapData[newLocationKey].name}.`, 'normal');
    showMap();
  } else {
    showMessage("No puedes viajar a esa ubicación desde aquí.", 'alerta');
  }
}

export { showMap, travelTo, currentLocationKey };
