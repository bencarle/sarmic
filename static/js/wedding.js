//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Collapse navbar on click (for iOS)
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') ) {
        $(this).collapse('hide');
    }
});


/*
center: new google.maps.LatLng(53.385873, -1.471471),
    q: Foundry+United+Methodist+Church,
*/

var directionsService = new google.maps.DirectionsService();

var locationLat = 41.666995;
var locationLng = -73.955299;
var locationLatLng = new google.maps.LatLng(locationLat,locationLng);
var locationString = "Buttermilk Falls Inn & Spa, Milton, NY";
var locationPlaceId = "ChIJO9-c-hM83YkRoZfmPDeUZAU";

events = [
    {
	lat: 38.905099,
	lng: -77.031406,
	placeId: "ChIJpVekOZW3t4kRLzhqZbDl5iA",
    },
    {
	lat: 38.904328,
	lng: -77.032492,
	placeId: "ChIJe6mPR5W3t4kR8iA4Rhu7dmE",
    }
];

var eventsLat = 0.0;
var eventsLng = 0.0;
for(var i = 0; i < events.length; i++) {
    eventsLat += events[i].lat;
    eventsLng += events[i].lng;
}
eventsLat /= events.length;
eventsLng /= events.length;
var eventsLatLng = new google.maps.LatLng(eventsLat, eventsLng);

var centerLat = locationLat;
var centerLng = locationLng;
var centerLatLng = new google.maps.LatLng(centerLat,centerLng);

var retroStyleModified = [{"featureType":"administrative","stylers":[{"visibility":"on"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}];

function createMarker(map, place, icon) {
    //console.log(place);
    //console.log(place.place_id);
    var markerOptions = {
	map: map,
	position: place.geometry.location,
	title: place.name,
	draggable: false,
	icon: icon,
    };

    //if(typeof optionalArg === "undefined")
	//markerOptions.icon = icon;
    var marker = new google.maps.Marker(markerOptions);
  google.maps.event.addListener(marker, 'click', function() {
      var infowindow = new google.maps.InfoWindow();
      infowindow.setContent('<div class="infowindow">' + place.name + '<br>' + place.adr_address + '</div>');
      infowindow.open(map, this);
  });
}

function createMarkerFromPlaceId(map, placeId, icon) {
    var placesService = new google.maps.places.PlacesService(map);
    var request = { placeId: placeId };
    placesService.getDetails(request, function(place, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
	    createMarker(map, place, icon);
	}
    });
}

//---//---//---//---//---// Guest Map //---//---//---//---//---//

var testaddr = "33 Greenbush Drive, Poughkeepsie, NY 12601"
var geocoder = new google.maps.Geocoder();

var guestMapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: locationLatLng,
    zoom: 14,
};
var guestMap = new google.maps.Map(document.getElementById('guestMap'), guestMapOptions);

var guestMapBounds = new google.maps.LatLngBounds();

function adjustGuestMap() {
    guestMap.fitBounds(guestMapBounds);
}

google.maps.event.addListenerOnce( guestMap, 'idle', function() {
    adjustGuestMap();
});

$('#guestMapModal').on('shown.bs.modal', function () {
    google.maps.event.trigger(guestMap, "resize");
    //guestMap.setCenter(guestMapOptions.center);
    adjustGuestMap();
});

markGuestMap();

var goldStar = {
    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
    fillColor: 'yellow',
    fillOpacity: 1.0,
    scale: 0.15,
    strokeColor: 'gold',
    strokeWeight: 2,
    anchor: new google.maps.Point(125,117)
};

createMarkerFromPlaceId(guestMap, locationPlaceId, goldStar);
//createMarkerFromPlaceId(guestMap, locationPlaceId, 'http://localhost/melbenwed/img/marker/yellow.png');

function markGuest(lat, lng, title) {
    var guestLatLng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
	map: guestMap,
	position: guestLatLng,
	title: title
    });
    guestMapBounds.extend(guestLatLng);
}

//---//---//---//---//---// Location //---//---//---//---//---//

var locationMapOptions = {
    zoom: 7,
    center: centerLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: retroStyleModified,
    scrollwheel: false,
};
//var locationMap = new google.maps.Map(document.getElementById('locationMap'), locationMapOptions);
//createMarkerFromPlaceId(locationMap, locationPlaceId);

//---//---//---//---//---// Events //---//---//---//---//---//
/*
var eventsMapOptions = {
    zoom: 17,
    center: eventsLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: retroStyleModified,
    scrollwheel: false,
};
var eventsMap = new google.maps.Map(document.getElementById('eventsMap'), eventsMapOptions);
for (var i = 0; i < events.length; i++)
    createMarkerFromPlaceId(eventsMap, events[i].placeId);


$('.eventsThumbnail').click(function(){
  	$('#photo-modal-body').empty();
  	var title = $(this).attr("title");
  	$('#photo-modal-title').html(title);
  	$(this.innerHTML).appendTo('#photo-modal-body');
  	$('#eventsPhoto').modal({show:true});
});
*/
//---//---//---//---//---// LODGING //---//---//---//---//---//

$(function () { 
    $("[data-toggle='popover']").popover().click(function(e) { 
	e.preventDefault();
    });
});

$('.lodging').popover({ 
    html : true,
    title: function() {
      return $("#lodging-head").html();
    },
    content: function() {
      return $("#lodging-content").html();
    }
});


$('.lodging').on('shown.bs.popover', function () {
    lodgingEvent($(this)); // pass the popover object to the event setup function
});


function lodgingEvent(pop) {
    jQuery(function($) {
	$('form.lodging').off('submit');
	$('form.lodging').on('submit', function(event) {
            var $form = $(this);
            var $target = $($form.attr('data-target'));
	    
            $.ajax({
		type: $form.attr('method'),
		url: $form.attr('action'),
		data: $form.serialize(),
 
		success: function(data, status) {
                    $target.html(data);
		    pop.popover("show");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    /* alert("Status: " + textStatus); alert("Error: " + errorThrown); */
                },
            });
 
            event.preventDefault();
	});
    });
}

//---//---//---//---//---// Contact //---//---//---//---//---//

$('#contactModal').on('show.bs.modal', function () {
    $.ajax({
	url: '/contact/',
	success: function(data, status) {
            $('#contact-modal-body').html(data);
	},
    });
});

$('#contactModal').on('shown.bs.modal', function () {
    // Submit Event for Contact - Ajax
    jQuery(function($) {
	$('form.contact').off('submit');
	$('form.contact').on('submit', function(event) {
            var $form = $(this);
            var $target = $($form.attr('data-target'));
            $.ajax({
		type: $form.attr('method'),
		url: $form.attr('action'),
		data: $form.serialize(),
		success: function(data, status) {
                    $target.html(data);
		},
            });
            event.preventDefault();
	});
    });
});

//---//---//---//---//---// Development //---//---//---//---//---//

/*
// Use to find placeIds
var findPlaces = new google.maps.places.PlacesService(locationMap);
var request = {
    location: locationLatLng,
    radius: '500',
    name: 'Buttermilk Falls Inn'
};
findPlaces.nearbySearch(request, function(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++)
	console.log(results[i]);
  }
});
*/
