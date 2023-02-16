let template = require('./shared');

Object.assign(template.defaults, {
	mode: 'browser',
	templateCompile: settings => {
		return new Function('v',
			'const tagged = v => { with(v) return `' + settings.template + '` };'
			+ 'return tagged(v)'
		)
	},
	templateInstance: (compiled, context) => {
		return compiled(context);
	},
});

module.exports = template;
