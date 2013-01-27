axn.add('something', function(args){

	this.innerHTML = args.content;
});

axn.add('otherthing', function(args){

	this.innerHTML = args.x;
});

axn.add('jtothep', function(data){

	var tweets = "";
	for(var i = 0; i < data.length; i += 1){

		tweets += "<li>" + data[i].text + "</li>";
	}
	
	this.innerHTML += tweets;
});