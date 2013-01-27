axn.add('something', function(args){

	this.innerHTML = args.content;
});

axn.add('otherthing', function(args){

	this.innerHTML = args.x;
});

axn.add('jtothep', function(data){

	for(var i = 0; i < data.length; i += 1){

		console.log(data[i].text);
	}
});