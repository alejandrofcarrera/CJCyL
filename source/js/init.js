
'use strict';

var gmap;

var toogleFacet = function toogleFacet(e) {
  var fac = $(e.currentTarget).context.textContent;
  fac = fac.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  
  if ($(e.currentTarget).hasClass('on')) {
    $(e.currentTarget).removeClass('on');
    hideFacetsInfo(fac);
  } else {
    $(e.currentTarget).addClass('on');
    showFacetsInfo(fac);
  }
  
  showInformation();
  
};

var getSum = function getSum(name) {
  if (name === 'Sendas') return 403;
  else if (name === 'Espacios naturales') return 44;
  else if (name === 'Miradores') return 139;
  else if (name === 'Árboles singulares') return 94;
  else if (name === 'Lugares de descanso') return 402;
  else if (name === 'Otros') return 1789;
  else if (name === 'Provincias') return 9;
  else return 2303;
};

var showLabelInformation = function showLabelInformation(val) {
  $('body').append(
    '<div id="labelGeoResources">'+val+' georecursos mostrados</div>'
  );
};

var showInformation = function showInformation() {
  $('#labelGeoResources').remove();
  var facetsOn = $('.on');
  var sum = 0;
  if (facetsOn.length > 0) {
    for(var i = 0; i < facetsOn.length; i++) {
      var fac = facetsOn[i].textContent;
      fac = fac.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      sum += getSum(fac);
    }
    showLabelInformation(sum);
  }
};

$(document).ready(function () {
  $('.facet').click(toogleFacet);
  $('#weatherButton').click(toogleWeather);
	var mapOptions = {
		center: new google.maps.LatLng(41.6551800, -4.7237200),
		zoom: 7,
		disableDefaultUI: true,
    mapTypeControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    panControl: true,
    streetViewControl: false,
    zoomControl: true
	};
	gmap = new google.maps.Map(document.getElementById("rightPanelMap"), mapOptions);
  
});
