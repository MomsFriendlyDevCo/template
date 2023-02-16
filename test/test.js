const expect = require('chai').expect;

['browser', 'node'].map(method => {
	let template;
	describe(`${method.toUpperCase()}: template()`, ()=> {
		before('force testing intance', ()=> {
			// Hack required so that Node force reloads the required driver rather than using a defered cached version
			// This is only ever relevent for Mocha as no-one else would ever have the node + browser versions at the same time
			delete require.cache[`${__dirname}/../lib/${method}.js`];
			template = require(`${__dirname}/../lib/${method}.js`);
		});

		before('check we have loaded the right driver', ()=> {
			expect(template.defaults).to.have.property('mode', method);
		});

		it('should render simple variable replacements', ()=> {
			let data = {
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

		it('should handle null or undefined data access', ()=> {
			let data = {quz: null, flarp: undefined};
			expect(template('Foo: ${foo}', data)).to.equal(`Foo: undefined`);
			expect(template("Bar: ${bar || 'Bar!'}", data)).to.equal(`Bar: Bar!`);
			expect(template("Baz: ${foo || bar || baz || 'Baz!'}", data)).to.equal(`Baz: Baz!`);
			expect(template("Quz: ${quz || 'Quz!'}", data)).to.equal(`Quz: Quz!`);
			expect(template("Flarp: ${flarp || 'Flarp!'}", data)).to.equal(`Flarp: Flarp!`);
			expect(()=> template("Kludge: ${kludge}", data, {safeUndefined: false})).to.throw;
		});

	});

	describe(`${method.toUpperCase()}: template.compile()`, ()=> {
		before('force testing intance', ()=> {
			delete require.cache[`${__dirname}/../lib/${method}.js`];
			template = require(`${__dirname}/../lib/${method}.js`);
		});

		before('check we have loaded the right driver', ()=> {
			expect(template.defaults).to.have.property('mode', method);
		});

		it('should compile and run a template', ()=> {
			let compiled = template.compile('Hello ${name}');
			expect(compiled({name: 'Matt'})).to.equal('Hello Matt');
			expect(compiled({name: 'Joe'})).to.equal('Hello Joe');
		});

	});
});
