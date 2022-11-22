import { MarkerClusterer } from "https://cdn.skypack.dev/@googlemaps/markerclusterer@2.0.3";
let map, infoWindow, modal;

var directions_service, directions_renderer, last_location;
var curr_loc = { lat: 0, lng: 0 };
const locations = [
  { lat: 4.635954109272763, lng: -74.08587992191316, id: "urras" },
  {
    lat: 4.636392552276947,
    lng: -74.08646464347841,
    id: "c_pequenos_animales",
  },
  {
    lat: 4.641397199478734,
    lng: -74.08392190933229,
    id: "centro_acoplo",
  },
  {
    lat: 4.639429564639469,
    lng: -74.0900480747223,
    id: "lab_ing_amb",
  },
  {
    lat: 4.642584193930078,
    lng: -74.08329963684083,
    id: "inst_genetica",
  },
  {
    lat: 4.635178813050736,
    lng: -74.08308506011964,
    id: "biblio_central",
  },
];

function initMap() {
  directions_service = new google.maps.DirectionsService();
  directions_renderer = new google.maps.DirectionsRenderer();
  infoWindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17,
    center: { lat: 4.63474255, lng: -74.08423776755 },
    styles: {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ color: "white" }],
    },
  });
  directions_renderer.setMap(map);
  const markers = locations.map((location) => {
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      icon: "../images/categorias-cleansm.png",
    });

    marker.addListener("click", () => {
      modal = document.getElementById(location.id);
      modal.style.display = "flex";
      last_location = { lat: location.lat, lng: location.lng };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            curr_loc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
      const dx = Math.abs(curr_loc.lng - last_location.lng);
      const dy = Math.abs(curr_loc.lat - last_location.lat);
      const margin = 0.0002;
      if (dx + dy < margin) {
        const play_button = document.getElementById(location.id + "b");
        play_button.classList.remove("disabled");
      }
    });
    return marker;
  });
  new MarkerClusterer({ markers, map });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function calculateAndDisplayRoute(
  directionsService,
  directionsRenderer,
  origin,
  destination
) {
  directionsService
    .route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.WALKING,
    })
    .then((res) => {
      directionsRenderer.setDirections(res);
    })
    .catch((e) => window.alert("Directions request failed due to " + e));
}

window.initMap = initMap;

const closeBtns = document.querySelectorAll(
  ".modal__wrapper__contents__logo__close"
);
closeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.style.display = "none";
  });
});

const go_to_button = document.querySelectorAll(".go-btn");
go_to_button.forEach((button) => {
  button.addEventListener("click", (btn) => {
    const dx = Math.abs(curr_loc.lng - last_location.lng);
    const dy = Math.abs(curr_loc.lat - last_location.lat);
    const margin = 0.0002;

    if (dx + dy > margin) {
      calculateAndDisplayRoute(
        directions_service,
        directions_renderer,
        { lat: curr_loc.lat, lng: curr_loc.lng },
        { lat: last_location.lat, lng: last_location.lng }
      );
    }
  });
});

const infoModal = document.querySelector("#map_info");
const infoBtn = document.querySelector(".info-btn");
infoBtn.addEventListener("click", () => {
  infoModal.style.display = "flex";
});
const closeInfoBtn = document.querySelector(
  ".info__modal__wrapper__contents__close"
);
closeInfoBtn.addEventListener("click", () => {
  infoModal.style.display = "none";
});
