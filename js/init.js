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
			// mapTypeId: google.maps.MapTypeId.ROADMAP
			// mapTypeId: google.maps.MapTypeId.ROADMAP
			// mapTypeId: google.maps.MapTypeId.HYBRID
			mapTypeId: google.maps.MapTypeId.SATELLITE
			// mapTypeId: google.maps.MapTypeId.TERRAIN
		},
		init: function(){
			console.log("initializing map...");
			var size = o.map.size();
			$('#map').css({ width: size.width, height: size.height });
			map = new google.maps.Map(document.getElementById('map'), o.map.data),
			geocoder = new google.maps.Geocoder();
			
		  var marker = new google.maps.Marker({
		     position: this.data.myLatlng,
		     map: map,
		     title: 'Click to zoom'
		   });
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
		}
	}
}

$(function(){ o.init(); });
