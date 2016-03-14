var GLOBAL = new Global(
	null,
	null
);

function Global(url, lastUpdateTime) {
	this.url = url;
	this.lastUpdateTime = lastUpdateTime;

	var self = this;

	this.getUrl = function() {
		return self.url;
	};

	this.setUrl = function(newUrl) {
		self.url = newUrl;
	};

	this.getLastUpdateTime = function() {
		return self.lastUpdateTime;
	};

	this.setLastUpdateTime = function(time) {
		self.lastUpdateTime = time;
	}
}