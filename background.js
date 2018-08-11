// DEV. EXTENTION BY 9holotpk

var telegramURL = "https://web.telegram.org/";
var tabID;
var status = ''; // 'contact' default
browser.browserAction.setBadgeText({ text: "" });

function checkQR(what) {
	// console.log('CHK: QR = ' + what);
	// checkBadge();
	var set = 'contact';
	browser.tabs.query({ url: telegramURL + "*" }, function (tabs) {
		browser.tabs.sendMessage(tabs[0].id, { line: 'countparas', set: 'contact' });
		// console.log('sendMessage * ' + tabs[0].id);
	});

	browser.runtime.onMessage.addListener(
		function (request, sender) {
			var rescont = request.count;
			var settext = rescont + '';
			if (rescont > 0) {
				// console.log('runtime', rescont);
				// console.log('log: (' +request.count+ ') tab ID: (' +sender.tab.id+ ') Waiting Scan QR Code.');
				browser.browserAction.setBadgeText({ text: settext });
			} else {
				setBadgeOn();
				// console.log('runtime 2', rescont);
			}
		}
	);

}

function setBadgeOn() {
	browser.browserAction.setTitle({ title: 'Telegram Launcher' })
	browser.browserAction.setBadgeText({ text: "on" });
	browser.browserAction.setBadgeBackgroundColor({ color: "#000000" });
}

browser.browserAction.onClicked.addListener(function () {
	// # Check Telegram tab.
	browser.tabs.query({ url: telegramURL + "*" }, function (tabs) {
		if (tabs.length > 0) {
			var winID = tabs[0].windowId;
			browser.windows.update(winID, { focused: true });
			tabID = tabs[0].id;
			checkQR('by Click');
		} else {
			// # Create new window chat.
			browser.windows.create({ url: telegramURL, type: "popup", width: 685, height: 620, top: 50, left: 50 });
			checkQR('by Click');
		}
	});
});

browser.tabs.onActivated.addListener(function (activeInfo) {
	if (activeInfo.tabId == tabID) {
		// console.log('log: onActive');
		checkQR('by Active');
	}
});

browser.tabs.onUpdated.addListener(function (tabsU, changeInfo, tab) {
	browser.tabs.query({ url: telegramURL + "*" }, function (tabs) {
		// console.log("Changed attributes: ", changeInfo);
		if (changeInfo.status == "complete" && tabs.length > 0) {
			var winID = tabs[0].windowId;
			tabID = tabs[0].id;
			checkQR('by Update');
		}
	});
});

browser.tabs.onRemoved.addListener(function (tabsR, removeInfo) {
	if (tabsR == tabID) {
		browser.browserAction.setBadgeText({ text: "" });
		browser.browserAction.setTitle({ title: 'Telegram Launch' });
	}
});
