let templator = (template, locals, options) => {
	let settings = {...templator.defaults, ...options};
	return templator.compile(template, settings)(locals);
};

templator.compile = (template, options) => {
	var settings = {
		template,
		...templator.defaults,
		...options,
	};

	if (settings.handlebars) settings.template = settings.template.replace(/{{(.+?)}}/g, '\${$1}');
	if (settings.dotted) { // Tidy up dotted notation
		settings.template = settings.template.replace(/\${\s*([a-z0-9\._]+?)\s*}/ig, (match, expr) =>
			'${'
			+ expr
				.replace(/\.([0-9]+)/g, '[$1]') // Rewrite '.123' -> '[123]'
				.replace(/^([0-9]+)\.(.)/, (match, expr, nextChar) => '$data[' + expr + ']' + (nextChar == '[' ? '' : '.') + nextChar) // Prefix number followed by object
				.replace(/^([0-9]+)\[/, (match, expr) => '$data[' + expr + '][') // Prefix number followed by number
			+ '}'
		);
	}

	let compiled = settings.templateCompile(settings);

	return locals => {
		var context = {
			$data: locals, // Export $data so we can support numeric start rewriting (i.e. `{{0.foo}}` -> `{{$data[0].foo}}`)
			...locals,
			...(settings && settings.globals),
		};

		if (settings.safeUndefined) context = settings.templateSafeContext(context);

		return settings.templateInstance(compiled, context, settings);
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
	templateSafeContext: context => new Proxy(context, {
		get(obj, prop) {
			return prop in obj
				? obj[prop]
				: undefined;
		},
	}),
};

module.exports = templator;
