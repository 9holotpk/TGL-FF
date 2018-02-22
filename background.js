// DEV. EXTENTION BY 9holotpk

var telegramURL = "https://web.telegram.org/";
var readTitle;
var tabID;
var res = "";
var status = ''; // 'contact' default
browser.browserAction.setBadgeText({ text: "" });

function checkQR (what){

	// console.log('CHK: QR = ' + what);
	checkBadge();

}

function checkBadge() {
	browser.tabs.query({ url: telegramURL + "*", status: 'complete' }, function(tabs){
		if (tabs != undefined) {
			if(tabs.length > 0){
				tabID = tabs[0].id;
				// # Read Title.				
				readTitle = tabs[0].title;
				// # Check status by options.
				if (status == 'none') {
					browser.browserAction.setBadgeText({ text: "" });
					browser.browserAction.setTitle({title: 'Telegram Launch'})
				} else {
					var f = readTitle.indexOf("(");
					var e = readTitle.indexOf(")");
					res = readTitle.substring(f+1, e);
					if(res.length > 0){
						browser.browserAction.setTitle({title: 'Chat from ' +res+ ' contact(s) | Click to Launch'})
						browser.browserAction.setBadgeText({ text: res });
						browser.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
					}else{
						browser.browserAction.setTitle({title: 'Telegram Launch'})
						browser.browserAction.setBadgeText({ text: "on" });
						browser.browserAction.setBadgeBackgroundColor({ color: "#000000" });
					}
				}
			}
		}
		
	});
}

function setBadgeQR() {
	browser.browserAction.setBadgeText({ text: "QR" });
	browser.browserAction.setTitle({ title: 'Please Scan QR Code' })
	browser.browserAction.setBadgeBackgroundColor({ color: "#000000" });
}

function setBadgeOn() {
	browser.browserAction.setTitle({title: 'Telegram Launcher'})
	browser.browserAction.setBadgeText({ text: "on" });
	browser.browserAction.setBadgeBackgroundColor({ color: "#000000" });
}

browser.browserAction.onClicked.addListener(function(){
	// # Check Telegram tab.
	browser.tabs.query({ url: telegramURL + "*" }, function(tabs){
        if(tabs.length > 0){
        	var winID = tabs[0].windowId;
    		browser.windows.update(winID, { focused: true });   		
            tabID = tabs[0].id;
			checkQR('by Click');
        }else{
			// # Create new window chat.
        	browser.windows.create({url: telegramURL, type: "popup", width: 685, height: 620, top: 50, left: 50});
			checkQR('by Click');
        }
    });	
});

browser.tabs.onActivated.addListener(function (activeInfo){
	// console.log('log: onActive');
	if(activeInfo.tabId == tabID){
		checkQR('by Active');
	}
});

browser.tabs.onUpdated.addListener(function(tabsU, changeInfo, tab){
		checkQR('by Update');
});

browser.tabs.onRemoved.addListener(function (tabsR, removeInfo){
	if(tabsR==tabID){
		browser.browserAction.setBadgeText({ text: "" });
		browser.browserAction.setTitle({title: 'Telegram Launch'});
	}
});
