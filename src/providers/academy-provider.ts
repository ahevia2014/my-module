//import { HttpClient } from '@angular/common/http';
import {  AlertController,LoadingController } from 'ionic-angular';
import {locations} from '../utils/locations';
import{ Injectable} from "@angular/core"

import {grifos} from '../utils/grifos';
import { Geolocation } from "@ionic-native/geolocation";

/*
  Generated class for the AcademyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

//var map;
var directionsService;
var polylines = [];

var markers = new Array();
var grifosArray = new Array();
var markers2 = new Array();
var radius = 500;
var gri=grifos;

var pm;
var fm;


var modelo;
var tiempo;
var distancia;
var costo;
var bencina;
var peajes;
var rutas = [];
var summary;
var infowindow;
var combustibles = new Array();
var currWindow:any;
var tole;
var cityCircle;
var drawingManager;
var polyOptions = {
  strokeWeight: 0,
  fillOpacity: 0.45,
  editable: true,
  draggable: true
};
var selectedShape;
var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
var selectedColor;
var colorButtons = {};
var combustible = [

  [0, 'bencina', '93', 600],
  [1, 'bencina', '95', 700],
  [2, 'bencina', '97', 800],
  [3, 'bencina', 'diesel', 500],
  [4, 'gas', 'natural', 400]
];



for (var i = 0; i < combustible.length; i++) {
  var record = ({
    id: combustible[i][0],
    tipo: combustible[i][1],
    subtipo: combustible[i][2],
    precio: combustible[i][3]
  })

  combustibles.push(record);
}

var tarifas = [
  [1, 104, 8, 132019, 0, 0, 999988425925926, 1, 'T',],
  [2, 105, 8, 132019, 0, 0, 804861111111111, 1, 'T',],
  [3, 106, 8, 132019, 0, 805555555555555, 0, 916655092592593, 1, 'T',],
  [4, 107, 8, 132019, 0, 916666666666667, 0, 999988425925926, 1, 'T',]
];
console.log("grifos=", grifos);
var currTemplate=this;

var loading: any;
var geolocation;
 var loadingCtrl;
  var alertCtrl;
  @Injectable()
export class AcademyProvider {
   geolocation= Geolocation;
   loadingCtrl= LoadingController;
    alertCtrl=AlertController;
  
config:string;

  constructor( ) {
    console.log('Hello AcademyProvider Provider');
   

   
  }
  
   drawPolyline(path, color, google, map) {
    var line = new google.maps.Polyline({
      path: path.overview_path,
      strokeColor: color,
      strokeOpacity: 0.7,
      strokeWeight: 3
    });
    line.setMap(map);
    return line;
  }
  CenterControl(controlDiv, map,google) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Center Map';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {
      console.log("centrar");
     // map.setCenter(chicago);
      AcademyProvider.prototype.currentPos(google,map);
    });

  }
  createCenter(map, google) {
    var centerControlDiv = document.createElement('div');
    var centerControl = this.CenterControl(centerControlDiv, map,google);

    //   centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(centerControlDiv);
  }


  clearSelection() {
    if (selectedShape) {
      if (selectedShape.type !== 'marker') {
        selectedShape.setEditable(false);
      }


      selectedShape = null;
    }
  }

  public setSelection(shape) {
    if (shape.type !== 'marker') {
      AcademyProvider.prototype.clearSelection();
      shape.setEditable(true);
      AcademyProvider.prototype.selectColor(shape.get('fillColor') || shape.get('strokeColor'));
    }

    selectedShape = shape;
  }

  deleteSelectedShape() {
    if (selectedShape) {
      selectedShape.setMap(null);
    }
  }

  selectColor(color) {
    selectedColor = color;
    for (var i = 0; i < colors.length; ++i) {
      var currColor = colors[i];
      colorButtons[currColor].style.border = currColor == color ? '2px solid #789' : '2px solid #fff';
    }

    // Retrieves the current options from the drawing manager and replaces the
    // stroke or fill color as appropriate.
    var polylineOptions = drawingManager.get('polylineOptions');
    polylineOptions.strokeColor = color;
    drawingManager.set('polylineOptions', polylineOptions);

    var rectangleOptions = drawingManager.get('rectangleOptions');
    rectangleOptions.fillColor = color;
    drawingManager.set('rectangleOptions', rectangleOptions);

    var circleOptions = drawingManager.get('circleOptions');
    circleOptions.fillColor = color;
    drawingManager.set('circleOptions', circleOptions);

    var polygonOptions = drawingManager.get('polygonOptions');
    polygonOptions.fillColor = color;
    drawingManager.set('polygonOptions', polygonOptions);
  }

  setSelectedShapeColor(color, google) {
    if (selectedShape) {
      if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
        selectedShape.set('strokeColor', color);
      } else {
        selectedShape.set('fillColor', color);
      }
    }
  }

  makeColorButton(color, google) {
    var button = document.createElement('span');
    button.className = 'color-button';
    button.style.backgroundColor = color;
    google.maps.event.addDomListener(button, 'click', function () {
       AcademyProvider.prototype.selectColor(color);
       AcademyProvider.prototype.setSelectedShapeColor(color,google);
    });

    return button;
  }

  buildColorPalette(google) {
    var colorPalette = document.getElementById('color-palette');
    for (var i = 0; i < colors.length; ++i) {
      var currColor = colors[i];
      var colorButton = this.makeColorButton(currColor, google);
      colorPalette.appendChild(colorButton);
      colorButtons[currColor] = colorButton;
    }
     AcademyProvider.prototype.selectColor(colors[0]);
  }


  createDrawingTool(map, google) {
    drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
      },
      markerOptions: {

        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',

        editable: true,
        draggable: true



      },

      polylineOptions: {
        editable: true,
        draggable: true
      },
      polygonOptions: polyOptions,
      rectangleOptions: polyOptions,
      circleOptions: polyOptions
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
      var newShape = e.overlay;

      newShape.type = e.type;
      console.log("e.type=", e.type);


      if (e.type !== google.maps.drawing.OverlayType.MARKER) {
        console.log("bounds shape=", newShape.getBounds().toUrlValue());
        // Switch back to non-drawing mode after drawing a shape.
        drawingManager.setDrawingMode(null);

        // Add an event listener that selects the newly-drawn shape when the user
        // mouses down on it.
        google.maps.event.addListener(newShape, 'click', function (e) {
          if (e.vertex !== undefined) {
            if (newShape.type === google.maps.drawing.OverlayType.POLYGON) {
              var path = newShape.getPaths().getAt(e.path);
              path.removeAt(e.vertex);
              if (path.length < 3) {
                newShape.setMap(null);
              }
            }
            if (newShape.type === google.maps.drawing.OverlayType.POLYLINE) {
              var path = newShape.getPath();
              path.removeAt(e.vertex);
              if (path.length < 2) {
                newShape.setMap(null);
              }
            }
          }
          AcademyProvider.prototype.setSelection(newShape);
        });
        AcademyProvider.prototype.clearSelection();
      }
      else {
        if (e.type == google.maps.drawing.OverlayType.MARKER) {
          google.maps.event.addListener(newShape, 'position_changed', function (f) {

            // 3 seconds after the center of the map has changed, pan back to the
            // marker.
            console.log("e.type=", e.type);
            console.log("e.evento=", f);
            console.log("position_changed=", newShape.getPosition());
             AcademyProvider.prototype.setSelection(newShape);
          });
          google.maps.event.addListener(newShape, 'click', function (e) {
             AcademyProvider.prototype.setSelection(newShape);

          });
          //  setSelection(newShape);
        }
        else {
          google.maps.event.addListener(newShape, 'click', function (e) {
             AcademyProvider.prototype.setSelection(newShape);

          });
        }


      }
    });

    google.maps.Polyline.prototype.getBounds = function(startBounds) {
      if(startBounds) {
          var bounds = startBounds;
      }
      else {
          var bounds = new google.maps.LatLngBounds();
      }

      this.getPath().forEach(function(item, index) {
          bounds.extend(new google.maps.LatLng(item.lat(), item.lng()));
      });
      return bounds;
  };

    // Clear the current selection when the drawing mode is changed, or when the
    // map is clicked.
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', AcademyProvider.prototype.clearSelection);
    google.maps.event.addListener(map, 'click', AcademyProvider.prototype.clearSelection);
    google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', AcademyProvider.prototype.deleteSelectedShape);
    AcademyProvider.prototype.buildColorPalette(google);

  }

  calcRoute(start, end, google, map,showPeajes,showGrifos) {
    //     var curPosition = new google.maps.LatLng(-33.93077156,-70.71536088); //peaje angostura
    //   var curPosition2 = new google.maps.LatLng(-33.66331584,-70.66916767); //peaje rio maipo
    //   console.log("end=",end);
    console.log("sg0=",start)

    directionsService = new google.maps.DirectionsService();

    var request = {
      origin: start,
      destination: end,
      provideRouteAlternatives: true,
      unitSystem: google.maps.UnitSystem.METRIC,
      travelMode: google.maps.TravelMode['DRIVING']
    };
    directionsService.route(request, function (response, status) {


      // clear former polylines
      for (var j in polylines) {
        polylines[j].setMap(null);
      }
      polylines = [];
      if (status == google.maps.DirectionsStatus.OK) {
         AcademyProvider.prototype.clearMarkers();
          if(cityCircle){
                cityCircle.setMap(null);
            }
            
        var inicio = new google.maps.LatLng(response.routes[0].legs[0].start_location.lat(), response.routes[0].legs[0].start_location.lng());
        var final = new google.maps.LatLng(response.routes[0].legs[0].end_location.lat(), response.routes[0].legs[0].end_location.lng());
        console.log("inicio=", inicio);
        console.log("final=", final);
        var dis = google.maps.geometry.spherical.computeDistanceBetween(inicio, final);
        console.log("computeDistanceBetween=", dis);
        var heading = google.maps.geometry.spherical.computeHeading(inicio, final);
        console.log("heading=", heading);
        var inicio = new google.maps.LatLng(response.routes[0].legs[0].start_location.lat(), response.routes[0].legs[0].start_location.lng());
        var final = new google.maps.LatLng(response.routes[0].legs[0].end_location.lat(), response.routes[0].legs[0].end_location.lng());
        //  addMarker2(inicio,"Origen");
        //addMarker2(final,"Destino");

        console.log("sg1=",showGrifos)

        if(showGrifos){
          console.log("sg2=",showGrifos)
          var centro= new google.maps.LatLng(response.routes[0].legs[0].end_location.lat(),response.routes[0].legs[0].end_location.lng());
  
       cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: centro,
      radius:  1000
  });
          AcademyProvider.prototype.buscarGrifos(centro,google,map);
          cityCircle.addListener('mouseover', function () {
          this.getMap().getDiv().setAttribute('title', this.get('title'));
      });

      cityCircle.addListener('mouseout', function () {
          this.getMap().getDiv().removeAttribute('title');
      });
       } 

        var bounds = new google.maps.LatLngBounds();
        // draw the lines in reverse orde, so the first one is on top (z-index)
        for (var i = response.routes.length - 1; i >= 0; i--) {
          rutas.push(response.routes[i]);
          console.log("response.routes=", response.routes);
          //  console.log("decode polyline=",  google.maps.geometry.encoding.decodePath(response.routes[i].overview_polyline))



          // let's make the first suggestion highlighted;
          if (i == 0) {
            var color = '#0000ff';

          }

          else if (i == 1) {
            var color = '#999988';
          }
          else {
            var color = '#dd1616';
          }


          var line = AcademyProvider.prototype.drawPolyline(response.routes[i], color, google, map)
          polylines.push(line);
          bounds = line.getBounds(bounds);

          google.maps.event.addListener(line, 'click', function (event) {
            console.log("latlng=", event.latLng.lat(), event.latLng.lng());
            // detect which route was clicked on
            //      console.log("infowindow=",infowindow);
            //    infoWindow.open(map,line);
            //infowindow.open(null);
            //    infowindow.open(map);
            var index = polylines.indexOf(this);
            console.log("index=", index);
             AcademyProvider.prototype.highlightRoute(index, google, map);
          });

          if (showPeajes) {
            for (var x = 0; x < markers.length; x++) {
              var curPosition = new google.maps.LatLng(markers[x].position.lat(), markers[x].position.lng()); //peaje
              //    var curPosition2 = new google.maps.LatLng(grifosArray[x].position.lat(), grifosArray[x].position.lng()); //grifo
              //  console.log("grifo=",curPosition2);

              if (google.maps.geometry.poly.isLocationOnEdge(curPosition, new google.maps.Polyline({ path: response.routes[i].overview_path }), 0.0005)) {
                //     console.log("peaje rio maipo esta en ruta: " );
                /*    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(locations[x][2], locations[x][3]),
                      map: map,
                    //icon: icons[iconCounter]
                         title:locations[x][0]+" "+locations[x][1]
                    });*/
                markers[x].setMap(map);
                var valor = tarifas.findIndex(id => id == markers[x].label, 1)

         //       var test = _.filter(markers, function (o) { return o; });
           //     console.log("test=", test);

                //   console.log("valor=",tarifas.findIndex(markers[x].label,1));
             //   console.log("valor2=", valor);

              }
              else {
                //        console.log("peaje rio maipo NO esta en ruta: " ); //no dibujo peaje e la ruta
              }

            }
          }


          //  console.log("resultPath+"+i,resultPath);
          //console.log("curPosition content : " + JSON.stringify(curPosition));
        }
        map.fitBounds(bounds);
      }
    });
  }
  

   


  highlightRoute(index, google, map) {
    console.log("poly=", polylines[index]);
    console.log("rutas2=", rutas)
    for (var j in polylines) {
      if (j == index) {
        var color = '#0000ff';
        summary = rutas[j].summary;
        tiempo = rutas[j].legs[0].duration.value;
        distancia = rutas[j].legs[0].distance.value;
        let pos = rutas[j].overview_path.length / 2;

        costo = (distancia / 1000 / modelo) * combustibles[0].precio;
        let tipo_com = combustibles[0].tipo + " " + combustibles[0].subtipo;


        var contentString = '<div id="content">' +
          '<div id="Resumen">' +
          '</div>' +
          '<h1 id="firstHeading" class="firstHeading">IRoute</h1>' +
          '<div id="bodyContent">' +
          '<p><b>Ruta</b> ' + summary + ' .</p>' +
          '<p><b>Tiempo</b> ' + Math.round((tiempo / 60)) + ' mins  .</p>' +
          '<p><b>Distancia</b> ' + Math.round(distancia.toFixed() / 1000) + 'kms .</p>' +
          '<p><b>Combustible</b> ' + tipo_com + ' .</p>' +
          '<p><b>Precio Combustible</b> $' + Math.round(combustibles[0].precio) + ' .</p>' +

          '<p><b>Costo</b> $ ' + Math.round(costo) + ' .</p>' +
          '</div>' +
          '</div>';
        console.log("contentString=", contentString);
        if (currWindow) {
          currWindow.close();
        }
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent(contentString);
        infowindow.setPosition(rutas[j].overview_path[pos | 0]);
        currWindow = infowindow;

        infowindow.open(map);
      }
      else {
        var color = '#999999';
      }
      polylines[j].setOptions({ strokeColor: color });
    }

  }


  calcDistance(p1, p2, google) {

    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1).toFixed(3);
  }

  currentPos(google, map) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infowindow = new google.maps.InfoWindow();
        infowindow.setPosition(pos);
        infowindow.setContent('mi ubicación');
        infowindow.open(map);
        map.setCenter(pos);
        map.setZoom(13);

        var icon = {
          url: "http://maps.google.com/mapfiles/kml/shapes/target.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };


        let myPos = new google.maps.Marker({
          position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          map: map,
          //icon: icons[iconCounter]
          icon: icon,
          title: "Yo"
        });
      }, function () {
        AcademyProvider.prototype.handleLocationError(true, infowindow, map.getCenter(),map);
      });
    } else {
      // Browser doesn't support Geolocation
      AcademyProvider.prototype.handleLocationError(false, infowindow, map.getCenter(), map);
    }
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos, map) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
  cargarLocations(google){
    console.log("cargarLocations");
    for (var i = 0; i < locations.length; i++) {  
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][2], locations[i][3]),
       // map: map,
        //icon: icons[iconCounter]
        title:locations[i][0]+" "+locations[i][1] +" valor: "+locations[i][4],
        label:String(locations[i][4])
      });

      markers.push(marker);
    }
  }

  cargarGrifos(google){
    console.log("cargar grifos");
    
    var image = {
      url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32)
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
    for (var i = 0; i < grifos.length; i++) {  
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(grifos[i][2], grifos[i][3]),
      //  map: map,
        //icon: icons[iconCounter]
        icon: image,
        shape: shape,
        title:grifos[i][0]+" "+grifos[i][1]
      });

      grifosArray.push(marker);
    }
  }

   buscarGrifos(pos,google,map){
    var distancia;
      var featurePos;
    //  console.log("pos=",pos.lat(),pos.lng());
  
    //for (var i = 0, grifos; grifos = grifos[i]; i++) {
          for (var i = 0; i < grifosArray.length; i++) {
             // console.log("grifosArray["+i+"]",grifosArray[i])
      featurePos = {
        lat: grifosArray[i].position.lat(),
        lng: grifosArray[i].position.lng()
      };
  //console.log("featurePos=",featurePos);
      //	pm = new google.maps.LatLng(pos.lat, pos.lng);
      pm = pos;
      fm = new google.maps.LatLng(featurePos.lat, featurePos.lng);
      
      distancia = AcademyProvider.prototype.calcDistance(pm,fm,google);
      if (distancia <= radius){
           // 	addMarker(grifosArray[i]);
           grifosArray[i].setMap(map);
          }
        }
    }

     setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
      for (var i = 0; i < grifosArray.length; i++) {
        grifosArray[i].setMap(map);
      }

      for (var i = 0; i < markers2.length; i++) {
        markers2[i].setMap(map);
      }
    }

     clearMarkers() {
      AcademyProvider.prototype.setMapOnAll(null);
    }

    // Shows any markers currently in the array.
     showMarkers(map) {
      AcademyProvider.prototype.setMapOnAll(map);
    }

    // Deletes all markers in the array by removing references to them.
     deleteMarkers() {
      AcademyProvider.prototype.clearMarkers();
      markers = [];
      grifosArray=[];
      markers2 = [];

    }
    getCurrentPosition(google,map) {

    
                loading = loadingCtrl.create({
                content: "Buscando Ubicación ..."
                 });
                 loading.present().then(() => {
                let locationOptions = {
                  timeout: 20000,
                  enableHighAccuracy: true,
                  maximumAge: Infinity
                };
                geolocation.getCurrentPosition(locationOptions).then(
                  position => {
                                 loading.dismiss()
                                 .then(() => {
                                            //showToast("Donde estoy!",5000);
  
                                           let lat=position.coords.latitude;
                                           let lng=position.coords.longitude;
  
                                            let myPos = new google.maps.LatLng(
                                              position.coords.latitude,
                                              position.coords.longitude
                                            );
  
                                            let options = {
                                              center: myPos,
                                              zoom: 15
                                            };
                                            console.log("lat=",lat);
                                            console.log("lng=",lng);
                                            console.log("posicion=",myPos);
                                            map.setOptions(options);
                                            var marker = new google.maps.Marker({
                                              position: new google.maps.LatLng(lat, lng),
                                            //  map: map,
                                              //icon: icons[iconCounter]
                                            //  icon: image,
                                              //shape: shape,
                                              title:"Mi Pos"
                                            });
                                           
                                });
                            },
                  error => {
                           console.log(error);
                  }
  
                );
              });
          
    }
    /*
    setConfig(params){
      console.log("params=",params);
      AcademyProvider.prototype.config=params;

    }
    getConfig(){
      return AcademyProvider.prototype.config;
    }*/

}
