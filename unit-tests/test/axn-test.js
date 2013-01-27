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

asyncTest('AXN Methods - .add()', function(){

	axn.add('unit-test', function(){

		ok(true, '.add() properly exectuted applied function');
	})
	.add('jsonp_test', function(data){

		ok(true, 'JSONP callback via .add() successfully executed');
		deepEqual(typeof data, 'object', 'JSONP callback via .add() succefully recieved data');
		start();
	}).exec();
});