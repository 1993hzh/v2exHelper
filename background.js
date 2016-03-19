var currentTime = function() {
    var d = new Date();
    return (d.getTime() - d.getTimezoneOffset() * 60000) / 1000;
};

var CookieUtil = {
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
            "domain": "www.v2ex.com",
            "httpOnly": false,
            "value": value,
            "expirationDate": expirationDate + currentTime()
        }, function(cookie) {
            console.log(JSON.stringify(cookie));
        });
    }
};

var StorageUtil = {
    getValue: function(key, callback) {
        chrome.storage.sync.get(key, function(items) {
            if (callback) {
                callback(items);
            }
        });
    },

    setValue: function(key, value) {
        var object = {};
        object[key] = value;
        chrome.storage.sync.set(object, function() {
            if (chrome.extension.lastError) {
                alert('An error occurred: ' + chrome.extension.lastError.message);
                return;
            }
            console.log(JSON.stringify(object) + ' saved.');
        });
    }
};

var DateUtil = {
    beforeCurrent: function(date) {
        var current = new Date();

        if (!date || !DateUtil.isValidDate(date)) {
            StorageUtil.setValue("CurrentDate", current.toString());
            console.log("Trying to compare date, but no date get so decide to set CurrentDate: " + JSON.stringify(current));
            return false;
        }

        if (date.getUTCFullYear() < current.getUTCFullYear()) {
            return true;
        }

        if (date.getUTCMonth() < current.getUTCMonth()) {
            return true;
        }

        if (date.getUTCDate() < current.getUTCDate()) {
            return true;
        }

        return false;
    },

    isValidDate: function(date) {
        if (Object.prototype.toString.call(date) === "[object Date]") {
            if (isNaN(date.getTime())) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Receive message: " + JSON.stringify(request));
    if (request.msg == "isLogin") {
        CookieUtil.getCookie("https://v2ex.com", "A2", function(cookie) {
            sendResponse({
                msg: cookie.value
            });
        });
        //This function becomes invalid when the event listener returns, 
        //unless you return true from the event listener to indicate you wish to send a response asynchronously 
        //(this will keep the message channel open to the other end until sendResponse is called).
        return true; //Important, 
    } else if (request.msg == "timing") {
        StorageUtil.getValue("CurrentDate", function(value) {
            value = new Date(value['CurrentDate']);
            if (DateUtil.beforeCurrent(value)) {
                StorageUtil.setValue("CurrentDate", new Date().toString());
                sendResponse({
                    msg: true
                });
            } else {
                console.log("Its not time yet.");
                sendResponse({
                    msg: false
                });
            }
        });
        return true;
    }
});

(function() {
    setInterval(function() {
        var notification = new Notification(GLOBAL.getUrl(), GLOBAL.getLastUpdateTime());
        notification.execute();
        notification = null;
    }, 1000 * 60 * 30);
})();

var getRss = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.v2ex.com/notifications", true);
    xhr.onreadystatechange = function() {
        var result = xhr.responseText;
        var parser = new DOMParser();
        var resultDOM = parser.parseFromString(result, "text/html");
        var url = resultDOM.querySelector(".sll").value;
        if (url) {
            GLOBAL.setUrl(url);
        } else {
            console.log("Cannot find user's rss address.");
        }
    };
    xhr.send();
};

(function(callback) {
    CookieUtil.getCookie("https://v2ex.com", "A2", function(cookie) {
        if (cookie.value) {
            callback();
        } else {
            console.log("User didn't login.");
        }
    });
})(getRss);