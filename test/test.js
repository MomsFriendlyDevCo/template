var expect = require('chai').expect;
var template = require('..');

describe('template()', ()=> {

	it('should render simple variable replacements', ()=> {
		var data = {
			aNumber: 123,
			aDate: new Date('1990-01-01'),
			aString: 'Hello World',
		};
		expect(template('Number: ${aNumber}', data)).to.equal(`Number: ${data.aNumber}`);
		expect(template('Date: ${aDate}', data)).to.equal(`Date: ${data.aDate}`);
		expect(template('String: ${aString}', data)).to.equal(`String: ${data.aString}`);
	});

	it('should support handlebars format', ()=> {
		expect(template('Hello {{name}}', {name: 'Jane'})).to.equal('Hello Jane');
		expect(template('Baz is {{foo.bar.baz}}', {foo: {bar: {baz: 123}}})).to.equal('Baz is 123');
		expect(template('Baz is {{foo.0.bar.0.baz.0}}', {foo: [{bar: [{baz: [123]}]}]})).to.equal('Baz is 123');
		expect(template('Baz is {{0.bar.0.baz.0}}', [{bar: [{baz: [123]}]}])).to.equal('Baz is 123');
		expect(template('Array traverse: ${1.2.3}', [0, [0, 0, [0, 0, 0, [123]]]])).to.equal('Array traverse: 123');
	});

	it('should render inline JavaScript', ()=> {
		expect(template('Random ${Math.floor(100 * Math.random())}%')).to.match(/^Random (\d+)%$/);
		expect(template('Epoch time is ${new Date().getTime()}')).to.match(/^Epoch time is (\d+)$/);
		expect(template('Epoch time is {{new Date().getTime()}}')).to.match(/^Epoch time is (\d+)$/);
	});

});

describe('template.compile()', ()=> {

	it('should compile and run a template', ()=> {
		var compiled = template.compile('Hello ${name}');
		expect(compiled({name: 'Matt'})).to.equal('Hello Matt');
		expect(compiled({name: 'Joe'})).to.equal('Hello Joe');
	});

});
