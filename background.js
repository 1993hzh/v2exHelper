var currentTime = function() {
	var d = new Date();
	return (d.getTime() - d.getTimezoneOffset() * 60000) / 1000;
}

var myCookie = {
	getCookie: function(url, cookieName, callback) {
		if (!chrome.cookies) {
			chrome.cookies = chrome.experimental.cookies;
		}
		chrome.cookies.get({
			"url": url,
			"name": cookieName
		}, function(cookie) {
			if (callback) {
				callback(cookie);
			}
		});
	},

	setCookie: function(url, cookieName, value, expirationDate) {
		if (!chrome.cookies) {
			chrome.cookies = chrome.experimental.cookies;
		}
		chrome.cookies.set({
			"url": url,
			"name": cookieName,
			"domain": ".v2ex.com",
			"httpOnly": false,
			"value": value,
			"expirationDate": expirationDate + currentTime()
		}, function(cookie) {
			console.log(JSON.stringify(cookie));
		});
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("Receive message: " + request);
	if (request.msg == "isLogin") {
		myCookie.getCookie("https://v2ex.com", "A2", function(cookie) {
			sendResponse({
				msg: cookie.value
			});
		});
		//This function becomes invalid when the event listener returns, 
		//unless you return true from the event listener to indicate you wish to send a response asynchronously 
		//(this will keep the message channel open to the other end until sendResponse is called).
		return true; //Important, 
	} else if (request.msg == "timing") {
		myCookie.getCookie("https://www.v2ex.com", "Timing", function(cookie) {
			if (cookie) {
				sendResponse({
					msg: false
				});
			} else {
				sendResponse({
					msg: true
				});
				myCookie.setCookie("https://www.v2ex.com", "Timing", "time", 3600 * 24);
			}
		});
		return true;
	} else {
		sendResponse({});
	}
});