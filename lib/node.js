let template = require('./shared');
let vm = require('vm');

Object.assign(template.defaults, {
	mode: 'node',
	templateCompile: settings =>
		new vm.Script('`' + settings.template + '`', settings && settings.script),
	templateInstance: (compiled, context, settings) =>
		compiled.runInContext(vm.createContext(context))
});

module.exports = template;
