/*globals $ */

// The script below does essentially nothing other than define some nearly empty methods and a few settings for demonstration purposes
// You can delete this whole thing, or do whatever you want with it

// variable for caching settings
'use strict';

var myMap = L.map('mapId', { zoomControl: false })
	.setView([24.470, 54.3764], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'changemarker'
}).addTo(myMap);

const geocodeHandlerGenerator = (flareType, geocodeObject) => {
	if (flareType === "public"){
		return function(){
			alert(`Sent a public flare for hangout at 
				${geocodeObject.properties.name}\n
				Coords are ${geocodeObject.properties.lat}, ${geocodeObject.properties.lon}`
			);
		}
	}
	else if (flareType === "private"){
		return function(){
			alert(`Sent a private flare for hangout at 
				${geocodeObject.properties.name}\n
				Coords are ${geocodeObject.properties.lat}, ${geocodeObject.properties.lon}`
			);
		}
		
	}
	else{
		alert("Unimplemented so far, blame shanty for this");
	}
}

const addFlareButton = (parentElement, geocodeObject, flareType) => {
	const flareButton = document.createElement('button');
	if (flareType === "public"){
		flareButton.textContent = `send public flare for ${geocodeObject.properties.name}`;
		flareButton.addEventListener("click", geocodeHandlerGenerator("public", geocodeObject));
	}
	else if (flareType === "private"){
		flareButton.textContent = `send private flare for ${geocodeObject.properties.name}`;
		flareButton.addEventListener("click", geocodeHandlerGenerator("private", geocodeObject));
	}
   
    parentElement.appendChild(flareButton);
}



var marker = L.marker([24.470, 54.3764])
  .addTo(myMap)
  .bindPopup('<b>Al Wahda Bus Station</b>')
  .openPopup();

L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: "Search address..."
}).on('markgeocode', function(e) {
    var bbox = e.geocode.bbox;
    var poly = L.polygon([
      bbox.getSouthEast(),
      bbox.getNorthEast(),
      bbox.getNorthWest(),
      bbox.getSouthWest()
    ]).addTo(myMap);
    myMap.fitBounds(poly.getBounds());

    /*Add new helper text and controls*/
    const controlsText = document.getElementById("selected-hangout-spot")
    controlsText.innerText = `Hangout zone set around ${e.geocode.properties.name}`;



    /*Empty the controls section and add new flare controls*/
    const controlsSection = document.getElementById("action-buttons-container");

    controlsSection.replaceChildren();
    addFlareButton(controlsSection, e.geocode, "public");
    addFlareButton(controlsSection, e.geocode, "private");
    

  })
  .addTo(myMap);
