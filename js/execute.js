var canGetGift = function() {
	console.log("Asking for user is logged or not.");
	chrome.runtime.sendMessage({
		msg: "isLogin",
	}, function(response) {
		var result = response.msg;
		console.log("Get response, User isLogin: " + (result !== undefined));
		if (result) {
			var autoGetGift = new AutoGetGift();
			autoGetGift.execute();
			autoGetGift = null;
		}
	});
}

var decideToGetGift = function() {
	console.log("Asking for is it time to get daily gift.");
	chrome.runtime.sendMessage({
		msg: "timing",
	}, function(response) {
		var result = response.msg;
		console.log("Get response, time to get: " + result);
		if (result) {
			canGetGift();
		}
	});
}();