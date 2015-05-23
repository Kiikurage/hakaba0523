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
