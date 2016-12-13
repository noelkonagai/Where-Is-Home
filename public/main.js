//Google Places Autocomplete
var placeSearch, autocomplete, geocoder, loc_default, loc_second, loc_third, data;

function initialize() {

var input_default = document.getElementById('default_city')
var input_second = document.getElementById('second_city')
var input_third = document.getElementById('third_city');
var autocomplete_default = new google.maps.places.Autocomplete(input_default)
var autocomplete_second = new google.maps.places.Autocomplete(input_second);
var autocomplete_third = new google.maps.places.Autocomplete(input_third);
geocoder = new google.maps.Geocoder();

}


var numReturned = 0;

function codeAddress() {
	var address_default = document.getElementById('default_city').value;
	loc_default = []
	geocoder.geocode( { 'address': address_default}, function(results, status) {
	  if (status == 'OK') {
	    loc_default[0]=results[0].geometry.location.lat();
	    loc_default[1]=results[0].geometry.location.lng();
	    console.log(loc_default)
	    numReturned++;
	  } else {
	    console.log('Geocode was not successful for the following reason: ' + status);
	   	loc_default[0]=[""];
	    loc_default[1]=[""];
	    numReturned++;
	  }
	});

	var address_second = document.getElementById('second_city').value;
	loc_second = []
	geocoder.geocode( { 'address': address_second}, function(results, status) {
	  if (status == 'OK') {
	    loc_second[0]=results[0].geometry.location.lat();
	    loc_second[1]=results[0].geometry.location.lng();
	    console.log(loc_second)
	    numReturned++;
	  } else {
	    console.log('Geocode was not successful for the following reason: ' + status);
	    loc_second[0]=[""];
	    loc_second[1]=[""];
	    numReturned++;
	  }
	});

	var address_third = document.getElementById('third_city').value;
	loc_third = []
	geocoder.geocode( { 'address': address_third}, function(results, status) {
	  if (status == 'OK') {
	    loc_third[0]=results[0].geometry.location.lat();
	    loc_third[1]=results[0].geometry.location.lng();
	    console.log(loc_third)
	    numReturned++;
	  } else {
	    console.log('Geocode was not successful for the following reason: ' + status);
	    loc_third[0]=[""];
	    loc_third[1]=[""];
	    numReturned++;
	  }
	});


}

google.maps.event.addDomListener(window, 'load', initialize);



//Website Interactivity
$(window).scroll(function() {
if ($(this).scrollTop() > 1){  
    $('header').addClass("sticky");
  }
  else{
    $('header').removeClass("sticky");
  }
});

$(".css-button-start").click(function() {
	console.log('clicked')
    $('html,body').animate(
    {scrollTop: $(".first_section").offset().top},
    'slow'
    );
});

$(".css-button-toSection2").click(function() {
	console.log('clicked')
    $('html,body').animate({
        scrollTop: $(".second_section").offset().top - 40},
        'slow');
});

$(".css-button-toSection3").click(function() {
	console.log('clicked')
    $('html,body').animate({
        scrollTop: $(".third_section").offset().top - 40},
        'slow');
});

$(".css-button-toSection4").click(function() {
	console.log('clicked')
    $('html,body').animate({
        scrollTop: $(".fourth_section").offset().top - 40},
        'slow');
});

$(".css-button-toSection5").click(function() {
	console.log('clicked')
    $('html,body').animate({
        scrollTop: $(".fifth_section").offset().top - 40},
        'slow');
});

$(".scroll-to-top").click(function() {
	console.log('clicked')
    $('html,body').animate({
        scrollTop: $(".top").offset().top},
        'slow');
});


//browser window scroll (in pixels) after which the "back to top" link is shown
var offset = 300,
	//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
	offset_opacity = 1200,
	//duration of the top scrolling animation (in ms)
	scroll_top_duration = 700;

//Manipulating Data
function makeHTML(theData){
	var htmlString = '<ol>';
	theData.forEach(function(d){
		htmlString += '<li>' + d.name + ' : ' + d.default + '</li>';
	});
	htmlString += '</ol';
	return htmlString;
}

function getWord(term){
	$.ajax({
		url: '/api/word/' + term,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			alert("Oh No! Try a refresh?");
		},
		success: function(data){
			console.log("WooHoo!");
			console.log(data);

			var theData = data.map(function(d){
				return d.doc;
			});
			var str = '';
			if (theData.length === 1){
				str = " time";
			}
			else{
				str = " times";
			}
			$('body').append('<h2>This word has been favorited ' + theData.length + str + '!</h2>');
			var htmlString = makeHTML(theData);
			$('body').append(htmlString);
		}
	});
}

function getAllData(){
	$.ajax({
		url: '/api/all',
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			alert("Oh No! Try a refresh?");
		},
		success: function(data){
			console.log("We have data");
			console.log(data);
			//Clean up the data on the client
			//You could do this on the server
			var theData = data.map(function(d){
				return d.doc;
			});
			var htmlString = makeHTML(theData);
			$('span.q_append').append(htmlString);
		}
	});
}

function saveData(obj){
	$.ajax({
		url: '/save',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(obj), //to make a proper JSON
		error: function(resp){
			console.log("Oh no...");
			console.log(resp);
		},
		success: function(resp){
			console.log('WooHoo!');
			console.log(resp);
			window.location.href = '/results'
			// var htmlString = '<li>' + obj.name + ' : ' + obj.default + '</li>';
			// $('ol').append(htmlString);
		}
	});
}

function createData(){
		var userName = $("#name").val() || 'me';
		var defaultCity = $("#default_city").val() || 'default city';
		var secondCity = $("#second_city").val() || 'second city';
		var thirdCity = $("#third_city").val() || 'third city';
		var timeStamp = new Date();

		var d_1 = $("#d-1").prop( "checked" ) || false;
		var d_2 = $("#d-2").prop( "checked" ) || false;
		var d_3 = $("#d-3").prop( "checked" ) || false;
		var d_4 = $("#d-4").prop( "checked" ) || false;
		var d_5 = $("#d-5").prop( "checked" ) || false;
		var d_6 = $("#d-6").prop( "checked" ) || false;

		var s_1 = $("#s-1").prop( "checked" ) || false;
		var s_2 = $("#s-2").prop( "checked" ) || false;
		var s_3 = $("#s-3").prop( "checked" ) || false;
		var s_4 = $("#s-4").prop( "checked" ) || false;
		var s_5 = $("#s-5").prop( "checked" ) || false;
		var s_6 = $("#s-6").prop( "checked" ) || false;

		var t_1 = $("#t-1").prop( "checked" ) || false;
		var t_2 = $("#t-2").prop( "checked" ) || false;
		var t_3 = $("#t-3").prop( "checked" ) || false;
		var t_4 = $("#t-4").prop( "checked" ) || false;
		var t_5 = $("#t-5").prop( "checked" ) || false;
		var t_6 = $("#t-6").prop( "checked" ) || false;
		//Create data object to be saved

		var data = {
			name: userName,
			default: {
				city: defaultCity,
				lat: loc_default[0],
				lng: loc_default[1],
				birthplace: d_1,
				father: d_2,
				mother: d_3,
				longest: d_4,
				current: d_5,
				other: d_6
			},
			second: {
				city: secondCity,
				lat: loc_second[0],
				lng: loc_second[1],
				birthplace: s_1,
				father: s_2,
				mother: s_3,
				longest: s_4,
				current: s_5,
				other: s_6
			},
			third: {
				city: thirdCity,
				lat: loc_third[0],
				lng: loc_third[1],
				birthplace: t_1,
				father: t_2,
				mother: t_3,
				longest: t_4,
				current: t_5,
				other: t_6
			},
			date: timeStamp,

			jsonFileGL: [["All",[loc_default[0],loc_default[1],0.01,loc_default[0],loc_default[0],0.01, loc_default[0], loc_default[0], 0.01]]]

		};

		return data;

}

//var jsonFile = '/api/jsonData';
var jsonFile = 'population909500.json'


$(document).ready(function(){

	$('#submit').click(function(){
		codeAddress()
		var checkForData = setInterval(function(){
			if(numReturned === 3){
				console.log("Everyone is here!");
				numReturned === 0;
				clearInterval(checkForData);

				var data = createData();
				saveData(data);	
				console.log(data);
			}
			else{
				console.log("Not yet...");
				console.log(numReturned)
			}
		}, 1000)
	});

	makeGlobe(jsonFile);
});


function makeGlobe(jsonFile){
			if(!Detector.webgl){
		      Detector.addGetWebGLMessage();
		    } else {

		      var years = ['1990','1995','2000'];
		      var container = document.getElementById('container');
		      var globe = new DAT.Globe(container);

		      console.log(globe);
		      var i, tweens = [];
		      
		      var settime = function(globe, t) {
		        return function() {
		          new TWEEN.Tween(globe).to({time: t/years.length},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
		          var y = document.getElementById('year'+years[t]);
		          if (y.getAttribute('class') === 'year active') {
		            return;
		          }
		          var yy = document.getElementsByClassName('year');
		          for(i=0; i<yy.length; i++) {
		            yy[i].setAttribute('class','year');
		          }
		          y.setAttribute('class', 'year active');
		        };
		      };
		      
		      for(var i = 0; i<years.length; i++) {
		        var y = document.getElementById('year'+years[i]);
		        y.addEventListener('mouseover', settime(globe,i), false);
		      }
		      
		      var xhr;
		      TWEEN.start();
		      
		      
		      xhr = new XMLHttpRequest();
		      xhr.open('GET', jsonFile, true);
		      xhr.onreadystatechange = function(e) {
		        if (xhr.readyState === 4) {
		          if (xhr.status === 200) {
		            var data = JSON.parse(xhr.responseText);
		            window.data = data;
		            for (i=0;i<data.length;i++) {
		              globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
		            }
		            globe.createPoints();
		            settime(globe,0)();
		            globe.animate();
		            document.body.style.backgroundImage = 'none'; // remove loading
		          }
		        }
		      };
		      xhr.send(null);
		    }
}