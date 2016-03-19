#v2exHelper
##Chrome extension for v2ex
###1. support auto gift get with ajax instead of manual click.
Use chrome storage to store the date to decide whether the user can get the daily gift, and then make sure the user has been logged with cookie.

###2. support resize comments //TODO

###3. support notification with browser
Run an interval function with 30mins to send ajax to Server, currently the url is a RSS. If the RSS's updateTime has not been changed, then we will not notify the User, otherwise the user will receive a notification and can open the tab with clicking the notification.

##TODO
If you have any suggestions, please feel free to contact me or raise issues.
