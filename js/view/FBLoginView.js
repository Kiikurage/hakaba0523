var View = require('./View.js');

function FBLoginView($base) {
	View.apply(this, arguments);

	var self = this;

	globalize('fbAsyncInit', function() {
		FB.init({
			appId: '903589399687253',
			cookie: true,
			xfbml: true,
			version: 'v2.3'
		});

		FB.getLoginStatus(function(response) {
			self.onStatusChange(response);
		});
	});
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js"
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	this.$ = {
		base: $base,
		token: $('.FBLoginView-token', $base),
		userId: $('.FBLoginView-userId', $base)
	};

	globalize('checkLoginState', function checkLoginState() {
		FB.getLoginStatus(function(response) {
			self.onStatusChange(response);
		});
	});

	this.state = FBLoginView.State.UNKNOWN;
}
inheritClass(FBLoginView, View);

FBLoginView.State = {
	UNKNOWN: 0,
	NO_CONNECTED: 1,
	CONNECTED: 2
};

FBLoginView.prototype.setState = function(state) {
	if (this.state === state) return;

	this.state = state;
	this.fire('change');
};

FBLoginView.prototype.onStatusChange = function(response) {
	console.log(response);

	if (response.status === 'connected') {
		this.$.userId.value = response.authResponse.userID;
		this.$.token.value = response.authResponse.accessToken;
		this.setState(FBLoginView.State.CONNECTED);
		this.$.base.submit();

	} else {
		this.setState(FBLoginView.State.NO_CONNECTED);
	}
};

module.exports = FBLoginView;
