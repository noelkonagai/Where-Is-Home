## Where Is home?

---

## Concept

[Where Is Home?](http://whereishome.herokuapp.com/) was inspired by the fact that many students at NYU Shanghai and NYU Abu Dhabi consider a number of places as their home. When they are asked the simple question "where are you from?" often they tend to shorten their answer to a single place. The idea behind this project is to represent the divserity of the respondents to this project.

## Branding

The project UX/UI was entirely developed from scratch. Given the time constraints the branding is predominantly determined by the typeface combination of Raleway and Playfair Display, the red color (E24E42), and the roof shaped favicon that is repeated on the UI interface as the "scroll to top" button.

## Technical Execution: Geolocation

The website is initialized with an API call to autocomplete locations with Google Places.

```javascript
function initialize() {

	var input_default = document.getElementById('default_city')
	var input_second = document.getElementById('second_city')
	var input_third = document.getElementById('third_city');
	var autocomplete_default = new google.maps.places.Autocomplete(input_default)
	var autocomplete_second = new google.maps.places.Autocomplete(input_second);
	var autocomplete_third = new google.maps.places.Autocomplete(input_third);
	geocoder = new google.maps.Geocoder();

}
```

After the autocomplete is done, upon submission of the answers, an API call is made to geocode the locations. Below is the code for geolocating the default city.

```javascript
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
```
Last, this geocoded data together with the radio switches was made into a JSON file that was sent to the CouchDB server.

## Technical Execution: Data Visualisation with WebGL Globe

The visualization of the data was facilitated by WebGL Globe. Through the API route that was created in Node.js for this website, the cumulated data from CouchDB is streamed back to results.html file. In this HTML file a script is embedded that creates the 3D globe.

```javascript
xhr = new XMLHttpRequest();
xhr.open('GET', '/api/jsonData', true);
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
```
## Future Development

The project aspires to incorporate a more developed version of API routes, which would filter the inputs. In addition to that the project would incorporate the outward bar spikes from the Globe, a feature that was not used for this version.

## Project Members
Noel Konagai - Project Lead

Craig Protzel - Project Grader




