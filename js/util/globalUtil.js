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
