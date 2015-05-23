var EventDispatcher = require('../util/EventDispatcher.js');

function View(){
	EventDispatcher.apply(this, arguments);

}
inheritClass(View, EventDispatcher);

module.exports = View;
