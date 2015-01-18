
'use strict';

var serverQueries = "http://127.0.0.1:4500/sparql?query=";

var categoriesQueries = {
  "Sendas": {
    "query": "",
    "number": 0
  },
  "Espacios naturales": {
    "query": "",
    "number": 1
  },
  "Miradores": {
    "query": "",
    "number": 2
  },
  "Árboles singulares": {
    "query": "",
    "number": 3
  },
  "Puntos de interés": {
    "query": "",
    "number": 4
  },
  "Lugares de descanso": {
    "query": "",
    "number": 5
  },
  
  "Municipios": {
    "query": 'SELECT+*+WHERE+%7B%0D%0A++%3Furi+a+%3Chttp'+    
    '%3A%2F%2Fgeo.linkeddata.es%2Fcjcyl%23Municipio%3E+.%0D%0A+'+
    '+%3Furi+%3Chttp%3A%2F%2Fgeo.linkeddata.es%2Fcjcyl%23nombre'+
    '%3E+%3Fname+.%0D%0A++%3Furi+%3Chttp%3A%2F%2Fgeo.linkeddata'+
    '.es%2Fcjcyl%23area%3E+%3Farea+.%0D%0A++%3Furi+%3Chttp%3A%2'+       
    'F%2Fgeo.linkeddata.es%2Fcjcyl%23geometria%3E+%3Fgeome'+
    'try+.%0D%0A%7D&format=application%2Fsparql-results%2Bjson"',
    "number": 6
  },
  
  "Provincias": {
    "query": "",
    "number": 7
  }
  
};

var loadFacetsValues = function loadFacetsValues(name) {
  
  var numberFacet = categoriesQueries[name].number;
  
  // Add Loading Spinner
  $($('.facet')[numberFacet]).append(
    '<i class="fa fa-spinner fa-spin spinning"></i>'
  );
  
  // Get SPARQL Resources
  var urlSPARQL = serverQueries + categoriesQueries[name].query;
  var request = $.ajax({
    url: urlSPARQL,
    type: "GET",
    crossDomain: true,
    dataType: 'jsonp'
  });
  
  // Handler and remove Spinner of Facet
  request.done(function( msg ) {
    $('.facet')[numberFacet].children[2].remove();
  });
 
  request.fail(function( jqXHR, textStatus ) {
    $('.facet')[numberFacet].children[2].remove();
    alert("Compruebe la conexión a internet ... ");
  });
    
};

var showFacetsInfo = function showFacetsInfo(name) {
  
  loadFacetsValues(name);
  
};