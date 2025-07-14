var manifest = chrome.runtime.getManifest(),
	installedVersion = manifest.version,
	version;

function getVars() {
	chrome.storage.local.get({
		version: "",
	}, function(items) {
		version = items.version;
		if (version !== installedVersion) {
			if (version !== "") {
				alertVersion();
			}
			chrome.storage.local.set({'version': installedVersion}, function() {});
		}
	});
}

chrome.runtime.onUpdateAvailable.addListener(function(details) {
  console.log("updating to version " + details.version);
  chrome.runtime.reload();
});

setInterval(function() {
	getVars();
    chrome.runtime.requestUpdateCheck(function(status) {
	  if (status == "update_available") {
		console.log("update pending...");
	  } else if (status == "no_update") {
		console.log("no update found");
	  } else if (status == "throttled") {
		console.log("Oops, I'm asking too frequently - I need to back off.");
	  }
	});
}, 21600000);

getVars();