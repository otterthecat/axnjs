var THING = (function(opt){

	// defalut settings prior to user input
	var defaults = {

		data_suffix: "thing"
	};

	// regex to help parse param attribute
	var param_reg_ex = /[a-zA-Z0-9-_.\/\?=]+/g;

	// object to contain user defined functions
	var fn = {};

	// object to hold actions defined in data attributes
	var actions = {};

	// object to be returned
	var thing = function(){};

	// initializer object that's to be called
	// just before closure returns the 'thing' object
	var init = function(){

		// get all actions
		find_actions();

		// fire action functions on page/dom load
		apply_actions();
	};


	// waits for DOM to be fully loaded before looping through actions object
	// to get properties via namespace, and maps it out to the 'fn' object
	var apply_actions = function(){

		// TODO - some legacy IE issues with DOMContentLoaded
		document.addEventListener("DOMContentLoaded", function() {

			for(item in actions){

				if(fn.hasOwnProperty(item)){
					var the_func = fn[item];

					for(var i = 0; i < actions[item].length; i += 1){

						the_func.call(actions[item][i].element, actions[item][i].params);
					}
				}
			}
		}, false);
	};


	// grab defined actions from page DOM via
	// the set data attributes in the html/view
	var find_actions = function(selector_str){

		var all_elements;

		if(typeof selector_str === 'string'){

			switch(selector_str.substr(0, 1)){

				case "#":
					all_elements = [document.getElementById(selector_str)];
					break;

				case ".":

					all_elements = document.getElementsByClassName(selector_str);
					break;

				default: 

					console.error("THING - selector used to find data actions is not valid");
					break;
			}

		} else {

			all_elements = document.getElementsByTagName('*');
		}

		return parse_data_elements(all_elements);
	};

	// goes through an array of elements and updates the 'actions' object with
	// arrays of objects containing an individual element and parameter object
	// for use when the 'fn' object is finally required.
	var parse_data_elements = function(el_array){

		for(var i = 0; i < el_array.length; i += 1){

			if(el_array[i].hasAttribute('data-' + defaults.data_suffix + '-action')){

				var el = el_array[i];
				var el_action = el.getAttribute('data-' + defaults.data_suffix + '-action');

				if(!actions.hasOwnProperty(el_action)){

					actions[el_action] = new Array();
				};

				actions[el_action].push({
					params: parse_params(el),
					element: el
				});
			}
		}

	};


	// takes an array of elements and looks for the params data attribute
	// and then converts the string value to a proper javascript object
	var parse_params = function(element_obj){

		var the_params = {};

		var str_value = element_obj.getAttribute('data-' + defaults.data_suffix + '-params'); 

		if(typeof str_value === "string"){

			var name_value_array = str_value.split(",");

			for(var i = 0; i < name_value_array.length; i += 1){

				var param_array = name_value_array[i].match(param_reg_ex);

				the_params[param_array[0]] = param_array[1];
			}
		}

		return the_params;
	};

	// add a property to the 'fn' object defined by namespace, and
	// give it the value of the 2nd argument (a function)
	var add_fn = function(namespace, func){

		if(fn.hasOwnProperty(namespace)){

			console.error("THING fn object already has property ["+ namespace +"]");
			return false;
		}

		fn[namespace] = func;
	};


	// attach methods to thing's prototype object
	thing.prototype = {

		add: function(namespace, func){

			add_fn(namespace, func);
		},

		// moreso for debugging than anything else
		getActions: function(property_str){

			return actions.hasOwnProperty(property_str) ? actions[property_str] : actions;
		},

		getFunctions: function(){

			return fn;
		}
	};

	// initialize to set actions/params
	init();

	// return new thing
	return new thing();
});

var thing = new THING();