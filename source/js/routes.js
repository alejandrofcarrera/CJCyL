
'use strict';

var directionsService = new google.maps.DirectionsService();

var waypoints = [];

var waypointsName = [];

var routeInfoShowed = false;

// Add resource to list
var addRes = function addRes(resource) {

  if (waypoints.length === 10) {
    return;
  }
  if (waypointsName.indexOf(resource.name) === -1) {
    waypoints.push(resource);
    waypointsName.push(resource.name);
  } else {
    return;
  }
  if (routeInfoShowed) {
    rebuildRouteInfo();    
  }
  
};

// Handler to Change list Order
var remRes = function remRes(e) {
  var rId = e.currentTarget.id;
  $(rId).off(remRes);
  var r = parseInt(rId.replace("row_", ""), 10);
  if (r === 0) {
    waypoints = waypoints.slice(1, waypoints.length);
    waypointsName = waypointsName.slice(1, waypoints.length);
  } else {
    waypoints = waypoints.slice(0, r).concat(
      waypoints.slice(r+1, waypoints.length)
    );
    waypointsName = waypointsName.slice(0, r).concat(
      waypointsName.slice(r+1, waypointsName.length)
    );
  }
  rebuildRouteInfo();
}

// Handler to Change list Order
var changeOrder = function changeOrder(e) {
  var newPos = -1;
  var oldPos = -1;
  var list = e.target.children;
  for (var i = 0; i < list.length && newPos === -1; i++) {
    oldPos = parseInt(list[i].children[2].id.replace("row_", ""), 10);
    if(i !== oldPos) {
      newPos = i;
    }
  }
  if (newPos !== -1) {
    var bac = waypoints[newPos];
    waypoints[newPos] = waypoints[oldPos];
    waypointsName[newPos] = waypointsName[oldPos];
    waypoints[oldPos] = bac;
    waypointsName[oldPos] = bac.name;
  }
}

// Add Rame to RouteView
var addNameToRoute = function addNameToRoute(nameResource, n) {
  $('#routeViewContainer').append(
    '<li><span>::</span><p>'+nameResource+'</p>'+
    '<i id="row_'+n+'"'+
    'class="rowRouteRemove fa fa-minus-square-o"></i>'+
    '</li>'
  );
  $('#row_'+n).click(remRes);
};

// Create Label Top With Waypoints number
var updateWPointsLabel = function updateWPointsLabel() {
  var routeView = $('#routeView');
  routeView.append(
    '<p id="routeLabelTop">'+waypoints.length+' / 10 Paradas</p>'
  );
};

// Create RouteView with message
var addEmpty = function addError() {
  var routeView = $('#routeView');
  routeView.append(
    '<p id="routeEmptyLabelDown">No se ha añadido ' + 
    'ningún punto al recorrido</p>'
  );
};

// Create Route View and All Subviews
var createRouteView = function createRouteView() {
  var routeView = $('#routeView');
  routeView.append(
    '<ul id="routeViewContainer" class="handles list"></ul>'
  );
  for(var i = 0; i < waypoints.length; i++) {
    addNameToRoute(waypoints[i].name, i);
  }
  $('.handles').sortable().bind('sortupdate', changeOrder);
}

// Remove all Subviews and RouteView
var removeRouteInfo = function removeRouteInfo(e) {
  routeInfoShowed = false;
  var buttonView = $('#routeButton');
  $('.handles').sortable('destroy');
  $('#routeViewClose').off('click');
  $("#routeView").remove();
  buttonView.removeClass('on');
  buttonView.animate({
    width: '26px',
  }, 100, 'linear', function() {
    buttonView.click(toogleRoute);
  });
};

// Rebuild Route Information
var rebuildRouteInfo = function rebuildRouteInfo(e) {
  var buttonView = $('#routeButton');
  $('.handles').sortable('destroy');
  $('#routeViewClose').off('click');
  $("#routeView").remove();
  showRouteInfo();
};

// Show Route Information at RouteView
var showRouteInfo = function showRouteInfo(e) {
  var buttonView = $('#routeButton');
  buttonView.append(
    '<div id="routeView"></div>'
  );
  var routeView = $('#routeView');
  routeView.append(
    '<i id="routeViewClose" class="fa fa-times-circle-o"></i>'
  );
  $('#routeViewClose').click(removeRouteInfo);
  updateWPointsLabel();
  if (waypoints.length === 0) {
    addEmpty();
  } else {
    createRouteView();
  }
};

// Toogle RouteView
var toogleRoute = function toogleRoute(e) {
  if (!$(e.currentTarget).hasClass('on')) {
    $(e.currentTarget).addClass('on');
    $(e.currentTarget).animate({
      width: '300px',
    }, 500, 'linear', function() {
      routeInfoShowed = true;
      showRouteInfo();
    });
    $('#routeButton').off('click');
  }
};
