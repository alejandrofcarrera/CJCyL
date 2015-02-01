
'use strict';

var categoriesCache = {};

var categoriesOrder = {};

var iWindow = null;

var categoriesQueries = {
  "Sendas": {
    "id": '1XWcOfx5YCW2m36wJXwL5kPJztK2uJ7b3JkLxeAMp',
    "number": 0,
    "type": "line"
  },
  "Espacios naturales": {
    "id": "1fW6CPtx1Ab7ozWvOeGP3lk_fV4xgwpvHRVHeApt6",
    "number": 1,
    "type": "polygon"
  },
  "Miradores": {
    "id": "103M34f8drtHCW1CSjy_zmkf68PajhJPEv7TqON5z",
    "number": 2,
    "type": "point"
  },
  "Árboles singulares": {
    "id": "1F6ccBvHYJBlx8Tdan_p4USVbOH3Iw8BSTeQRuDfa",
    "number": 3,
    "type": "point"
  },
  
  //Refugios, Zonas Acampada
  "Lugares de descanso": {
    "id": "19mG4jgXSLvAlNLQGpbz2cJqFHSGQ7iTKE-Ag1MFh", 
    "number": 4,
    "type": "point"
  },
  
  //Aparcamientos, C.Parque, C.Visitantes, Otros, Zonas
  //Recreativas, Quioscos, Campamentos
  "Otros": {
    "id": "1v_VOQdlusNknn7StYwEZDltiYI7M-G4SljsLII0e", 
    "number": 5,
    "type": "point"
  },
  "Municipios": {
    "id": "16j8wgXuaZ6NwKsu5c9gw9gY9qn-ietBLzskNd64e",
    "number": 6
  },
  
  "Provincias": {
    "id": "14p6dvbaxAC0YFUW1gggjfHPlV830WQK6xlWlqWDo",
    "number": 7
  }
  
};

var hideFacetsInfo = function hideFacetsInfo(name) {
  if(iWindow !== null) {
    iWindow.close();
    iWindow = null;
  }
  categoriesCache[name].setMap(null);
  delete categoriesCache[name];
  delete categoriesOrder[name];
};

var generateLayer = function generateLayer(name) {
  
  var clicked = (name === 'Municipios' || 
      name === 'Provincias') ? false : true;
  
  var layerOptions = {
		query: {
			select: "geometry",
			from: categoriesQueries[name].id,
      where: "atr_gr_visible = 'true' AND equip_b_nombre NOT EQUAL TO ''",
		},
    options: {
      styleId: 2,
      templateId: (name === 'Lugares de descanso' || name === 'Otros') ? 2 : 3
    },
    suppressInfoWindows: true,
    clickable: clicked,
	};
  
  categoriesCache[name] = new google.maps.FusionTablesLayer(layerOptions);
  
  if(clicked) {
    google.maps.event.addListener(categoriesCache[name], 'click', function(e) {
    
      // Close previous infoWindow
      if (iWindow !== null) {
        iWindow.close();
        iWindow = null;
      }

      // Get Identifier
      var val = e.row['atr_gr_id'].value;

      // Generate InfoWindow Content
      var infoNewWindow;
      if(name === 'Sendas') {
        infoNewWindow = parseTextSenda(e);
      } else if(name === 'Espacios naturales') {
        infoNewWindow = parseTextEspacio(e);
      } else if(name === 'Miradores') {
        infoNewWindow = parseTextGenerico(e, 'mirador');
      } else if(name === 'Árboles singulares') {
        infoNewWindow = parseTextGenerico(e, 'árbol singular');
      } else if(name === 'Lugares de descanso') {
        infoNewWindow = parseTextDescanso(e);
      } else {
        infoNewWindow = parseTextOtros(e);
      }
      iWindow = new google.maps.InfoWindow();
      iWindow.setContent(infoNewWindow);
      iWindow.setPosition(e.latLng);
      iWindow.open(gmap);
 
    });
  }
  
};

var reorderCategories = function reorderCategories() {
  
  // Hide Layers Caché
  for(var i in categoriesCache) {
    categoriesCache[i].setMap(null);
  }
  
  // Reorder Layers
  var sortable = [];
  for (var i in categoriesOrder) {
    sortable.push([i, categoriesOrder[i]])
  }
  sortable.sort(function(a, b) {return a[1] - b[1]})

  // Show Layers Caché
  for(var i = 0; i < sortable.length; i++) {
    categoriesCache[sortable[i][0]].setMap(gmap);
  }
  
};

var removeFacet = function removeFacet(name) {
  $($('.facet')[categoriesQueries[name].number]).removeClass('on');
  hideFacetsInfo(name);
};

var showFacetsInfo = function showFacetsInfo(name) {
  
  // Close InfoWindow
  if(iWindow !== null) {
    iWindow.close();
    iWindow = null;
  }
  
  // Check only Municipios or Provincias is at the same time
  if(name === 'Municipios' && typeof categoriesCache['Provincias'] !== 'undefined') {
    removeFacet('Provincias');
  }
  else if(name === 'Provincias' && typeof categoriesCache['Municipios'] !== 'undefined') {
    removeFacet('Municipios');
  }
  
  // Check only a place is at the same time
  else if(name === 'Miradores') {
    if (typeof categoriesCache['Árboles singulares'] !== 'undefined') {
      removeFacet('Árboles singulares');
    } else if (typeof categoriesCache['Lugares de descanso'] !== 'undefined') {
      removeFacet('Lugares de descanso');
    } else if (typeof categoriesCache['Otros'] !== 'undefined') {
      removeFacet('Otros');
    }
  } else if(name === 'Árboles singulares') {
    if (typeof categoriesCache['Miradores'] !== 'undefined') {
      removeFacet('Miradores');
    } else if (typeof categoriesCache['Lugares de descanso'] !== 'undefined') {
      removeFacet('Lugares de descanso');
    } else if (typeof categoriesCache['Otros'] !== 'undefined') {
      removeFacet('Otros');
    }
  } else if(name === 'Lugares de descanso') {
    if (typeof categoriesCache['Miradores'] !== 'undefined') {
      removeFacet('Miradores');
    } else if (typeof categoriesCache['Árboles singulares'] !== 'undefined') {
      removeFacet('Árboles singulares');
    } else if (typeof categoriesCache['Otros'] !== 'undefined') {
      removeFacet('Otros');
    }
  } else if(name === 'Otros') {
    if (typeof categoriesCache['Miradores'] !== 'undefined') {
      removeFacet('Miradores');
    } else if (typeof categoriesCache['Árboles singulares'] !== 'undefined') {
      removeFacet('Árboles singulares');
    } else if (typeof categoriesCache['Lugares de descanso'] !== 'undefined') {
      removeFacet('Lugares de descanso');
    }
  }

  // Check ZIndex of facets for reorder
  if (name === 'Sendas') {
    categoriesOrder[name] = 2;
  } else if (name === 'Espacios naturales') {
    categoriesOrder[name] = 1;
  } else if (name === 'Municipios' || name === 'Provincias') {
    categoriesOrder[name] = 0;
  } else {
    categoriesOrder[name] = 3;
  }
  
  generateLayer(name);
  reorderCategories();
  
};