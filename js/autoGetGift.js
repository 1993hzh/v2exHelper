function AutoGetGift() {
	this.preLink = "/mission/daily";
	this.balance = "/balance";

	var self = this;

	var parseWithHtml = function(html) {
		var parser = new DOMParser();
		return parser.parseFromString(html, "text/html");
	};

	var parseWithButton = function(button) {
		var value = button.attributes[1].nodeValue;
		var begin = value.indexOf("'");
		var end = value.lastIndexOf("'");
		return value.substring(begin + 1, end);
	};

	var getResult = function() {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", self.balance, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var balanceDOM = parseWithHtml(xhr.responseText);
				var table = balanceDOM.querySelector("table.data");
				var targetTD = table.rows[1].cells[4];
				var result = targetTD.firstChild.innerHTML;
				console.log(result);
			}
		};
		xhr.send();
	};

	var getGift = function(link) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", link, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				console.log("Finish gift auto get execution.");
				getResult();
			}
		};
		xhr.send();
	};

	this.execute = function() {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", self.preLink, true);
		xhr.onreadystatechange = function() {
			console.log("Start to get random link in daily mission page.");
			if (xhr.readyState == 4 && xhr.status == 200) {
				console.log("Get random link succeed.");
				var resultDOM = parseWithHtml(xhr.responseText);
				var targetButton = resultDOM.querySelector("input.super.normal.button");
				if (targetButton) {
					var link = parseWithButton(targetButton);
					if (link) {
						console.log("Random link is: " + link);
						getGift(link);
					} else {
						console.log("Today has got gift.");
					}
				}
			}
		};
		xhr.send();
	};
}