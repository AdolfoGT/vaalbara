var map, geocoder, marker,
	ey, my, mouseDown = false;
var o = {
	init: function(){
		this.map.init();
	},
	map: {
		size: function(){
			var w = $(window).width(),
				h = $(window).height();
			return { width: w, height: h }
		},
		data: {
			zoom: 3,
			myLatlng: {lat: 52, lng: 23},
			center: new google.maps.LatLng(52, 23),
			mapTypeId: google.maps.MapTypeId.ROADMAP
			// mapTypeId: google.maps.MapTypeId.HYBRID
			//mapTypeId: google.maps.MapTypeId.SATELLITE
			// mapTypeId: google.maps.MapTypeId.TERRAIN
		},
		init: function(){
			console.log("initializing map...");
			var size = o.map.size();
			$('#map').css({ width: size.width, height: size.height });
			map = new google.maps.Map(document.getElementById('map'), o.map.data),
			geocoder = new google.maps.Geocoder();
			/*
		  var marker = new google.maps.Marker({
		     position: this.data.myLatlng,
		     map: map,
		     title: 'Click to zoom'
		   });*/
       
       var bounds = {
            north: 47.9,
            south: 26.8,
            east: -111.75,
            west: -132.75
          };
       
       var rectangle = new google.maps.Rectangle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          bounds: bounds,
          editable: true,
          draggable: true
        });
      
      
      
    // Define an info window on the map.
      infoWindow = new google.maps.InfoWindow();
      var socket = io();
      /** @this {google.maps.Rectangle} */
      this.showNewRect = function(event) {
        var ne = rectangle.getBounds().getNorthEast();
        var sw = rectangle.getBounds().getSouthWest();

        var contentString = '<b>Rectangle moved.</b><br>' +
            'New north-east corner: ' + ne.lat() + ', ' + ne.lng() + '<br>' +
            'New south-west corner: ' + sw.lat() + ', ' + sw.lng();

        // Set the info window's content and position.
        infoWindow.setContent(contentString);
        infoWindow.setPosition(ne);

        infoWindow.open(map);
        setTimeout(function(){infoWindow.close();}, '2000');
        var coords = {sw_lat: sw.lat(),
                                       sw_lon: sw.lng(),
                                       ne_lat: ne.lat(),
                                       ne_lon: ne.lng()};
        console.log("emit change coords...", coords);
        socket.emit('change coords.', coords);
      }
      // Add an event listener on the rectangle.
      rectangle.addListener('dragend', this.showNewRect);

	    //Callback functions
	    var error = function (err, response, body) {
	        console.log('ERROR [%s]', err);
	    };
	    var success = function (data) {
	        console.log('Data [%s]', data);
	    };
      
      socket.on('new tweet', function(tweet){
        //console.log(tweet);
        var tweetInfoWindow = new google.maps.InfoWindow();
        tweetInfoWindow.setContent(tweet.text);
        console.log(tweet.place.bounding_box.coordinates);
        var tweet_coords = tweet.place.bounding_box.coordinates[0][0];
        console.log(tweet_coords);
        tweetInfoWindow.setPosition({lat: tweet_coords[1] , lng: tweet_coords[0]});
        tweetInfoWindow.open(map);
        setTimeout(function(){tweetInfoWindow.close();}, '2000');
       });
			
      /*
			google.maps.event.addListener(marker, 'dragend', function(evt){
				console.log('<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>');
				google.maps.infoWindow.open(map, marker);
 			}); 
			google.maps.event.addListener(marker, 'drag', function(evt){
			    console.log("marker is being dragged");
			});
 			google.maps.event.addListener(map, 'click', function(evt){
				console.log('<p>Click : Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>');
				marker.setPosition(evt.latLng);
 			}); 
       */
		}
	}
}

$(function(){ o.init(); });
