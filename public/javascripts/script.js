(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Application = function(){
	if (instance) return instance;
	instance = this;
	globalize('app', instance);

	Application.EventDispatcher.apply(this, arguments);
}

Application.EventDispatcher = require('./util/EventDispatcher.js');
Application.UploadView = require('./view/UploadView.js');
Application.FBLoginView = require('./view/FBLoginView.js');

inheritClass(Application, Application.EventDispatcher);

var instance = null;

new Application();

globalize('Application', Application);

module.exports = Application;

},{"./util/EventDispatcher.js":2,"./view/FBLoginView.js":4,"./view/UploadView.js":5}],2:[function(require,module,exports){
/**
 *  Event dispatchable object.
 *
 *  @constructor
 */
var EventDispatcher = function EventDispatcher() {
    /**
     *  The list of all event listeners attached on this.
     *
     *  @type {Object<string, Array<{
     *        listener: Function,
     *        context: Object
     *  }>>}
     *  @private
     */
    this.eventListeners_ = {};
};

/**
 * finalize
 */
EventDispatcher.prototype.finalize = function() {
    this.eventListeners_ = null;
};

/**
 *  attach an event listener.
 *
 *  @param {string} type event type.
 *  @param {Function} listener the event listener to attach.
 *  @param {Object} [context=this] the context event listener called with.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.on = function(type, listener, context) {
    var listeners = this.eventListeners_[type];
    context = context || this;

    if (typeof listener !== 'function') {
        throw new Error('The event listener is not Function.');
    }

    if (!listeners) {
        listeners = this.eventListeners_[type] = [];
    }

    listeners.push({
        listener: listener,
        context: context
    });

    return this;
};

/**
 *  detach the event listener.
 *  if the event listener is detached for more than twice,
 *  this method detach all of them.
 *
 *  @param {string} type event type.
 *  @param {Function} listener the event listener to detach.
 *  @param {Object} [context=this] the context event listener was registered with.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.off = function(type, listener, context) {
    var listeners = this.eventListeners_[type],
        i, max;

    if (!listeners) return this;

    for (i = 0, max = listeners.length; i < max; i++) {
        if (listeners[i].listener === listener &&
            listeners[i].context === context) {
            listeners.splice(i, 1);
            i--;
            max--;
        }
    }

    return this;
};

/**
 *  fire the event.
 *
 *  @param {string} type event type.
 *  @param {...*} optArgs arguments.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.fire = function(type, optArgs) {
    var listeners = this.eventListeners_[type],
        args = Array.prototype.slice.call(arguments, 1),
        i, max;

    if (!listeners) return this;

    for (i = 0, max = listeners.length; i < max; i++) {
        listeners[i].listener.apply(listeners[i].context, args);
    }

    return this;
};

/**
 *  attach an event listener,
 *  which will be called only once.
 *
 *  @param {string} type event type.
 *  @param {Function} listener the event listener to attach.
 *  @param {Object} [context=this] the context event listener called with.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.once = function(type, listener, context) {
    var self = this,
        proxy = function() {
            self.off(type, proxy, context);
            listener.apply(this, arguments);
        };

    return this.on(type, proxy, context);
};

module.exports = EventDispatcher;

},{}],3:[function(require,module,exports){
var global = window;	//@TODO HUCK!!!!!

global.inheritClass = function (child, parent) {
	var __ = function(){};
	__.prototype = parent.prototype;
	child.prototype = new __();
	child.prototype.constructor = child;
};

global.globalize = function(key, value) {
	global[key] = value;
};

global.$ = function(query, scope){
	return (scope || document).querySelector(query);
};

global.$$ = function(query, scope){
	return (scope || document).querySelectorAll(query);
};

global.HTTPStatus = {
	OK: 200
};

},{}],4:[function(require,module,exports){
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

},{"./View.js":6}],5:[function(require,module,exports){
var View = require('./View.js');

function UploadView($base) {
	View.apply(this, arguments);

	this.$ = {
		base: $base,
		fileInput: $('input[type="file"]', $base),
		sendBtn: $('input[type="submit"]', $base),
		link: $('a', $base)
	};

	this.$.fileInput.addEventListener('change', this.onFileInputChange = this.onFileInputChange.bind(this));
	this.$.base.addEventListener('submit', this.onSubmit = this.onSubmit.bind(this));
}
inheritClass(UploadView, View);

UploadView.prototype.onFileInputChange = function(ev) {
	//@TODO validation
};

UploadView.prototype.onSubmit = function(ev) {
	ev.preventDefault();
	this.send();
	return false;
};

UploadView.prototype.beforeSend = function() {
	return {
		form: new FormData(this.$.base)
	};
};

UploadView.prototype.send = function() {
	var data = this.beforeSend(),
		self = this;

	var xhr = new XMLHttpRequest();

	xhr.open('post', '/api/video');
	xhr.send(data.form);
	xhr.onload = function() {
		var data = JSON.parse(xhr.responseText);

		self.$.link.href = '/video/' + data.result.videoId;
		self.$.link.style.display = 'inline';
	};
};

UploadView.prototype.validate = function() {
	//@TODO 送信前の確認
	return true;
};

module.exports = UploadView;

},{"./View.js":6}],6:[function(require,module,exports){
var EventDispatcher = require('../util/EventDispatcher.js');

function View(){
	EventDispatcher.apply(this, arguments);

}
inheritClass(View, EventDispatcher);

module.exports = View;

},{"../util/EventDispatcher.js":2}],7:[function(require,module,exports){
var globalUtil = require('./util/globalUtil.js'),
	Application = require('./app.js');

},{"./app.js":1,"./util/globalUtil.js":3}]},{},[7]);
