
'use strict';

var provinceList = [
  { value: 'Ávila', data: {"lon":-4.69228,"lat":40.6579} },
  { value: 'Burgos', data: {"lon":-3.7,"lat":42.349998} },
  { value: 'León', data: {"lon":-5.56667,"lat":42.599998} },
  { value: 'Palencia', data: {"lon":-4.53333,"lat":42.01667} },
  { value: 'Salamanca', data: {"lon":-5.65,"lat":40.966671} },
  { value: 'Segovia', data: {"lon":-4.11667,"lat":40.950001} },
  { value: 'Soria', data: {"lon":-2.46883,"lat":41.764011} },
  { value: 'Valladolid', data: {"lon":-4.72372,"lat":41.655182} },
  { value: 'Zamora', data: {"lon":-5.75,"lat":41.5} }
];

// Remove all SubViews and WeatherView
var removeWeatherInfo = function removeWeatherInfo(e) {  
  var buttonView = $('#weatherButton');
  $('#weatherViewClose').off('click');
  $("#weatherView").remove();
  buttonView.removeClass('on');
  buttonView.animate({
    width: '26px',
  }, 100, 'linear', function() {
    buttonView.click(toogleWeather);
  });
};

var getWeatherIcon = function getWeatherIcon(iconOWM) {
  
  var prefixDay = 'night';
  if (iconOWM.indexOf("d") > -1) {
    prefixDay = 'day';
  }
  var result = {
    icon: '',
    state: ''
  }
  
  if (iconOWM === '01d') {
    result.icon = 'wi-day-sunny';
    result.state = 'despejado';
  }
  else if (iconOWM === '01n') {
    result.icon = 'wi-stars';
    result.state = 'despejado';
  }
  else if (iconOWM === '02d') {
    result.icon = 'wi-day-sunny-overcast';
    result.state = 'algo nublado';
  }
  else if (iconOWM === '02n') {
    result.icon = 'wi-night-alt-cloudy';
    result.state = 'algo nublado';
  }
  else if (iconOWM === '03d' || iconOWM === '03n') {
    result.icon = 'wi-'+prefixDay+'-cloudy';
    result.state = 'semi nublado';
  }
  else if (iconOWM === '04d' || iconOWM === '04n') {
    result.icon = 'wi-cloudy';
    result.state = 'nublado';
  }
  else if (iconOWM === '09d' || iconOWM === '09n') {
    result.icon = 'wi-'+prefixDay+'-showers';
    result.state = 'llovizna';
  }
  else if (iconOWM === '10d' || iconOWM === '10n') {
    result.icon = 'wi-'+prefixDay+'-rain-wind';
    result.state = 'lluvia';
  }
  else if (iconOWM === '11d' || iconOWM === '11n') {
    result.icon = 'wi-'+prefixDay+'-storm-showers';
    result.state = 'tormenta';
  }
  else if (iconOWM === '13d' || iconOWM === '13n') {
    result.icon = 'wi-'+prefixDay+'-snow';
    result.state = 'nieve';
  }
  else {
    result.icon = 'wi-fog';
    result.state = 'niebla';
  }
  return result;
  
};

var addWeatherValues = function addWeatherValues(val) {
  
  // Add Weather Days Views to View
  var weatherView = $('#weatherViewContainer');
  var divsId = ['One', 'Two', 'Three', 'Four', 'Five'];
  var values = val['weatherdata']['forecast']['time'];
  var today = new Date().getDate();
  var monthNames = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];
  
  // Clean View
  weatherView.empty();
  
  // Generate 5 views for each forecast
  for (var i = 0; i < divsId.length; i++) {
    weatherView.append(
      '<div id="weatherDay'+divsId[i]+'"'+
      ' class="weatherDay"></div>'
    );
    var viewDay = $('#weatherDay'+divsId[i]);
    var iconDay = getWeatherIcon(values[i].symbol["@attributes"].var);
    var tempMax = parseFloat(values[i].temperature["@attributes"].max).toFixed(0);
    var tempMin = parseFloat(values[i].temperature["@attributes"].min).toFixed(0);
    var date = new Date(values[i]["@attributes"].day);
    
    // Add Weather Icon
    viewDay.append(
      '<i id="weatherDayIcon" class="wi '+iconDay.icon+'"></i>'
    );
      
    // Add Weather State
    viewDay.append(
      (today === date.getDate()) ? '<p id="weatherDayState"'+ 
      'class="today">'+iconDay.state+'</p>' : '<p'+ 
      ' id="weatherDayState">'+iconDay.state+'</p>'
    );
    
    // Add temperature
    if (tempMax === '-0') {
      tempMax = '0';
    }
    if (tempMin === '-0') {
      tempMin = '0';
    }
    if (tempMax === tempMin) {
      viewDay.append(
        (today === date.getDate()) ? '<p id="weatherDayTemp"'+ 
        'class="today">'+tempMax+'º</p>' : '<p'+ 
        ' id="weatherDayTemp">'+tempMax+'º</p>'
      );
    } else {
      viewDay.append(
        (today === date.getDate()) ? '<p id="weatherDayTemp"'+ 
        'class="today">'+tempMin+'º, '+tempMax+'º</p>' : '<p'+ 
        ' id="weatherDayTemp">'+tempMin+'º, '+tempMax+'º</p>'
      );
    }
    viewDay.append(
      (today === date.getDate()) ? '<p id="weatherDayInfo"'+ 
        'class="today">'+date.getDate()+' '+
      monthNames[date.getMonth()+1]+'</p>' : '<p'+ 
        ' id="weatherDayInfo">'+date.getDate()+' '+
      monthNames[date.getMonth()+1]+'</p>'
    );
  }
};

var loadWeatherValues = function loadWeatherValues(coordinates) {
  var urlOWM = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=";
  urlOWM += coordinates.lat;
  urlOWM += "&lon=";
  urlOWM += coordinates.lon;
  urlOWM += "&mode=xml&units=metric";
  
  var request = $.ajax({
    url: urlOWM,
    type: "GET"
  });
 
  request.done(function( msg ) {
    addWeatherValues(xmlToJson(msg));
  });
 
  request.fail(function( jqXHR, textStatus ) {
    alert("Compruebe la conexión a internet ... ");
  });
};

// Create WeatherView and all SubViews
var showWeatherInfo = function showWeatherInfo(e) {
  
  // Add Main Weather View button
  var buttonView = $('#weatherButton');
  buttonView.append(
    '<div id="weatherView"></div>'
  );
  
  // Add CloseButton to View
  var weatherView = $('#weatherView');
  weatherView.append(
    '<i id="weatherViewClose" class="fa fa-times-circle-o"></i>'
  );
  $('#weatherViewClose').click(removeWeatherInfo);
  
  // Add Container
  weatherView.append(
    '<div id="weatherViewContainer"></div>'
  );
  
  // Add Input for search province
  weatherView.append(
    '<p id="weatherInputLabel">Provincia</p>'
  );
  weatherView.append(
    '<input id="weatherInput">'
  );
  $('#weatherInput').val('Ávila');
  
  // Add autocomplete event
  $('#weatherInput').autocomplete({
    lookup: provinceList,
    onSelect: function (suggestion) {
      if(valueSelected !== suggestion.value) {
        valueSelected = suggestion.value;
        loadWeatherValues(suggestion.data);
      }
    }
  });
  
  
  // Load Weather from first Province
  var valueSelected = 'Ávila';
  loadWeatherValues(provinceList[0].data);
  
};

var toogleWeather = function toogleWeather(e) {
  if (!$(e.currentTarget).hasClass('on')) {
    $(e.currentTarget).addClass('on');
    $(e.currentTarget).animate({
      width: '300px',
    }, 500, 'linear', function() {
      showWeatherInfo();
    });
    $('#weatherButton').off('click');
  }
};