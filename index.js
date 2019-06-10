var vm = require('vm');

var templator = (template, locals, options) => {
	var settings = {...templator.defaults, ...options};
	return templator.compile(template, settings)(locals);
};

templator.compile = (template, options) => {
	var settings = {...templator.defaults, ...options};
	if (settings.handlebars) template = template.replace(/{{(.+?)}}/g, '\${$1}');

	var script = new vm.Script('`' + template + '`', settings && settings.script);
	return locals => script.runInContext(vm.createContext({...locals, ...(settings && settings.globals)}));
};

templator.defaults = {
	globals: {
		Date, Math,
	},
	handlebars: true,
	script: {},
};

module.exports = templator;
