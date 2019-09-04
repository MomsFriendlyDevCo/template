@MomsFriendlyDevCo/Template
===========================
Simple ES6 template renderer.

Features:

* Optional compile step
* Supports `{{handlebars}}` style formatting as well as `${es6Templates}}`
* Supports dotted style adressing - even with arrays e.g. `{{foo.0.bar.1.baz}}`
* Tiny with no-dependencies



```javascript
var template = require('@momsfriendlydevco/template');

template('Hello ${name}`, {name: 'Matt'}) //= "Hello Matt"
template('Hello {{name}}`, {name: 'Matt'}) //= "Hello Matt" (same with handlebars syntax)
template('Random chance: ${Math.floor(100 * Math.random())}%') //= "Random Chance: XX%"
```

API
===
This module exposes two main functions, the global will immediately execute a template and return its value, whereas `.compile()` will return a reusable function which can be called multiple times.


template(template, locals, options)
-----------------------------------
Compile and run the template using the provided locals.
If options are not provided they are imported from `template.defaults`.


template.compile(template, options)
-----------------------------------
Compile and return a function which can take different sets of locals.

```javascript
var template = require('@momsfriendlydevco/template');

var compiled = template.compile('Hello ${name}');
compiled({name: 'Matt'}); //=> 'Hello Matt'
compiled({name: 'Joe'})); //=> 'Hello Joe'
```

template.defaults
-----------------
Default options to use.

| Option          | Type      | Default        | Description                                                            |
|-----------------|-----------|----------------|------------------------------------------------------------------------|
| `globals`       | `Object`  | `{Date, Math}` | Global level objects to use when evaluating templates                  |
| `dotted`        | `boolean` | `true`         | Enable dotted notation                                                 |
| `handlebars`    | `boolean` | `true`         | Support simple handlebars syntax (e.g. `{{variable}}`)                 |
| `script`        | `Object`  | `{}`           | Additional settings to pass to `vm.Script()` when compiling the script |
| `safeUndefined` | `boolean` | `true`         | Wrap the context in a proxy so accessing top level undefined aliases doesn't throw |
