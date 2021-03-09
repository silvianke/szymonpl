try{
new (function() {
    this.bootstrap = function(pP) {
	pP = pP || {};
	pP.docEval = document.evaluate ? 1 : 0;

	this.api = 'https://api.spoldzielnia.nsaudience.pl/frontend/api/';

	this.params = function(o) {
		var result = '';
		for (var a in o)
			if (o.hasOwnProperty(a)) {
				var value = o[a];
				if ((value !== '') && (value !== null))
					result += '&' + a + '=' + encodeURIComponent(value);
			}
		return result;
	};

	

	this.go = function() {
		(function(url){
			with (document) {
				var s = createElement('script');
				s.type = 'text/javascript';
				s.async = true;
				s.src = url;
				var el = ['head', 'body'];
				for (var i = 0; i < el.length; i++) {
					var e = getElementsByTagName(el[i])[0];
					if (e) {
						e.appendChild(s);
						break;
					}
				}
			}
		})(this.api + 'matchMainScript.js?time=112' + this.params(pP));

		(function(url, name){
			var e = document.createElement('iframe');
			e.name = name;
			e.title = name;
			e.style.display = 'none';
			(e || e.frameElement).style.cssText = 'width: 0; height: 0; border: 0';
			e.src = url;
			document.body.appendChild(e);
		})(this.api + 'sale.api', 'sale' + new Date().getTime());
	};

    this.go2 = function(x) {
        return function() {
            x.go();
        };
    };

    document.readyState === "complete" ? this.go() : window.attachEvent ? window.attachEvent('onload', this.go2(this)) : window.addEventListener('load', this.go2(this), false);

};

    new this.bootstrap({ sourceId: 'marquard_zeberka.pl' });
})();
} catch(e) {}