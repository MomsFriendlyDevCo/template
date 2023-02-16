let template = require('./shared');
let vm = require('vm');

Object.assign(template.defaults, {
	mode: 'browser',
	templateCompile: settings => {
		return new Function('v',
			'const tagged = v => { with(v) return `' + settings.template + '` };'
			+ 'return tagged(v)'
		)
	},
	templateInstance: (compiled, context) => {
		console.log('RUN', '[[[', compiled.toString(), ']]]');
		return compiled(context);
	},
});

module.exports = template;
