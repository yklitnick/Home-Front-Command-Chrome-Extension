var background = chrome.extension.getBackgroundPage();
var areasObject = background.areasObject;
var citiesObject = background.citiesObject;
var streetsObject = background.streetsObject;


var citieslist = '';

		
function find_area(id) {
	for (var i = 0; i < areasObject.length; i++)
	{
		if (areasObject[i].id == id)
		{
			if (areasObject[i].name != "")
			{
				return areasObject[i].name;
			}
			else
			{
				return id;
			}
		}
	}
}


citiesObject.forEach(function(object) {
	if (object.type == 0)
	{
		area = find_area(object.area)
		city = object.name
		citieslist += '<div class="city-item" style="cursor: pointer;" data="' + area + '"><input data="' + area + '" type="checkbox" name="' + city + '">' + city + '</div>';
	}
})

//console.log(citieslist)
$('#cities-div').html(citieslist);
$('#cities-div').width("90%");

streetslist = [];

streetsObject.forEach(function(object) {
	streets = object.cityid
	if (typeof streetslist[object.cityid] === 'undefined')
	{
		streetslist[object.cityid] = '<div style="display: none" id="streets' + object.cityid + '">';
	}
	streetName = object.name
	streetArea = find_area(object.area)
	streetslist[object.cityid] += '<div class="street-item" style="cursor: pointer;"><input data="' + streetArea + '" type="checkbox" name="' + streetName + '">' + streetName + '</div>';
});

console.log(streetslist);

streetslist.forEach(function(object) {
	console.log(object);
	object += "</div>";
	$("#streets-div").prepend(object);
})
$('#streets-div').width("90%");

var manifest = chrome.runtime.getManifest(),
	installedVersion = manifest.version;
	

$(".dropdown-menu").append($('<li><a id="Version" class="disabled" href="#">גירסה: ' + installedVersion + '</a></li>'));
