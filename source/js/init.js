
'use strict';

var toogleFacet = function toogleFacet(e) {
  if ($(e.currentTarget).hasClass('on')) {
    $(e.currentTarget).removeClass('on');
  } else {
    $(e.currentTarget).addClass('on');
  }
};

$(document).ready(function () {
  $('.facet').click(toogleFacet);
  $('#weatherButton').click(toogleWeather);
	var mapOptions = {
		center: new google.maps.LatLng(41.6551800, -4.7237200),
		zoom: 7,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	new google.maps.Map(document.getElementById("rightPanelMap"), mapOptions);
  
});
