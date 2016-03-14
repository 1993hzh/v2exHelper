function Notification(url, lastUpdateTime) {
    this.url = url;
    this.tabUrl = "https://www.v2ex.com/notifications";
    this.lastUpdateTime = lastUpdateTime;

    var self = this;

    var parse = function(xml) {
        var parser = new DOMParser();
        return parser.parseFromString(html, "application/xml");
    };

    var checkTime = function(date) {
        var updateTime = new Date(date);
        if (lastUpdateTime) {
            return updateTime > self.lastUpdateTime;
        } else {
            return false;
        }
    };

    var createTab = function() {
        chrome.tabs.create({
            url: self.tabUrl
        }, function(tab) {
            // Currently seems nothing to do
        });
    };

    var createNotification = function() {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "img/favicon48.png",
            title: "v2ex Helper",
            message: "You got new messages.",
            isClickable: true
        });

        chrome.notifications.onClicked.addListener(function(notificationId) {
            createTab();
        });
    };

    this.execute = function() {
        if (!this.url) {
            console.log("Cannot find user's rss address.");
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.url, true);
        xhr.onreadystatechange = function() {
            console.log("Start to check message.");
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log("Check message succeeded.");
                var result = xhr.responseXML;
                var updateTime = result.getElementsByTagName("updated")[0].innerHTML;
                if (checkTime(updateTime)) {
                    createNotification();
                    console.log("Got new messages.");
                }
                // Set updateTime in GLOBAL
                GLOBAL.setLastUpdateTime(new Date(updateTime));
            }
        };
        xhr.send();
    }
}