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
