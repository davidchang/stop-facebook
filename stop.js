function supports_local_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function redirect() {
	window.location = "http://bib.ly/1Jo1.5-6.ESV";
}

function formatTime(timeToShow) {
	var hours = Math.floor(timeToShow / (1000*60*60));
	timeToShow -= (hours*1000*60*60);
	var minutes = Math.floor(timeToShow / (1000*60));
	timeToShow -= (minutes*1000*60);
	var seconds = Math.floor(timeToShow / 1000);
	
	var timeLeft = '';
	
	//construct the time string
	if(hours != 1)
		timeLeft += hours + ' hours, ';
	else
		timeLeft += hours + ' hour, ';
		
	if(minutes != 1)
		timeLeft += minutes + ' minutes, ';
	else
		timeLeft += minutes + ' minute, ';
	
	if(seconds != 1)
		timeLeft += seconds + ' seconds';
	else
		timeLeft += seconds + ' second';
	
	return timeLeft;
}

function resetWith(notifications) {
	var d = new Date();
	localStorage['notifications'] = notifications;
	localStorage['time'] = d.getTime();
}

//if no local storage, there's nothing we can do. :/
if(!supports_local_storage())
	return;

var notifications = false;

function hasNotifications() {
	if(/\(\d\) Facebook/.test(document.title))
		return true;
	else if (parseInt(document.getElementById('notificationsCountValue').textContent))
		return true;
	else if (parseInt(document.getElementById('mercurymessagesCountValue').textContent))
		return true;
	else {
		var classes = document.getElementById('fbNotificationsJewel').className;
		if(classes.indexOf('hasNew') !== -1)
			return true;
	}
	return false;
}
function getNumNotifications() {
	//if has notifications, then it's okay.
	var notifications = parseInt(document.getElementById('notificationsCountValue').textContent);
	var messages = parseInt(document.getElementById('mercurymessagesCountValue').textContent);
	return notifications + messages;
}

notifications = hasNotifications();

var d = new Date();
//3 minutes
var minutesWithNoNotifications = 1000 * 60 * 3;
//3 hours
var hoursWithNoNotifications = 1000 * 60 * 60 * 3;
//2 minutes
var minutesPerNotification = 1000 * 60 * 2;

if(notifications)
	resetWith(getNumNotifications());
else {
	//there weren't any notifications. is this person allowed on facebook?
	var lastLogin = localStorage['time'];
	//if last login isn't defined, then set everything and permit it.
	if(!lastLogin)
		resetWith(0);
	else {
		var timeDiff = d.getTime() - parseInt(localStorage['time']);
		
		var validThreshold = minutesWithNoNotifications;
		
		//if there weren't any notifications, then 3 minutes per 3 hours
		if(localStorage['notifications']) {
			var numNotifications = localStorage['notifications'];
			validThreshold = minutesPerNotification * numNotifications;
		}
		
		var debug = false;
		if(debug) {
			alert(formatTime(timeDiff));
			alert(timeDiff + ' comp to ' + validThreshold);
		}
		
		//if the time diff is less than the threshold
		if(timeDiff < validThreshold) {			
			return;
		}
		if(timeDiff > hoursWithNoNotifications)
			resetWith(0);
		else
			redirect();
	}
}

//keep checking if more notifications come
setInterval(function() {
	if(hasNotifications())
		resetWith(getNumNotifications());
}, 1000*60*2);