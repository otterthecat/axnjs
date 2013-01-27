var axn = (function(){

	var defaults = {

		data_name: "axn",
		root_selector: null,
		jsonp_callback: 'callback',
		dom_ready_callback: function(){}
	};

	// update defaults with any settings from user
	var update_defaults = function(config_obj){
		if(typeof config_obj === 'object'){

			for(var item in config_obj) {

				defaults[item] = config_obj[item];
			}
		}
	};

	// regex to help parse param attribute
	// TODO - refactor this regex to trim off leading/trailing
	//        whitespace from param value
	var param_reg_ex = /[a-zA-Z0-9-_.\/\?=\!]+/g;

	// object to contain user defined functions
	var fn = {};

	// object to hold actions defined in data attributes
	var actions = {};

	// object to be returned
	var axn = new Function();

	// initializer object that's to be called
	// just before closure returns the 'axn' object
	var init = function(){

		if(document.readyState == 'complete'){

			// get all actions
			find_actions(defaults.root_selector);

			// fire action functions on page/dom load
			apply_actions();
			return;
		}

		document.onreadystatechange = function(){

			if(document.readyState == 'complete'){

				// get all actions
				find_actions(defaults.root_selector);

				// fire action functions on page/dom load
				apply_actions();
			}
		};
	};

	var execute_fn = function(action, func){

		// TODO - better handle checks for JSONP
		// (I just wanted to get the feature in fast)
		if(action.evt){

				action.element.addEventListener(action.evt, function(event){

					event.preventDefault();

					if(!action.jsonp){
						func.call(action.element, action.params);
					} else{
					
						do_jsonp(action, func);	
					};
						
				}, false);
		} else {

			if(!action.jsonp){
			
				func.call(action.element, action.params);
			} else {

				do_jsonp(action, func);
			}
		}

	};

	// waits for DOM to be fully loaded before looping through actions object
	// to get properties via namespace, and maps it out to the 'fn' object
	var apply_actions = function(){

		for(var item in actions){

			if(fn.hasOwnProperty(item)){

				var the_func = fn[item];

				for(var i = 0; i < actions[item].length; i += 1){

					execute_fn(actions[item][i], fn[item]);
				}
			}
		}
	};


	// grab defined actions from page DOM via
	// the set data attributes in the html/view
	var find_actions = function(selector){

		var all_elements;

		if(typeof selector === 'string'){

			switch(selector.substr(0, 1)){

				case "#":
					all_elements = [document.getElementById(selector)];
					break;

				case ".":

					all_elements = document.getElementsByClassName(selector);
					break;

				default: 

					all_elements = document.getElementsByTagName(selector);
					break;
			}

		} else {

			all_elements = document.getElementsByTagName("*");
		}

		return parse_data_elements(all_elements);
	};

	// goes through an array of elements and updates the 'actions' object with
	// arrays of objects containing an individual element and parameter object
	// for use when the 'fn' object is finally required.
	var parse_data_elements = function(el_array){

		for(var i = 0; i < el_array.length; i += 1){

			if(el_array[i].hasAttribute('data-' + defaults.data_name)){

				var el = el_array[i];
				var el_action = el.getAttribute('data-' + defaults.data_name);

				if(!actions.hasOwnProperty(el_action)){

					actions[el_action] = new Array();
				};

				actions[el_action].push({
					name: el_action,
					params: parse_params(el),
					evt: parse_attr(el, 'event'),
					element: el,
					jsonp: parse_attr(el, 'jsonp')
				});
			}
		}

	};


	// takes an array of elements and looks for the params data attribute
	// and then converts the string value to a proper javascript object
	var parse_params = function(element_obj){

		var the_params = {};

		var str_value = element_obj.getAttribute('data-' + defaults.data_name + '-params'); 

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

	// get defined data attribute from an element
	var parse_attr = function(element_obj, attr){

		var str_value = element_obj.getAttribute('data-' + defaults.data_name + '-' + attr);

		return str_value || null;
	};


	var do_jsonp = function(action, callback){

		var new_script = document.createElement('script');
		new_script.src =  action.jsonp + '&' + defaults.jsonp_callback + '=' + action.name;

		window[action.name] = function(data){

			callback.call(action.element, data, action.params);

			// after the jsonp callback is complete,
			// remove it from the global namespace
			delete window[action.name];
		};

		document.getElementsByTagName('body')[0].appendChild(new_script);
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
			return this;
		},

		configure: function(options_obj){

			if(typeof options_obj === 'object'){
				
				update_defaults(options_obj);
			} else {

				console.error("AXN.config() requires object literal");
			};

			return this;
		},

		// the methods below are all primarily intended for
		// debugging purposes, but may have applications
		// under certain situations. 
		getActions: function(property_str){

			return actions.hasOwnProperty(property_str) ? actions[property_str] : actions;
		},

		getFunctions: function(name_str){

			return fn.hasOwnProperty(name_str) ? fn[name_str] : fn;
		},

		getConfig: function(){

			return defaults;
		},

		exec: function(){

			apply_actions();
		}
	};

	// initialize to set actions/params
	init();

	// return new axn
	return new axn();
})();