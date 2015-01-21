'use strict';

var parseTextSenda = function parseTextSenda(resource) {
  var infoText = resource.infoWindowHtml.split("\n");
  var infoNewWindow = infoText[0];
  for(var i = 1; i < infoText.length - 1; i++) {
    var t = infoText[i];
    var label = t.substring(t.indexOf("<b>")+3, t.indexOf("</b>")-1);
    var value = t.substring(t.indexOf("</b>")+5, t.indexOf("<br>"));
    if ((label === 'Longitud' && value === '0.0 m') || 
        (label === 'Tiempo estimado' && value === '0 min') ||
        (value === ' %') ||
        (value === ' min') ||
        (value === ' m') ||
        (value === '')) {
      continue;
    } else {
      infoNewWindow += "\n";
      infoNewWindow += t;
    }
  }
  infoNewWindow += '<br><a class="plink" href="#" onclick="addResource(\''+resource+'\')">Añadir senda al recorrido</a>';
  infoNewWindow += "\n";
  infoNewWindow += infoText[infoText.length-1];
  return infoNewWindow;
};

var parseTextOtros = function parseTextOtros(resource) {
  var infoText = resource.infoWindowHtml.split("\n");
  var infoNewWindow = infoText[0];
  for(var i = 1; i < infoText.length - 1; i++) {
    var t = infoText[i];
    t = t.replace("false", "No");
    t = t.replace("true", "Sí");
    var label = t.substring(t.indexOf("<b>")+3, t.indexOf("</b>")-1);
    var value = t.substring(t.indexOf("</b>")+5, t.indexOf("<br>"));
    if (value.indexOf("href") > -1) {
      var u = value.substring(value.indexOf('">')+2,
        value.indexOf("</a>"));
      var ushort = u.substring(0, 20) + "...";
      value = value.replace(u + "</a>", ushort + "</a>");
      t = "<b>"+label+":</b> "+value+"<br>";
    }
    if ((value === '<a href="">...</a>') ||
        (value === '0.0 m') || 
        (value === ' m') ||
        (value === '')) {
      continue;
    } else {
      infoNewWindow += "\n";
      infoNewWindow += t;
    }
  }
  infoNewWindow += '<br><a class="plink" href="#" onclick="addResource(\''+resource+'\')">Añadir punto de interés al recorrido</a>';
  infoNewWindow += "\n";
  infoNewWindow += infoText[infoText.length-1];
  return infoNewWindow;
};

var parseTextDescanso = function parseTextDescanso(resource) {
  var infoText = resource.infoWindowHtml.split("\n");
  var infoNewWindow = infoText[0];
  for(var i = 1; i < infoText.length - 1; i++) {
    var t = infoText[i];
    t = t.replace("false", "No");
    t = t.replace("true", "Sí");
    infoNewWindow += "\n";
    infoNewWindow += t;
  }
  infoNewWindow += '<br><a class="plink" href="#" onclick="addResource(\''+resource+'\')">Añadir lugar de descanso al recorrido</a>';
  infoNewWindow += "\n";
  infoNewWindow += infoText[infoText.length-1];
  return infoNewWindow;
};

var parseTextEspacio = function parseTextEspacio(resource) {
  var infoText = resource.infoWindowHtml.split("\n");
  var infoNewWindow = infoText[0];
  for(var i = 1; i < infoText.length - 1; i++) {
    infoNewWindow += "\n";
    infoNewWindow += infoText[i];
  }
  infoNewWindow += '<br><a class="plink" href="#" onclick="addResource(\''+resource+'\')">Añadir espacio natural al recorrido</a>';
  infoNewWindow += "\n";
  infoNewWindow += infoText[infoText.length-1];
  return infoNewWindow;
};

var parseTextGenerico = function parseTextGenerico(resource, type) {
  var infoText = resource.infoWindowHtml.split("\n");
  var infoNewWindow = infoText[0];
  for(var i = 1; i < infoText.length - 1; i++) {
    var t = infoText[i];
    var label = t.substring(t.indexOf("<b>")+3, t.indexOf("</b>")-1);
    var value = t.substring(t.indexOf("</b>")+5, t.indexOf("<br>"));
    if (value === '') {
      continue;
    } else {
      infoNewWindow += "\n";
      infoNewWindow += t;
    }
  }
  infoNewWindow += '<br><a class="plink" href="#" onclick="addResource(\''+resource+'\')">Añadir '+type+' al recorrido</a>';
  infoNewWindow += "\n";
  infoNewWindow += infoText[infoText.length-1];
  return infoNewWindow;
}