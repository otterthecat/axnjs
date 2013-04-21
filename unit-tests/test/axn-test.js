test('AXN Methods - .getActions()', function(){

	deepEqual(typeof axn.getActions(), 'object', '.getActions() returns an object');
});

test('AXN Methods - .getFunctions()', function(){

	deepEqual(typeof axn.getFunctions(), 'object', '.getFunctions() returns an object');
});

test('AXN Methods - .getConfig()', function(){

	deepEqual(typeof axn.getConfig(), 'object', '.getConfig() returns an object');
});

test('AXN Methods - .configure()', function(){

	axn.configure({
		root_selector: 'body'
	});

	deepEqual(axn.getConfig().root_selector, 'body', '.configure() properly adds user settings');

});

test('AXN Methods - .add()', function(){

	var test_var = false
	axn.add('unit-test', function(){

		test_var =  "added unit-test";
	}).exec();

	deepEqual(typeof axn.getFunctions('unit-test'), 'function', '.add() successfully added function');
});