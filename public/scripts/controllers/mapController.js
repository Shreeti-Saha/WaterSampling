angular.module('mapCtrl',[]).controller('mapController',function($scope){
    
    $scope.initialize = function(){
        var mapOption ={
         zoom: 12,
            center: new google.maps.LatLng(23.557979, 87.281364),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            showHeat:true,
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
              {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#263c3f' }]
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#6b9a76' }]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#38414e' }]
              },
              {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#212a37' }]
              },
              {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9ca5b3' }]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#746855' }]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#1f2835' }]
              },
              {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#f3d19c' }]
              },
              {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: '#2f3948' }]
              },
              {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#515c6d' }]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#17263c' }]
              }
            ]
    }

      $scope.markers = [];
             var utm = "+proj=utm +zone=45";
          var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
          //console.log(proj4(utm,wgs84,[534479.73, 2598049.89]));


          var infowindow = new google.maps.InfoWindow();
          var heatmapData = [];
          var marker, i, lat_longi;
          var locations;
          $.getJSON("./data/geodata.json", function (json) {
            locations = json;
           // console.log(json); // this will show the info it in firebug console
            for (i = 0; i < locations.length; i++) {
              lat_longi = proj4(utm, wgs84, [locations[i].EASTING, locations[i].NORTHING]);
              //	console.log(lat_longi);
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat_longi[1], lat_longi[0]),
                map: $scope.map
              });
              $scope.markers.push(marker);
              //marker event
              google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                return function () {
                  infowindow.setContent("<p style='color:black;'>WQI = " + locations[i].WQI.toString() + "</p>");
                  infowindow.open($scope.map, marker);
                }
              })(marker, i));
              google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                  window.open("/?id=" + locations[i].sampno);
                }
              })(marker, i));
              //heat map genarator
              heatmapData.push({ location: new google.maps.LatLng(lat_longi[1], lat_longi[0]), weight: locations[i].WQI / 100 });


            }
            console.log(heatmapData);
          });
          var gradient = [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
          ]

          var heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            radius: 10
          });
          heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
          heatmap.setMap($scope.map);


          //	console.log("positions----->"+proj4(utm,wgs84,["+locations[i].NORTHING+", "+locations[i].EASTING+"])+" "+locations[i].EASTING +","+ locations[i].NORTHING);

         $scope.toogleHeatmap = function toggleHeatmap() {
            heatmap.setMap(heatmap.getMap() ? null : $scope.map);
          }

          $scope.toogleMarker = function toogleMarker() {
            for (var i = 0; i < $scope.markers.length; i++) {
              if ($scope.markers[i].getMap() === null) {
                $scope.markers[i].setMap($scope.map);
              }
              else {
                $scope.markers[i].setMap(null);
              }
            }
          }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOption);
    
    }

     $scope.loadScript = function() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.google.com/maps/api/js?sensor=false&v=3.exp&libraries=visualization';
        document.body.appendChild(script);
        
        setTimeout(function() {
            $scope.initialize();
        }, 500);
    }

          
});