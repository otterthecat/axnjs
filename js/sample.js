// AXN.JS
// sample usages
var axn = new window.AXN();
axn.ready(function(){

  // action 'something' is set for 2 different
  // elements in index.html - each with different events
  axn.add('something', function(args){

    this.innerHTML = args.content;
  });

  // action 'otherthing' will be uploaded immmediately
  // after dom is loaded
  axn.add('otherthing', function(args){

    this.innerHTML = args.x;
  });

  // action 'something-editor' is a text field
  // that will update paramters for the actions
  // bound to 'something' above
  axn.bind('something:content').to('something-editor', function(args){

    // update data params for elements bound
    //  to the 'something' action
    args.content = this.value;
  });

  // action 'jtothep' will, after the defined event,
  // make a JSONP call, with the callback defined below
  axn.add('jtothep', function(data){

    var ddgResults = "";
    for(var i = 0; i < data.RelatedTopics.length; i += 1){

      ddgResults += "<li>" + data.RelatedTopics[i].Text + "</li>";
    }

    this.innerHTML += ddgResults;
  });
});