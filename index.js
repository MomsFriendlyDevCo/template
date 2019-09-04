var vm = require('vm');

var templator = (template, locals, options) => {
	var settings = {...templator.defaults, ...options};
	return templator.compile(template, settings)(locals);
};

templator.compile = (template, options) => {
	var settings = {...templator.defaults, ...options};
	if (settings.handlebars) template = template.replace(/{{(.+?)}}/g, '\${$1}');
	if (settings.dotted) { // Tidy up dotted notation
		template = template.replace(/\${\s*([a-z0-9\._]+?)\s*}/ig, (match, expr) =>
			'${'
			+ expr
				.replace(/\.([0-9]+)/g, '[$1]') // Rewrite '.123' -> '[123]'
				.replace(/^([0-9]+)\.(.)/, (match, expr, nextChar) => '$data[' + expr + ']' + (nextChar == '[' ? '' : '.') + nextChar) // Prefix number followed by object
				.replace(/^([0-9]+)\[/, (match, expr) => '$data[' + expr + '][') // Prefix number followed by number
			+ '}'
		);
	}

	var script = new vm.Script('`' + template + '`', settings && settings.script);

	return locals => {
		var context = {
			$data: locals, // Export $data so we can support numeric start rewriting (i.e. `{{0.foo}}` -> `{{$data[0].foo}}`)
			...locals,
			...(settings && settings.globals),
		};

		return script.runInContext(vm.createContext(
			settings.safeUndefined
				?  new Proxy(context, {
					get(obj, prop) {
						return prop in obj
							? obj[prop]
							: undefined;
					},
				})
				: context
		));
	};
};

templator.defaults = {
	globals: {
		Date, Math,
	},
	dotted: true,
	handlebars: true,
	script: {},
	safeUndefined: true,
};

module.exports = templator;
