
'use strict';

var categoriesCache = {};

var iWindow = null;

var categoriesQueries = {
  "Sendas": {
    "id": '1XWcOfx5YCW2m36wJXwL5kPJztK2uJ7b3JkLxeAMp',
    "number": 0,
    "style": 2,
    "template": 3
  },
  
  "Espacios naturales": {
    "id": "",
    "number": 1
  },
  "Miradores": {
    "id": "",
    "number": 2
  },
  "Árboles singulares": {
    "id": "",
    "number": 3
  },
  "Puntos de interés": {
    "id": "",
    "number": 4
  },
  "Lugares de descanso": {
    "id": "",
    "number": 5
  },
  
  "Municipios": {
    "id": "",
    "number": 6
  },
  
  "Provincias": {
    "id": "",
    "number": 7
  }
  
};

var parseTextSenda = function parseTextSenda(infoWindow) {
  var infoText = infoWindow.split("\n");
  var infoNewWindow = infoText[0];
  for(var i = 1; i < infoText.length - 1; i++) {
    var t = infoText[i];
    var label = t.substring(t.indexOf("<b>")+3, t.indexOf("</b>")-1);
    var value = t.substring(t.indexOf("</b>")+5, t.indexOf("<br>"));
    if ((label === 'Longitud' && value === '0.0') || 
        (label === 'Tiempo estimado' && value === '0') ||
        (value === ' %') ||
        (value === '')) {
      continue;
    } else {
      infoNewWindow += "\n";
      infoNewWindow += t;
    }
  }
  infoNewWindow += "\n";
  infoNewWindow += infoText[infoText.length-1];
  return infoNewWindow;
};

var hideFacetsInfo = function hideFacetsInfo(name) {
  if(iWindow !== null) {
    iWindow.close();
    iWindow = null;
  }
  categoriesCache[name].setMap(null);
  delete categoriesCache[name];
};

var showFacetsInfo = function showFacetsInfo(name) {
  
  var numberFacet = categoriesQueries[name].number;
  
  // Add Loading Spinner
  $($('.facet')[numberFacet]).append(
    '<i class="fa fa-spinner fa-spin spinning"></i>'
  );
  
  var url = categoriesQueries[name].id;
  
  categoriesCache[name] = new google.maps.FusionTablesLayer({
		map: gmap,
		query: {
			select: "geometry",
			from: url
		},
		options: {
			styleId: categoriesQueries[name].style,
			templateId: categoriesQueries[name].template,
			suppressInfoWindows: false
		}
	});
  
  google.maps.event.addListener(categoriesCache[name], 'click',
    function(e) {
    
    // Close previous infoWindow
    if (iWindow !== null) {
      iWindow.close();
      iWindow = null;
    }
    
    // Get Identifier
    var val = e.row['atr_gr_id'].value;

    // Change Style for Fusion Table Object
    categoriesCache[name].set("styles", [{
      where: "'atr_gr_id' IN("+val+")",
      polylineOptions: {
        strokeColor: "#FF0000"
      }
    }]);
    
    // Generate InfoWindow Content
    var infoNewWindow;
    if(name === 'Sendas') {
      infoNewWindow = parseTextSenda(e.infoWindowHtml);
    }
    iWindow = new google.maps.InfoWindow();
    iWindow.setContent(infoNewWindow);
    iWindow.setPosition(e.latLng);
    iWindow.open(gmap);
    
    // Add event for close button on InfoWindow
    google.maps.event.addListener(iWindow, 'closeclick', function() {
      iWindow = null;
      categoriesCache[name].set("styles", [{
        where: "'atr_gr_id' IN("+val+")",
        polylineOptions: {
          strokeColor: "#073763"
        }
      }]);
    });
    
  });
  
  $('.facet')[numberFacet].children[2].remove();
  
};