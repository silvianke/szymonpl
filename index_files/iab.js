try{
(function(){
	const callbacks = {};
	const vendorId = '160';
	
	var tcfFrame;
	var cmpFrame;
	
	var cmpAgreement;
	var tcfAgreement;
	
	var setTimeoutHandle;
	
	var ns__tcfapi = window.__tcfapi;
	var ns__cmp = window.__cmp;
	
	function getCmpFrame(name, current) {
		if(!current){
			current = window
		}
		var iframe;
		try{
			iframe = current.frames[name]
		} catch(e){
			return window.top
		}
		if(iframe){
			return current;
		} else if(current != window.top){
			return getCmpFrame(name, current.parent)
		}
	}
	
	if(!ns__tcfapi) {
		tcfFrame = getCmpFrame("__tcfapiLocator")
		if (tcfFrame) {
			ns__tcfapi = function(cmd, version, callback, arg) {
				const callId = Math.random() + '';
				const msg = {
					__tcfapiCall: {
						command: cmd,
						parameter: arg,
						version: version,
						callId: callId
					}
				}
				callbacks[callId] = callback;
				tcfFrame.postMessage(msg, '*');
			}
		}
	}
	
	if(!ns__cmp) {
		cmpFrame = getCmpFrame("__cmpLocator")
		if (cmpFrame) {
			ns__cmp = function(cmd, arg, callback) {
				const callId = Math.random() + '';
				const msg = {
					__cmpCall: {
						callId: callId,
						command: cmd,
						parameter: arg
					}
				};
				callbacks[callId] = callback;
				cmpFrame.postMessage(msg, '*');
			}
		}
	}
	
	function runCallback(payload) {
		if (payload) {
			var callback = callbacks[payload.callId]
			if (typeof callback === 'function') {
				callback(payload.returnValue, payload.success);
				callbacks[payload.callId] = null;
			}
		}
	}
	
	if(cmpFrame || tcfFrame) {
		window.addEventListener('message', function(event) {
			var json = {};
			try {
				json = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
			} catch (ignore) {}
			runCallback(json.__tcfapiReturn)
			runCallback(json.__cmpReturn)
		}, false);
	}
	
	function createAgreement(c, pc, time) {
		return {
			ns1: (c && pc['1'] && pc['5']) ? true : false,
			ns2: (c && pc['2'] && pc['3'] && pc['4']) ? true : false,
			time: time
		}
	}
	
	if(ns__tcfapi) {
		ns__tcfapi("addEventListener", 2, function(tcData, success){
			if(success && (tcData.eventStatus === 'useractioncomplete' || tcData.eventStatus === 'tcloaded') ) {
				tcfAgreement = createAgreement(tcData.vendor.consents[vendorId], tcData.purpose.consents)
			}
			trySaveAgreement()
		})
	}
	
	if(ns__cmp) {
		ns__cmp("getVendorConsents", null, function(VendorConsents, success){
			var t = (typeof VendorConsents.lastUpdated != "undefined")
				? new Date(VendorConsents.lastUpdated).getTime()
				: parseLastUpdate(VendorConsents.metadata);
			cmpAgreement = createAgreement(VendorConsents.vendorConsents[vendorId], VendorConsents.purposeConsents, t)
			trySaveAgreement()
		})
	}
	
	function trySaveAgreement() {
		if(ns__tcfapi && ns__cmp && (!cmpAgreement || !tcfAgreement)) {
			setTimeoutHandle = setTimeout(saveAgreement, 5000);
		} else {
			if(setTimeoutHandle) {
				clearTimeout(setTimeoutHandle)
				setTimeoutHandle = null
			}
			saveAgreement();
		}
	}
	
	function parseLastUpdate(metadata) {
		var bytes = window.atob(metadata.substring(0,16));
	
		var hiTime = (bytes.charCodeAt(5) & 0x3F) * Math.pow(2, 30); // pow (2, 30)  == x << 30
	
		var loTime = (bytes.charCodeAt(6) << 22)
			| (bytes.charCodeAt(7) << 14)
			| (bytes.charCodeAt(8) << 6)
			| (bytes.charCodeAt(9) >>> 2);
	
		return (hiTime + loTime) * 100;
	}
	
	function saveAgreement() {
		if(!cmpAgreement && !tcfAgreement){ return }

		var ns1 = cmpAgreement && cmpAgreement.ns1 || tcfAgreement && tcfAgreement.ns1 || false;
		var ns2 = cmpAgreement && cmpAgreement.ns2 || tcfAgreement && tcfAgreement.ns2 || false;
		var time = cmpAgreement && cmpAgreement.time || tcfAgreement && tcfAgreement.time || new Date().getTime();
		
		var url = '//gdpr.api.dmp.nsaudience.pl/frontend/agreement/iabCustom.js?source_id=marquard&ns_1=' + ns1 + '&ns_2=' + ns2 + '&t=' + time;
	
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.async = true;
		s.src = url;
		document.querySelector("head, body").appendChild(s);
	}
})();
} catch(e) {}