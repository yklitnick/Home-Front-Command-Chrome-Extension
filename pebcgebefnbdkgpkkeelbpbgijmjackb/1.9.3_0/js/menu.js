(function($){
	$(document).ready(function() {
		
		var installId = chrome.extension.getBackgroundPage().installId,
			installedVersion = chrome.extension.getBackgroundPage().installedVersion,
			chromeversion = chrome.extension.getBackgroundPage().chromeversion;

		$('.navbar-nav li a').click(function(e) {
		  var $this = $(this);
		  if (!$this.parent().hasClass('active') && !$this.hasClass("dropdown-toggle")) {
			if (!$this.hasClass("disabled")) {
				$('.active').removeClass('active');
				$this.parent().addClass('active');
			}
			if ($this.parent().parent().hasClass("dropdown-menu")) {
				if (!$this.hasClass("disabled")) {
					$this.parent().parent().parent().addClass('active');
				}
			}
		  }
		  e.preventDefault();
		});
		
		$("#recentAlertsButton").click(function() {
			document.getElementById('recentFrame').src = document.getElementById('recentFrame').src;
			$("#recentAlerts").fadeIn();
			$("#alertSound").hide();
			$("#moreSettings").hide();
			$("#selectAlerts").hide();
			$("#credits").hide();
			$("#black_container").hide();
		});
		$("#alertSoundButton").click(function() {
			loadSound();
			$("#alertSound").fadeIn();
			$("#recentAlerts").hide();
			$("#moreSettings").hide();
			$("#selectAlerts").hide();
			$("#credits").hide();
			$("#black_container").css('display', 'flex');;
		});
		$("#moreSettingsButton").click(function() {
			loadMore();
			loadSecondarySound();
			$("#moreSettings").fadeIn();
			$("#alertSound").hide();
			$("#recentAlerts").hide();
			$("#selectAlerts").hide();
			$("#credits").hide();
			$("#black_container").css('display', 'flex');;
		});
		$("#creditsButton").click(function() {
			$("#credits").fadeIn();
			$("#alertSound").hide();
			$("#moreSettings").hide();
			$("#selectAlerts").hide();
			$("#recentAlerts").hide();
			$("#black_container").css('display', 'flex');;
		});
		
		$("#errorReport").click(function() {
			chrome.tabs.create({ url: "http://cumta.morhaviv.com/index.php#contact" });
			window.close();
		});
		
		$('li[type="alert"]').each(function(i,el){
		  var id = $(el).attr("id");

		});

		
		
		$("#enableButton").click(function() {
			if ($("#enableButton").hasClass("activatedCumta")) {
				$( "#dialog-text" ).text("האם אתה בטוח שברצונך לבטל את פעולת כומתה?");
				$( "#dialog-confirm" ).dialog({
				  resizable: false,
				  title:"ביטול כומתה",
				  height:185,
				  modal: true,
				  buttons: {
					"אישור": function() {
					  $( this ).dialog( "close" );
					  cumtaStatus(false);
					},
					"ביטול": function() {
					  $( this ).dialog( "close" );
					  
					}
				  }
				});
			} else {
				$( "#dialog-text" ).text("האם אתה בטוח שברצונך להפעיל את כומתה?");
				$( "#dialog-confirm" ).dialog({
				  resizable: false,
				  title:"הפעלת כומתה",
				  height:185,
				  modal: true,
				  buttons: {
					"אישור": function() {
					  $( this ).dialog( "close" );
					  cumtaStatus(true);
					},
					"ביטול": function() {
					  $( this ).dialog( "close" );
					}
				  }
				});
			}
		});
		
		var onClickFixer = 0;
		$("#selectAlertsButton").click(function() {
			$("#black_container").css('display', 'flex');
			onClickFixer++;
			$("#selectAlerts").fadeIn("slow", function() {
				var last;
				$(".city-item").click(function(e) {
					var chk = $("input", this);
					var data_input = chk.attr( "data" );
					var data_div = chk.parent().attr( "data" );
					if (isNaN(data_div)) {
						chk.prop("checked", !chk.prop("checked"));
						saveCities();
						loadCities();
						$("#streets-list").hide();
						$("#streets" + last).hide();
						$("#search-div-street").hide();
					} else {
						$("#streets" + data_div).fadeIn();
						$("#streets-list").fadeIn();
						$("#search-div-street").fadeIn();
						last = data_div
						displayStreets();
						console.log("#streets" + data_div);
					}
				});
				if (onClickFixer % 2 == 0) {
					$(".city-item").click(function(e) {
						var chk = $("input", this);
						var data_input = chk.attr( "data" );
						var data_div = chk.parent().attr( "data" );
						if (isNaN(data_div)) {
							chk.prop("checked", !chk.prop("checked"));
							saveCities();
							loadCities();
							$("#streets-list").hide();
							$("#streets" + last).hide();
							$("#search-div-street").hide();
						} else {
							$("#streets" + data_div).fadeIn();
							$("#streets-list").fadeIn();
							$("#search-div-street").fadeIn();
							last = data_div
							displayStreets();
							console.log("#streets" + data_div);
						}
					});
					$(".city-item input").click(function(e) {
						var input = $(e.target);
						var data_input = input.attr( "data" );
						var data_div = input.parent().attr( "data" );
						if (isNaN(data_div)) {
							input.prop("checked", !input.prop("checked"));
							saveCities();
							loadCities();
						} else {
							input.attr('checked', false);
							$("#streets" + data_div).fadeIn();
							$("#streets-list").fadeIn();
							$("#search-div-street").fadeIn();
							last = data_div
							displayStreets();
						}
					});
					onClickFixer++;
				}
				$(".city-item input").click(function(e) {
					var input = $(e.target);
					var data_input = input.attr( "data" );
					var data_div = input.parent().attr( "data" );
					if (isNaN(data_div)) {
						input.prop("checked", !input.prop("checked"));
						saveCities();
						loadCities();
					} else {
						input.attr('checked', false);
						$("#streets" + data_div).fadeIn();
						$("#streets-list").fadeIn();
						$("#search-div-street").fadeIn();
						last = data_div
						displayStreets();
					}
				});
			});
			$("#alertSound").hide();
			$("#recentAlerts").hide();
			$("#moreSettings").hide();
			$("#credits").hide();
			loadCities();
		});
		
		$("#alertsound-c").click(function() {
			$("#alertsound").fadeIn();
			$("#save-sound").fadeIn();
			$("#choose-c").hide();
			$("#more-c").hide();
			$("#alertsound-c").hide();
			loadSound();
		});
		$("#save-sound").click(function() {
			$("#alertsound").fadeOut();
			$("#save-sound").hide();
			$("#savesound").show();
			$("#choose-c").show();
			$("#more-c").show();
			$("#alertsound-c").show();
			saveSound();
			saveSecondarySound();
		});
		$("#testAlert").click(function() {
			saveSound();
			testAlert();
		});
		$("#testSecondaryAlert").click(function() {
			saveSecondarySound();
			testSecondaryAlert();
		});
		$("#more-c").click(function() {
			$("#more").fadeIn();
			$("#save-more").fadeIn();
			$("#choose-c").hide();
			$("#more-c").hide();
			$("#alertsound-c").hide();
			loadMore();
		});
		$("#save-more").click(function() {
			$("#more").fadeOut();
			$("#save-more").hide();
			$("#choose-c").show();
			$("#more-c").show();
			$("#alertsound-c").show();
			saveMore();
		});
		
		$( "#soundSelector" ).change(function() {
		  saveSound();
		});
		
		$( "#secondarySoundSelector" ).change(function() {
		  saveSecondarySound();
		});
		
		$("#silent").click(function(e) {
			e.stopPropagation();
			saveMore();
		});
		
		$("#special").click(function(e) {
			e.stopPropagation();
			saveMore();
		});
		
		$("#preventfocus").click(function(e) {
			e.stopPropagation();
			saveMore();
		});
		
		
		$('#search').on('input',function(e){
			if ($('#search').val() === "") {
				$('#cities-list .city-item').show();
				return;
			}
			$('#cities-list .city-item').hide();
			$('#cities-list input[name*="' + $('#search').val() + '"]').parent(".city-item").show();
		});
		$('#search-street').on('input',function(e){
			if ($('#search-street').val() === "") {
				$('#streets-list .street-item').show();
				return;
			}
			$('#streets-list .street-item').hide();
			$('#streets-list input[name*="' + $('#search-street').val() + '"]').parent(".street-item").show();
		});
		
		$("#clearing").click(function() {
			$(".city-item input").prop("checked", false);
			$(".street-item input").prop("checked", false);
			$("#search").val("").trigger('input');
			$("#search-street").val("").trigger('input');
			saveSelectedAll();
		});
		
		$("#mor").click(function() {
			chrome.tabs.create({ url: "https://il.linkedin.com/pub/mor-haviv/104/34/26a" });
			window.close();
		});
		

		
		function saveCities() {
			var selected = [];
			$("#cities-list input:checked").each(function(index, data) {
				selected.push($(this).attr("data"));
			});
			$("#streets-list input:checked").each(function(index, data) {
				selected.push($(this).attr("data"));
			});
			if (selected.length == 0) {
				selected.push("כל הארץ");
			}
			
			selected = selected.filter(function(elem, index, self) {
				return index == self.indexOf(elem);
			})
			
			loadCities();
			chrome.extension.getBackgroundPage().saveSelectedCities(selected);
			
			chrome.extension.sendRequest({ msg: "sendCities" });
		}
		function loadCities() {
			var cities = chrome.extension.getBackgroundPage().getSelectedCities().join(", ");
			
			$("#selected-cities").text(cities);
			console.log("Cities were loaded!");
		}

		 
		function saveSelectedAll() {
			var selected = ["כל הארץ"];
			chrome.extension.getBackgroundPage().saveSelectedCities(selected);
			chrome.extension.sendRequest({ msg: "sendCities" });
			loadCities();
		}
		
		function loadSound(){
			chrome.storage.local.get({
				soundsave: 'מטוס',
			  }, function(items) {
				document.getElementById('soundSelector').value = items.soundsave;
			  });
		 }
		
		function loadSecondarySound(){
			chrome.storage.local.get({
				soundsecondarysave: 'ללא',
			  }, function(items) {
				document.getElementById('secondarySoundSelector').value = items.soundsecondarysave;
			  });
		 }

		function saveSound() {
		  var sound = document.getElementById('soundSelector').value;
		  chrome.storage.local.set({
			soundsave: sound,
		  });
		}

		function saveSecondarySound() {
		  var sound = document.getElementById('secondarySoundSelector').value;
		  chrome.storage.local.set({
			soundsecondarysave: sound,
		  });
		}
		function loadMore(){
			chrome.storage.local.get({
				silentAlerts: false,
				special: false,
				preventfocus: false,
			  }, function(items) {
				document.getElementById('silent').checked  = items.silentAlerts;
				document.getElementById('special').checked  = items.special;
				document.getElementById('preventfocus').checked  = items.preventfocus;
			  });
		 }
		 
		 function loadStatus(){
			chrome.storage.local.get({
				status: true,
			  }, function(items) {
				  if (items.status) {
					  $("#enableButton").toggleClass("activatedCumta",true);
					  $("#enableButton").attr("title","לחץ להשבתת כומתה");
				  } else {
					  $("#enableButton").attr("title","לחץ להפעלת כומתה");
				  }
			  });
		 }
		 
		function saveMore() {
		  var silent = document.getElementById('silent').checked ;
		  var preventfocus = document.getElementById('preventfocus').checked ;
		  var special = document.getElementById('special').checked ;
		  chrome.storage.local.set({
			silentAlerts: silent,
			preventfocus: preventfocus,
			special: special,
		  });
		}
		
	var myNotificationID = null;
	var urls = null;
	var obj = null;

		function testAlert() {

			if (document.getElementById('special').checked)
			{
				var date = (new Date());
				var alertTime = 
					("0" + date.getHours()).substr(-2) + ":" + ("0" + date.getMinutes()).substr(-2) + ":" + ("0" + date.getSeconds()).substr(-2) + " "
					+ ("0" + (date.getDate())).substr(-2) + "/" + ("0" + (date.getMonth() + 1)).substr(-2) + "/" + (date.getFullYear());
		
				var message = "בדיקה בדיקה בדיקה";
				var title = "בדיקה בדיקה בדיקה";
				
				var options = {
				  type: "basic",
				  title: "בדיקה בדיקה בדיקה" + "\n[" + alertTime + "]",
				  message: "בדיקה בדיקה בדיקה",
				  iconUrl: "img/alert.png"
				}
				
		
				playSound();
				
				return chrome.notifications.create("", options, function(id) {
				});
			}
			else
			{
					chrome.windows.create({'url': '../alertTest.html', 'focused': !document.getElementById('preventfocus').checked, 'type': 'popup', 'width': 460, 'height': 360, 'left': screen.width-460, 'top': screen.height-360}, function(window) {
					});
					playSound();
			}
		}

		function testSecondaryAlert() {
			console.log(document.getElementById('special').checked);
			if (document.getElementById('special').checked)
			{
				var date = (new Date());
				var alertTime = 
					("0" + date.getHours()).substr(-2) + ":" + ("0" + date.getMinutes()).substr(-2) + ":" + ("0" + date.getSeconds()).substr(-2) + " "
					+ ("0" + (date.getDate())).substr(-2) + "/" + ("0" + (date.getMonth() + 1)).substr(-2) + "/" + (date.getFullYear());
		
				var message = "בדיקה בדיקה בדיקה";
				var title = "בדיקה בדיקה בדיקה";
				
				var options = {
				  type: "basic",
				  title: "בדיקה בדיקה בדיקה" + "\n[" + alertTime + "]",
				  message: "בדיקה בדיקה בדיקה",
				  iconUrl: "img/alert.png"
				}
				
		
				playSecondarySound();
				
				return chrome.notifications.create("", options, function(id) {
				});
			}
			else
			{
					chrome.windows.create({'url': '../alertTest.html', 'type': 'popup', 'focused': !document.getElementById('preventfocus').checked, 'width': 460, 'height': 360, 'left': screen.width-460, 'top': screen.height-360}, function(window) {
					});
					playSecondarySound();
			}
		}

		function cumtaStatus(status) {
			if (status == true) {
				$("#enableButton").toggleClass("activatedCumta",true);
				$("#enableButton").attr("title","לחץ להשבתת כומתה");
				chrome.storage.local.set({
					status: true,
				});
				chrome.extension.sendRequest({ msg: "setIntervals" });
			} else {
				$("#enableButton").toggleClass("activatedCumta",false);
				$("#enableButton").attr("title","לחץ להפעלת כומתה");
				chrome.storage.local.set({
					status: false,
				});	
				chrome.extension.sendRequest({ msg: "killIntervals" });
			}
		}

		function displayStreets() {
			$(".street-item").click(function(e) {
				var chk = $("input", this);
				chk.prop("checked", !chk.prop("checked"));
				saveCities();
				loadCities();
			});
			$(".street-item input").click(function(e) {
				e.stopPropagation();
				saveCities();
				loadCities();
			});
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
		

		loadStatus();
	    loadMore();
	});
})(jQuery);

document.getElementById('recentFrame').src="http://cumta.morhaviv.com/systems/app/chrome/showRecent.php?id=" + Math.floor(Date.now() / 1000);


