test('AXN Debug Methods', function(){

	equal(typeof axn.getActions(), 'object', '.getActions() returns an object');
	equal(typeof axn.getFunctions(), 'object', '.getFunctions() returns an object');
	equal(typeof axn.getConfig(), 'object', '.getConfig() returns an object');
});

test('AXN Unit Tests', function(){

	axn.configure({
		root_selector: 'body'
	});

	equal(axn.getConfig().root_selector, 'body', '.configure() properly adds user settings');

	axn.add('unit-test', function(){


	});	

	equal(typeof axn.getActions('unit-test'), 'object', '.add() properly add new action');

	equal(typeof axn.getFunctions('unit-test'), 'function', '.add() properly add new function');

});