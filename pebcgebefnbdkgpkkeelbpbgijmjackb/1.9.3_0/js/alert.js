Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


var areasObject = chrome.extension.getBackgroundPage().areasObject;
var citiesObject = chrome.extension.getBackgroundPage().citiesObject;
var streetsObject = chrome.extension.getBackgroundPage().streetsObject;
var AreasCities = chrome.extension.getBackgroundPage().AreasCities;
var previous_data = [];
var activated_areas = [];
var activated_areas_ids = [];
var i = 0;
var cities = "";
var date = (new Date());
var alertTime = 
				("0" + date.getHours()).substr(-2) + ":" + ("0" + date.getMinutes()).substr(-2) + ":" + ("0" + date.getSeconds()).substr(-2) + " "
				+ ("0" + (date.getDate())).substr(-2) + "/" + ("0" + (date.getMonth() + 1)).substr(-2) + "/" + (date.getFullYear());
var startTime = new Date();



function setIntervals() {
	j = setInterval(getJson, 1000);//2000
}


function getJson() {
	var global_json_data = chrome.extension.getBackgroundPage().global_json_data;
	generateLists(global_json_data)
}



function setCookie(alertId) {
	document.cookie = "new_last_alert_id=" + alertId + ";path=/";
}

function getCookie() {
	var arrCookies = document.cookie.split("; ");
	for (var i = 0 ; i < arrCookies.length ; i++) {
		var arrCookie = arrCookies[i].split("=");
		if (arrCookie[0] == "new_last_alert_id") {
			return unescape(arrCookie[1]);
		}
	}
}

function generateLists(jsonData)
{
	$("#alertsGrid").html("");
	if (jsonData == null || jsonData == [] || jsonData == "") {
		window.close();
		return;
	}

	if (!(previous_data.length === jsonData.areas.length && previous_data.every(function(value, index) { return value === jsonData.areas[index]})))
	{
		startTime = new Date();
		previous_data = jsonData.areas.slice();
	}
	
	if (Math.round((new Date() - startTime) / 1000 ) >= 45)
	{
		if (previous_data.length === jsonData.areas.length && previous_data.every(function(value, index) { return value === jsonData.areas[index]}))
		{
			chrome.extension.getBackgroundPage().global_json_data = null
		}
		else
		{
			startTime = new Date();
			previous_data = jsonData.areas.slice();	
		}
	}
	
	areasArray = jsonData.areas
	
	
	areasArray.sort(function(a, b){
	  return b.length - a.length;
	});

	j = 0;
	big = false;
	areasArray.forEach(function(area) 
	{
		if (!activated_areas.includes(area))
		{
			activated_areas.push(area);
		}
		if (j % 3 == 0)
		{
			big = false;
		}
		var div = '<a href="#" class="grid-area" id="area' + i + '" ';
		if (area.length > 16)
		{
			//div += 'style="grid-column: 1 / 2; grid-row: 1 / 2;"';
		}
		div += '><div class="grid-item" ';
		if (area.length > 16 || big)
		{
			div += 'style="height: 55.4px; text-align: center; vertical-align: middle;"';
			big = true;
		}
		div += '><font style="padding-left: 10px; padding-right: 10px; color: white; font-size: 15px; font-weight: bold; line-height: 20px; vertical-align: middle">' + area + '</font></div></a>';
		$("#alertsGrid").append(div);
		j++;
		i++;
	});
	/*activated_areas.forEach(function(area) 
	{
		if (!areasArray.includes(area))
		{
			console.log(activated_areas_ids[activated_areas.indexOf(area)]);
			$("#area" + activated_areas_ids[activated_areas.indexOf(area)]).remove();
			activated_areas_ids.splice(activated_areas.indexOf(area), 1);
			activated_areas.remove(area);
		}
	});*/

	var areas = areasArray.join(", ");
	var citiesArray = []
	areasArray.forEach(function(area) 
	{
		//$("#alertsGrid").append('<div class="grid-item"><font style="padding-left: 10px; padding-right: 10px; color: white; font-size: 15px; font-weight: bold; line-height: 20px; vertical-align: middle">' + area + '</font></div>')
		var foundCities = findCities(area);
		if (foundCities != "")
		{
			citiesArray.push(foundCities)
		}
		else if (area != "")
		{
			citiesArray.push(area)
		}
	})
	cities = (citiesArray.join(", ")).trim()
	
	
	//document.getElementById("areas").innerHTML = areas;
	//document.getElementById("cities").innerHTML = cities;
}

function isEmpty(arr) {
    for(var key in arr) {
        if(arr.hasOwnProperty(key))
            return false;
    }
    return true;
}


function findCities(area)
{
	if (isEmpty(AreasCities))
	{
		retrieveOldAreaCities();
	}
	cities = "";
	if (AreasCities[area] != undefined && area != "")
	{
		cities = AreasCities[area]
	}
	if (cities.length == 0) {
	  return "";
	}
	return cities;
}

$("#x").click(function() {
	$("#cities_box").hide();
});
/*
$("a.grid-area").click(function() {
	console.log("hi");
	console.log(this.id);
});*/

$("#alertsGrid").on("click", "a.grid-area", function(){
    $("#cities_box").show();
    $("#cities").text(findCities($(this).text()));
});

$("#map").click(function() {
	var areas = activated_areas.join(", ");
	function fakePost(test12,message) {   
		var form = document.createElement('form');
		form.setAttribute('method', 'post');
		form.setAttribute('action', 'http://cumta.morhaviv.com/index.php#map');
		var params = {area: test12, cities: message};
		for(var key in params) {
			var hiddenField = document.createElement('input');
			hiddenField.setAttribute('type', 'hidden');
			hiddenField.setAttribute('name', key);
			hiddenField.setAttribute('value', params[key]);
			form.appendChild(hiddenField);
		}
		document.body.appendChild(form);
		form.submit();
	};

	fakePostCode = fakePost.toString().replace(/(\n|\t)/gm,'');
	var finalC = 'javascript:'+fakePostCode+'; fakePost("' + htmlentities.encode(areas) + '","' + htmlentities.encode(cities) + '");';
	chrome.tabs.create({ url: finalC });
});


$("#copy").click(function() {
	var areas = activated_areas.join(", ");
	var message_copy = "אזעקה (" + alertTime + "):\nאיזורי התרעה: " + areas + "\n---------------------\nיישובים: " + cities + "\n\nנשלח דרך כומתה - צבע אדום";
	var doc = new DOMParser().parseFromString(message_copy, 'text/html');
	var input = document.createElement('textarea');
	input.setAttribute("style", "width: 1px; height: 1px");
	document.body.appendChild(input);
	input.value = message_copy;
	input.focus();
	input.select();
	document.execCommand('Copy');
	input.remove();
});

window.htmlentities = {
	/**
	 * Converts a string to its html characters completely.
	 *
	 * @param {String} str String with unescaped HTML characters
	 **/
	encode : function(str) {
		var buf = [];
		
		for (var i=str.length-1;i>=0;i--) {
			if (str[i] == " ")
			{
				buf.unshift([' '].join(''));
			}
			else if (!isNaN(parseInt(str[i], 10)))
			{
				buf.unshift([str[i]].join(''));
			}
			else
			{
				buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
			}
		}
		
		return buf.join('');
	},
	/**
	 * Converts an html characterSet into its original character.
	 *
	 * @param {String} str htmlSet entities
	 **/
	decode : function(str) {
		return str.replace(/&#(\d+);/g, function(match, dec) {
			return String.fromCharCode(dec);
		});
	}
};

getJson();
setIntervals();

