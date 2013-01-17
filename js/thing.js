var AXN = (function(opt){

	// defalut settings prior to user input
	var defaults = {

		data_suffix: "axn"
	};

	// regex to help parse param attribute
	// TODO - refactor this regex to trim off leading/trailing
	//        whitespace from param value
	var param_reg_ex = /[a-zA-Z0-9-_.\/\?=]+/g;

	// object to contain user defined functions
	var fn = {};

	// object to hold actions defined in data attributes
	var actions = {};

	// object to be returned
	var axn = function(){};

	// initializer object that's to be called
	// just before closure returns the 'axn' object
	var init = function(){

		// get all actions
		find_actions();

		// fire action functions on page/dom load
		apply_actions();
	};

	var execute_fn = function(action, func){

		if(action.evt){

			action.element.addEventListener(action.evt, function(event){

				event.preventDefault();
				func.call(action.element, action.params);	
			}, false)

		} else {

			func.call(action.element, action.params);
		}

	};

	// waits for DOM to be fully loaded before looping through actions object
	// to get properties via namespace, and maps it out to the 'fn' object
	var apply_actions = function(){

		// TODO - some legacy IE issues with DOMContentLoaded,
		// 		  but I just wanted to get a first version out
		document.addEventListener("DOMContentLoaded", function() {

			for(item in actions){

				if(fn.hasOwnProperty(item)){

					var the_func = fn[item];

					for(var i = 0; i < actions[item].length; i += 1){

						execute_fn(actions[item][i], fn[item]);
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

					console.error("AXN - selector used to find data actions is not valid");
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
		console.log("pfft");
		for(var i = 0; i < el_array.length; i += 1){
			console.log('+++ data-'+defaults.data_suffix);
			if(el_array[i].hasAttribute('data-' + defaults.data_suffix)){

				var el = el_array[i];
				var el_action = el.getAttribute('data-' + defaults.data_suffix);
				console.log(el_action);
				if(!actions.hasOwnProperty(el_action)){

					actions[el_action] = new Array();
				};

				actions[el_action].push({
					params: parse_params(el),
					evt: parse_event(el),
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

				// take first element of array to use as property name
				var property_name = param_array.shift();

				// set property value as string delimited by a single space
				// TODO - refactor regular expression so as to not require the join below
				the_params[property_name] = param_array.join(" ");
			}
		}

		return the_params;
	};

	// get defined event from element (optional)
	var parse_event = function(element_obj){

		var the_event = "";

		var str_value = element_obj.getAttribute('data-' + defaults.data_suffix + '-event'); 

		return str_value || null;
	};

	// add a property to the 'fn' object defined by namespace, and
	// give it the value of the 2nd argument (a function)
	var add_fn = function(namespace, func){

		if(fn.hasOwnProperty(namespace)){

			console.error("AXN fn object already has property ["+ namespace +"]");
			return false;
		}

		fn[namespace] = func;
	};


	// attach methods to axn's prototype object
	axn.prototype = {

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

	// return new axn
	return new axn();
});

var axn = new AXN();