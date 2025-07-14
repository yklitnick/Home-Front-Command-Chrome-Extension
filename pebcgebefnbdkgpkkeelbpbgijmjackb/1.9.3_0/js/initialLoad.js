areasObject = [];
citiesObject = [];
streetsObject = [];
AreasCities = {};

function getLists ()
{
	getAreasObject(false);
	getCitiesObject(false);
	getStreetsObject(false);
	getAreaCitiesObject(false);
}

function getAreasObject(checked)
{
	$.ajax({
		url: "http://cumta.morhaviv.com/systems/pull/pull.php?action=1&type=1",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		cache: false,//true,
		success: function (data) {
			chrome.storage.local.set({
				areasObject: data,
			});
			areasObject = data
		},
		error: function (requestObject, error, errorThrown) {
			console.log("getJson : error : data = " + errorThrown);
			if (!checked)
			{
				retrieveOldAreas();
			}
			return;
		}
	});
}

function getCitiesObject(checked)
{
	$.ajax({
		url: "http://cumta.morhaviv.com/systems/pull/pull.php?action=1&type=2",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		cache: false,//true,
		success: function (data) {
			chrome.storage.local.set({
				citiesObject: data,
			});
			citiesObject = data
		},
		error: function (requestObject, error, errorThrown) {
			console.log("getJson : error : data = " + errorThrown);
			if (!checked)
			{
				retrieveOldCities();
			}
			return;
		}
	});
}
	
function getStreetsObject(checked)
{
	$.ajax({
		url: "http://cumta.morhaviv.com/systems/pull/pull.php?action=1&type=3",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		cache: false,//true,
		success: function (data) {
			chrome.storage.local.set({
				streetsObject: data,
			});
			streetsObject = data
		},
		error: function (requestObject, error, errorThrown) {
			console.log("getJson : error : data = " + errorThrown);
			if (!checked)
			{
				retrieveOldStreets();
			}
			return;
		}
	});
}
	
function getAreaCitiesObject(checked)
{
	$.ajax({
		url: "http://cumta.morhaviv.com/systems/pull/pull.php?action=1&type=4",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		cache: false,//true,
		success: function (data) {
			AreasCities = {};
			for (var i = 0; i < data.length; i++){
				var obj = data[i];
				AreasCities[obj.area] = obj.cities.trim()
			}
			
			chrome.storage.local.set({
				areas_cities: AreasCities,
			});
		},
		error: function (requestObject, error, errorThrown) {
			console.log("getJson : error : data = " + errorThrown);
			if (!checked)
			{
				retrieveOldAreaCities();
			}
			return;
		}
	});
}


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

function retrieveOldAreas()
{
	chrome.storage.local.get({
		areasObject: null,
	}, function(items) {
		if (items.areasObject != null)
		{
			areasObject = items.areasObject;
		}
		else
		{ 
			areasObject = []
			setTimeout('getAreasObject(true)', 60000)
		}
		
	});
}

function retrieveOldCities()
{
	chrome.storage.local.get({
		citiesObject: null,
	}, function(items) {
		if (items.citiesObject != null)
		{
			citiesObject = items.citiesObject;
		}
		else
		{
			citiesObject = []
			setTimeout('getCitiesObject(true)', 60000)
		}
		
	});
}

function retrieveOldStreets()
{
	chrome.storage.local.get({
		streetsObject: null,
	}, function(items) {
		if (items.streetsObject != null)
		{
			streetsObject = items.streetsObject;
		}
		else
		{
			streetsObject = []
			setTimeout('getStreetsObject(true)', 60000)
		}
		
	});
}

function retrieveOldAreaCities()
{
	chrome.storage.local.get({
		areas_cities: null,
	}, function(items) {
		if (items.areas_cities != null)
		{
			AreasCities = items.areas_cities;
		}
		else
		{
			AreasCities = []
			setTimeout('getAreaCitiesObject(true)', 60000)
		}
		
	});
}


function alertVersion() {
	var title = "כומתה עודכן בהצלחה!";
	var message = "כומתה עודכן בהצלחה מגירסה " + version + "\n לגירסה " + installedVersion;
	
			
	var options = {
	  type: "basic",
	  title: title,
	  message: message,
	  iconUrl: "img/alert.png"
	}
	
	
	return chrome.notifications.create("", options, function(id) {
	});
}

getLists();