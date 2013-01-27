axn.js
======

AXN (pronounced "action". Yeah... it's a stretch...) is just
a quick project that has DOM elements store events & data models
which are then parsed by the 'axn' object.

Caveats
-------
The usual mumbo-jumbo: "This is still in progress, not fully tested, blah blah blah".

Also, currently AXN does not support IE versions less than 9.


Usage
-----

You set up AXN by first importing the script to your page.

Then you add data attributes to your HTML markup.

At time of this writing, there are 4 different data attributes:

	<div data-axn="do_action"></div>


The above snippet basically tells the 'div' element to listen for the 'do_action' function.
Be aware, that because object properties cannot accept names with hyphens (ie - 'do-action'),
your code will not work as expected if you set a value that also includes hyphens.

Next, you would set up your javascript, which you do like so:

	<script>

		axn.add('do_action', function(args){

			this.innerHTML = args.content;
		});
	</script>

Note that you define the new action with the same name to match the earlier data attribute we made.
We then create our function and you'll notice we're passing 'args' to this function. This argument will be explained a little further down.

Lastly, you'll note that the function is referring to 'this' to set it's innerHTML value.
When you define an element with an action (using data-axn), that element is assigned scope to the 'this'
keyword.

To give 'do_action' some parameters, you go to your element(s) and add a second data attribute:

	<div data-axn="do_action" data-axn-params="content: this is my content"></div> 

Basically, the value of data-axn-params is a string of name/values seperated by a colon (:) - similar to
a JSON object.
Since the value of this data attribute is already a string, there should be no inherent need
to have content's value encased in quotes. It'll all get sorted out internally.

Once your 'do_actions' is actually called, it will be passed a javacript object that will have the same key/values as defined in the data-axn-params attribute.

If, in the above example, you wanted to have your 'do_action' function fire on - say, the element's click event - you do so by adding another (predictable) attribute:

	<div data-axn="do_action" data-axn-event="click" data-axn-params="content: this is my content"></div>

The attribute data-axn-event will accept any string accepted by .addEventListener(), as it uses the latter to apply the method to the stated element. If no event is defined in the element, then it's action it executed on page/dom ready.

Finally, the last data attribute that is available is used for JSONP requests:

	<div data-axn="do_jsonp" data-axn-jsonp="url_to_service"></div>

The value of data-axn-jsonp should be a string to the url of which you wish to call your JSONP service.
In the above example, we gave it a new value for the data-axn attribute. To process the JSONP callback, we needo to use this new name to define a new axn function. Be sure to remember to pass your data from the service back to your function:

	<script>

		axn.add('do_jsonp', function(returned_data){


			for(var item in returned_data){

				this.innerHTML += (item + "  = " + returned_data[item] + "<br/>");
			}
		});
	</script>

That's the basics. Note that if you want to change the names of data attributes AXN will look for, you can do so with the .configure() method. So if you'd like to change your attributes to 'blah', you do so thusly:

	axn.configure({
		data_name: 'blah'
	});

and then in your html you set up your data attributes like this:

	<div data-blah="do_action" data-blah-event="click"></div>

This should be enough to get one started. Again, this is a work in progress, and I will try to update
this documentation when time permits.