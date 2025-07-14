var mSelectedCities = ["כל הארץ"],
	silentAlerts = false,
	special = false,
	preventfocus = false,
	j,
	websocket,
	t,
	status,
	previous_data = [],
	latest_tab = 0,
	global_json_data = [];


chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse){
		if(request.msg == "killIntervals") { 
			loadStatus();
			setTimeout(clearIntervals,1000);
		} else if(request.msg == "setIntervals") { 
			loadStatus();
			setTimeout(setIntervals,1000);
		}
	}
);

function setIntervals() {
	createWebSocketConnection();
}

function clearIntervals() {
	closeWebSocketConnection();
}

/*
function getJson() {
	if (status == "true") {
		$.ajax({
			url: "http://cumta.morhaviv.com/systems/alerts/alerts.json?v=1",
			contentType: "text/html; charset=utf-8",
			dataType: "json",
			cache: false,//true,
			success: function (data) {
				if (data != null) {
					global_json_data = data;
					checkJson(data);
					previous_data = data.data;
				}
				else
				{
					global_json_data = [];
					previous_data = [];
				}
			},
			error: function (requestObject, error, errorThrown) {
				console.log("getJson : error : data = " + errorThrown);
				return;
			}
		});
		loadMore();
	} else if (status == "false") {
		clearIntervals();
	} else {
		console.log("Notice: Delay error may occur!");
	}
}
*/
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};


function createWebSocketConnection() {
    connect('ws://ws.cumta.morhaviv.com:25565/ws');
}

//Make a websocket connection with the server.
function connect(host) {
    if (websocket === undefined) {
        websocket = new WebSocket(host);
    }

    websocket.onopen = function() {
    };

    websocket.onmessage = function (event) {
        var data = JSON.parse(event.data);
		
		if (data != null) {
			if (global_json_data != null && global_json_data != [] && global_json_data != "")
			{
				data.areas = data.areas.split(", ");
				console.log(global_json_data.areas)
				global_json_data.areas = global_json_data.areas.concat(data.areas);
				newArray = global_json_data.areas.concat(data.areas).unique(); 
				global_json_data.areas = newArray;
			}
			else
			{
				global_json_data = data;
				global_json_data.areas = global_json_data.areas.split(", ");
			}
			checkJson(data);
			previous_data = data.areas;
		}
		else
		{
			global_json_data = [];
			previous_data = [];
		}
    };

    //If the websocket is closed but the session is still active, create new connection again
    websocket.onclose = function() {
        websocket = undefined;
		if (status == "true") {
			setTimeout(createWebSocketConnection, 10000);
			createWebSocketConnection();
		}
    };
}

function closeWebSocketConnection() {
    if (websocket != null || websocket != undefined) {
        websocket.close();
        websocket = undefined;
    }
}

function checkJson(jsonData) { 
	var dataa = jsonData;
    var alertId = parseInt(jsonData.notification_id);
	var lastWarningId = getCookie(0);
    
    if (lastWarningId == null || lastWarningId < alertId) {
        var cities = jsonData.areas;
		
		if(cities !=null && $.trim(cities)!='') {
			setCookie(alertId,0);
			document.cookie = "double=0" + ";path=/";
			sendAlert(dataa);
		}
    }
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

function find_area_id(area) {
	var list = []
	for (var i = 0; i < areasObject.length; i++)
	{
		if (areasObject[i].name == area && areasObject[i].hasStreets == false)
		{
			if (areasObject[i].id != "")
			{
				list.push(areasObject[i].id);
			}
			else
			{
				list.push(area);
			}
		}
	}
	return list;
}

function sendAlert(jsonData)
{
	areasArray = jsonData.areas
	if (areasArray.length == 0) {
		return;
	}

	var areas = areasArray.join(", ");
	var citiesArray = []
	areasArray.forEach(function(area) 
	{
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
	var cities = (citiesArray.join(", ")).trim()
	
	
	cityInList = false;
	mSelectedCities.forEach(function (city) 
	{
		if (city == "כל הארץ")
		{
			cityInList = true;
		}
		else
		{
			areasArray.forEach(function (area) 
			{
				if (area == city) 
				{
					cityInList = true;
				}
			})
		}
	})
	
	if (cityInList || silentAlerts)
	{
		if (areas.indexOf("בדיקה") == -1 )
		{
			if (!special)
			{
				if (previous_data.length == 0) {
					chrome.windows.create({'url': '../alert.html', 'type': 'popup', 'focused': !preventfocus, 'width': 460, 'height': 360, 'left': screen.width-460, 'top': screen.height-360}, function(window) {
						latest_tab = window.id;
					});
					createAlertEffects();
				}
				else
				{
					if (latest_tab != 0)
					{
						chrome.windows.update(latest_tab, {"focused": true}, function(window) {
							if (chrome.runtime.lastError) {
								chrome.windows.create({'url': '../alert.html', 'type': 'popup', 'focused': !preventfocus, 'width': 460, 'height': 360, 'left': screen.width-460, 'top': screen.height-360}, function(window) {
									latest_tab = window.id;
								});
							}
						});
					}
					createAlertEffects();
				}
			}
			else
			{
				generateAlert(areas, cities, cityInList);
			}
		}
	}
}

var myNotificationID = null;
var url = null;
var obj = null;

function createAlertEffects()
{
	if (!silentAlerts || cityInList)
	{
		playSound();
	}
	else if (silentAlerts)
	{
		playSecondarySound();
	}
}

function generateAlert(title, text, cityInList) {
	if (!silentAlerts || cityInList)
	{
		playSound();
	}
	else if (silentAlerts)
	{
		playSecondarySound();
	}
	
	var date = (new Date());
	var alertTime = 
					("0" + date.getHours()).substr(-2) + ":" + ("0" + date.getMinutes()).substr(-2) + ":" + ("0" + date.getSeconds()).substr(-2) + " "
					+ ("0" + (date.getDate())).substr(-2) + "/" + ("0" + (date.getMonth() + 1)).substr(-2) + "/" + (date.getFullYear());
	
	var options = {
	  type: "basic",
	  title: title + "\n[" + alertTime + "]",
	  message: "אזעקה ב"+text,
	  iconUrl: "img/alert.png",
	  buttons: [{
		title: "פתח מפה אינטראקטיבית",
		iconUrl: "open.png"
		}, {
		title: "העתק אזור התרעה",
		iconUrl: "copy.png"
	  }]
	  
	}
	var message = text;
	var message_copy = "אזעקה (" + alertTime + "):\nאיזורי התרעה: " + title + "\n---------------------\nיישובים: " + text + "\n\nנשלח דרך כומתה - צבע אדום";
	
	var test12 = title;
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
	
	
	var finalC = 'javascript:'+fakePostCode+'; fakePost("' + htmlentities.encode(title) + '","' + htmlentities.encode(message) + '");';
	
	
	return chrome.notifications.create("", options, function(id) {
		myNotificationID = id;
		url = finalC;
		obj = message_copy;
		var doc = new DOMParser().parseFromString(obj, 'text/html');
		var text = doc.body.textContent;
		setButtons(myNotificationID,url,text);
	});
}

function setButtons(myNotificationID,url,text) {
	chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
		if (notifId === myNotificationID) {
			if (btnIdx == 0)
			{
				response = window.open(url,'_blank');
			}
			else if (btnIdx == 1) 
			{
				var doc = new DOMParser().parseFromString(obj, 'text/html');
				var input = document.createElement('textarea');
				document.body.appendChild(input);
				input.value = text;
				input.focus();
				input.select();
				document.execCommand('Copy');
				input.remove();
			}
		}
	});
}

function setCookie(alertId) {
	document.cookie = "last_alert_id=" + alertId + ";path=/";
}

function getCookie() {
	var arrCookies = document.cookie.split("; ");
	for (var i = 0 ; i < arrCookies.length ; i++) {
		var arrCookie = arrCookies[i].split("=");
		if (arrCookie[0] == "last_alert_id") {
			return unescape(arrCookie[1]);
		}
	}
}

function getCookieActive() {
    var arrCookies = document.cookie.split("; ");
    for (var i = 0 ; i < arrCookies.length ; i++) {
        var arrCookie = arrCookies[i].split("=");
        if (arrCookie[0] == "double") {
            return unescape(arrCookie[1]);
        }
    }
}

function getCookieUrl() {
    var arrCookies = document.cookie.split("; ");
    for (var i = 0 ; i < arrCookies.length ; i++) {
        var arrCookie = arrCookies[i].split("=");
        if (arrCookie[0] == "url") {
            return unescape(arrCookie[1]);
        }
    }
}

function playSound() {
	var soundType = null;
	chrome.storage.local.get({
		soundsave: 'מטוס',
	}, function(items) {
		soundType = items.soundsave;
		
		if (soundType == "אזעקה קצרה") {
			var audio = new Audio('sounds/short.mp3');
			audio.play();
		} else if (soundType == "מטוס") {
			var audio = new Audio('sounds/alarm.mp3');
			audio.play();
		} else if (soundType == "צבע אדום") {
			var audio = new Audio('sounds/redalert.mp3');
			audio.play();
		} else if (soundType == "אזעקה ארוכה") {
			var audio = new Audio('sounds/long.mp3');
			audio.play();
		} else if (soundType == "סירנה") {
			var audio = new Audio('sounds/siren.mp3');
			audio.play();
		} else if (soundType == "צפצוף חלש") {
			var audio = new Audio('sounds/beep.mp3');
			audio.play();
		} else if (soundType == "פעמון") {
			var audio = new Audio('sounds/pikud.mp3');
			audio.play();
		}
	});

	
}

function playSecondarySound() {
	var soundType = null;
	chrome.storage.local.get({
		soundsecondarysave: 'ללא',
	}, function(items) {
		soundType = items.soundsecondarysave;
		
		if (soundType == "אזעקה קצרה") {
			var audio = new Audio('sounds/short.mp3');
			audio.play();
		} else if (soundType == "מטוס") {
			var audio = new Audio('sounds/alarm.mp3');
			audio.play();
		} else if (soundType == "צבע אדום") {
			var audio = new Audio('sounds/redalert.mp3');
			audio.play();
		} else if (soundType == "אזעקה ארוכה") {
			var audio = new Audio('sounds/long.mp3');
			audio.play();
		} else if (soundType == "סירנה") {
			var audio = new Audio('sounds/siren.mp3');
			audio.play();
		} else if (soundType == "צפצוף חלש") {
			var audio = new Audio('sounds/beep.mp3');
			audio.play();
		} else if (soundType == "פעמון") {
			var audio = new Audio('sounds/pikud.mp3');
			audio.play();
		}
	});

	
}

function loadMore() {
	loadSilent(function(elements) {
		silentAlerts = elements["silentAlerts"];
	});
	loadSpecial(function(elements) {
		special = elements["special"];
	});
	loadPreventFocus(function(elements) {
		preventfocus = elements["preventfocus"];
	});
}
function initAndLoadData() {
	loadSelectedCities(function(elements) {
		if (elements['SelectedCities_cumta_new']) {
			mSelectedCities = elements['SelectedCities_cumta_new'];
		}
	});
	loadStatus();
	setIntervals();
}

function saveSelectedCities(cities) {
	chrome.storage.local.set({'SelectedCities_cumta_new': cities}, function() {});
	mSelectedCities = cities;
}
function loadSelectedCities(callback) {
	chrome.storage.local.get('SelectedCities_cumta_new', callback);
}
function loadSilent(callback) {
	chrome.storage.local.get('silentAlerts', callback);
}
function loadSpecial(callback) {
	chrome.storage.local.get('special', callback);
}
function loadPreventFocus(callback) {
	chrome.storage.local.get('preventfocus', callback);
}
function loadStatus() {
	chrome.storage.local.get({
		status: true,
	}, function(items) {
		status = Boolean(items.status);
	});
}
function getSelectedCities() {
	return mSelectedCities;
}

initAndLoadData();

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
