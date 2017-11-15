var page =require('./pizza/PizzaCart');

function	geocodeAddress(address,	 callback)	{
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'address':	address},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
            var coordinates	=	results[0].geometry.location;
            callback(null,	coordinates);
        }	else	{
            callback(new	Error("Can	not	find	the	adress"));
        }
    });
}

function calculateAndDisplayRoute(A_latlng,	 B_latlng, directionsDisplay) {
    var directionService =	new	google.maps.DirectionsService();
    directionService.route({
        origin:	A_latlng,
        destination:	B_latlng,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function	calculateRoute(A_latlng,	 B_latlng,	callback)	{
    var directionService =	new	google.maps.DirectionsService();
    directionService.route({
        origin:	A_latlng,
        destination:	B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    },	function(response,	status)	{
        if	(	status	==	google.maps.DirectionsStatus.OK )	{
            var leg	=	response.routes[0].legs[0];
            callback(null,	{
                duration:	leg.duration
            });
        }	else	{
            callback(new	Error("Can'	not	find	direction"));
        }
    });
}

function	geocodeLatLng(latlng,	 callback){
//Модуль за роботу з адресою
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'location':	latlng},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
            var adress =	results[1].formatted_address;
            callback(null,	adress);
        }	else	{
            callback(new	Error("Can't	find	adress"));
        }
    });
}




function	initialize()	{
//Тут починаємо працювати з картою
    var mapProp =	{
        center:	new	google.maps.LatLng(50.464379,30.519131),
        zoom:	17
    };
    var html_element =	document.getElementById("googleMap");
    var map	=	new	google.maps.Map(html_element,	 mapProp);

    var point	=	new	google.maps.LatLng(50.464379,30.519131);
    var marker_home	=	new	google.maps.Marker({
        position:	point,
        map:	map,
        icon:	"assets/images/map-icon.png"
    });

    var marker= null;

    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    directionsDisplay.setOptions( { suppressMarkers: true } );

    google.maps.event.addListener(map, 'click',function(me){
        var coordinates	=	me.latLng;

        if(marker){
            marker.setMap(null);
        }

         marker	=	new	google.maps.Marker({
            position:	coordinates,
            map:	map,
            icon:	"assets/images/home-icon.png"
        });


            geocodeLatLng(coordinates,	function(err,	adress){
                if(!err)	{
                    $("#inputAddress").val(adress);
                    $("#googleAdress").text(adress);


                }	else	{
                    console.log("Немає адреси")
                }
            });
            calculateRoute(point,coordinates,	function(err,	time){
                if(!err)	{
                    $("#googleTime").text(time.duration.text);
                }	else	{
                    console.log("Немає адреси")
                }
            });

            calculateAndDisplayRoute(point,coordinates, directionsDisplay);

        });



    function tick() {
        var address = $("#inputAddress").val().trim();
        if(address){
            if(address.length>3&&$("#forAddr").hasClass("has-success")){
                console.log(2);
                $("#googleAdress").text(address);
                geocodeAddress(String(address),	 function (err, coord) {
                    if(!err)	{
                        var coordinates = coord;
                        if(marker){
                            marker.setMap(null);
                        }
                        marker	=	new	google.maps.Marker({
                            position:	coordinates,
                            map:	map,
                            icon:	"assets/images/home-icon.png"
                        });

                        calculateRoute(point,coordinates,	function(err,	time){
                            if(!err)	{
                                $("#googleTime").text(time.duration.text);
                            }	else	{
                                console.log("Немає адреси")
                            }
                        });

                        calculateAndDisplayRoute(point,coordinates, directionsDisplay);

                    }	else	{
                        console.log("Не вдалось знайти адресу.")
                    }

                });
            }
        }
    };

    var timerId = null;
    $("#inputAddress").focusin(function () {
        timerId = setInterval(tick,2000);
    });

    $("#inputAddress").focusout(function () {
        if(timerId!=null){
            clearInterval(timerId);
            setTimeout(tick(),2000);
        }

    });


}

 if (window.location.href == page.order_page){
     google.maps.event.addDomListener(window,	 'load',	initialize);
 }


