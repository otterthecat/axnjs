(function(){

  var _version = "0.02";

  var _defaults = {

    data_name: "axn",
    root_selector: null,
    jsonp_callback: 'callback',
    dom_ready_callback: function(){}
  };

  var Axn_Prop = function(){

    this.name = "",
    this.params = "",
    this.evt = "",
    this.element = {},
    this.jsonp = "",
    this.bindings = [];
  };

  Axn_Prop.prototype = {

    setValues: function(obj){

        this.name = obj.name;
        this.params = obj.params;
        this.evt = obj.evt;
        this.element = obj.element;
        this.jsonp = obj.jsonp;
        this.bindings = obj.bindings;
    }
  };

  var _ajaxify = function(obj){

    if(obj.hasOwnProperty("ajax")){

        return obj;
    }


    var _ajax = {};

    if (window.XMLHttpRequest) {

      _ajax = new XMLHttpRequest();
    } else if (window.ActiveXObject) {

      _ajax = new window.ActiveXObject("Microsoft.XMLHTTP");
    }

    if(obj.hasOwnProperty("prototype")){

      obj.prototype.ajax = _ajax;
    } else {

      obj.ajax = _ajax;
    }

    return obj;
  };

  // regex to help parse param attribute
  // TODO - refactor this regex to trim off leading/trailing
  // whitespace from param value
  var _param_regex = /:?[a-zA-Z0-9\-_.\/\?=\!\&]+/g;

  // regex to grab action name for binding
  // not global as we just want the first match
  var _action_name_regex = /[a-zA-Z\-_]+/;

  // object to contain user defined functions
  var _fn = {};

  // object to hold actions defined in data attributes
  var _actions = {};

  var _stored_data = {};

  var _bind_target = {};

  // utility to merge object properties
  var _merge = function(orig_obj, new_obj){

    if(typeof orig_obj === 'object' && typeof new_obj === 'object'){

      for(var item in orig_obj) {

        orig_obj[item] = new_obj[item];
      }

      return orig_obj;
    }

    return false;
  };

  // initializer object that's to be called
  // just before closure returns the 'axn' object
  var _init = function(callback){

    document.onreadystatechange = function(){

      if(document.readyState === 'complete'){

        // get all _actions
        _find_actions(_defaults.root_selector);

        if(typeof callback === 'function'){
          callback();
        }

        // fire action functions on page/dom load
        _apply_actions();
      }
    };
  };

  var _execute_fn = function(action, func){

      // TODO - better handle checks for JSONP
      // (I just wanted to get the feature in fast)
      if(action.evt){

        action.element.addEventListener(action.evt, function(event){

          if(!action.jsonp){

            // TODO - event argument should probably be listed first
            func.call(action.element, action.params, event);

            if(action.bindings.length > 0){

                _update_bindings(action.bindings[0][0].name, action.params);
            }
          } else{

            _do_jsonp(action, func);
          }

        }, false);
      } else {

        if(!action.jsonp){

          func.call(action.element, action.params);
          if(action.bindings.length > 0){

            _update_bindings(action.bindings[0][0].name, action.params);
          }
        } else {

          _do_jsonp(action, func);
        }
      }
  };

  var _update_bindings = function(namespace, data, live){

    var do_live = typeof live === 'boolean' && live === true;

    var all_actions = _actions[namespace];
    for(var i = 0; i < all_actions.length; i += 1){

      _merge(_actions[namespace][i].params, data);

      if(typeof _actions[namespace][i].jsonp === "string" && do_live){

        _do_jsonp(_actions[namespace][i], _fn[namespace]);
      } else if(do_live){

        _fn[namespace].call(_actions[namespace][i].element, _actions[namespace][i].params);
      }
    }
  };

  // waits for DOM to be fully loaded before looping through _actions object
  // to get properties via namespace, and maps it out to the '_fn' object
  var _apply_actions = function(){

    for(var item in _actions){

      if(_fn.hasOwnProperty(item)){

        for(var i = 0; i < _actions[item].length; i += 1){

          _execute_fn(_actions[item][i], _fn[item], _actions[item][i].bindings);
        }
      }
    }
  };


  // grab defined _actions from page DOM via
  // the set data attributes in the html/view
  var _find_actions = function(selector){

      var all_elements;

      if(typeof selector === 'string'){

        all_elements = document.querySelectorAll(selector);
      } else {

        all_elements = document.querySelectorAll("*");
      }

      return _parse_data_elements(all_elements);
  };

  // goes through an array of elements and updates the '_actions' object with
  // arrays of objects containing an individual element and parameter object
  // for use when the '_fn' object is finally required.
  var _parse_data_elements = function(el_array){

    for(var i = 0; i < el_array.length; i += 1){

      if(el_array[i].hasAttribute('data-' + _defaults.data_name)){

        var el = el_array[i];
        var el_action = el.getAttribute('data-' + _defaults.data_name);

        if(!_actions.hasOwnProperty(el_action)){

          _actions[el_action] = [];
        }

        var ap = new Axn_Prop();
        ap.setValues({
          name: el_action,
          params: _parse_params(el),
          evt: _parse_attr(el, 'event'),
          element: _ajaxify(el),
          jsonp: _parse_attr(el, 'jsonp'),
          bindings: []
        });

        _actions[el_action].push(ap);
      }
    }

    return _actions;
  };


  // takes an array of elements and looks for the params data attribute
  // and then converts the string value to a proper javascript object
  var _parse_params = function(element_obj){

    var the_params = {};

    var str_value = element_obj.getAttribute('data-' + _defaults.data_name + '-params'); 

    if(typeof str_value === "string"){

      var name_value_array = str_value.split(",");

      for(var i = 0; i < name_value_array.length; i += 1){

        var param_array = name_value_array[i].match(_param_regex);

        // take first element of array to use as property name
        var property_name = param_array.shift();

        // set property value as string delimited by a single space
        // TODO - refactor regular expression so as to not require the join below
        the_params[property_name] = param_array.join(" ");
      }
    }

    _stored_data[element_obj.getAttribute('data-' + _defaults.data_name)] = the_params;
    return the_params;
  };

  // get defined data attribute from an element
  var _parse_attr = function(element_obj, attr){

    var str_value = element_obj.getAttribute('data-' + _defaults.data_name + '-' + attr);

    return str_value || null;
  };


  var _do_jsonp = function(action, callback){

    var new_script = document.createElement('script');
    new_script.src =  action.jsonp + '&' + _defaults.jsonp_callback + '=' + action.name;

    window[action.name] = function(data){

      callback.call(action.element, data, action.params);

      // after the jsonp callback is complete,
      // remove it from the global namespace
      delete window[action.name];
    };

    document.getElementsByTagName('body')[0].appendChild(new_script);
  };


  // add a property to the '_fn' object defined by namespace, and
  // give it the value of the 2nd argument (a function)
  var _add_fn = function(namespace, func){

    if(_fn.hasOwnProperty(namespace)){

      window.console.error("AXN _fn object already has property ["+ namespace +"]");
      return false;
    }

    _fn[namespace] = func;
  };

  var _add_binding = function(namespace, target){

    for(var i = 0; i < target.length; i += 1){

      _actions[namespace][0].bindings.push(target);
    }

    _bind_target = {};
  };

  // object to be returned
  var AXN = function(){};

  // attach methods to axn's prototype object
  AXN.prototype = {

    version: _version,

    add: function(namespace, func){

      _add_fn(namespace, func);
      return this;
    },

    bind: function(namespace){

      if(typeof namespace !== 'string'){

        return false;
      }

      // get name and params from string
      var bind_name = namespace.match(_action_name_regex);

      _bind_target = this.getActions(bind_name);

      return this;
    },

    to: function(namespace, func){

      _add_fn(namespace, func);
      _add_binding(namespace, _bind_target);
    },

    ready: function(callback){

      _init(callback);
    },

    configure: function(options_obj){

      if(typeof options_obj === 'object'){

        _merge(_defaults, options_obj);
      } else {

          window.console.error("AXN.config() requires object literal");
      }

      return this;
    },

    // the methods below are all primarily intended for
    // debugging purposes, but may have applications
    // under certain situations. 
    getActions: function(property_str){

      return _actions.hasOwnProperty(property_str) ? _actions[property_str] : _actions;
    },

    getFunctions: function(name_str){

      return _fn.hasOwnProperty(name_str) ? _fn[name_str] : _fn;
    },

    getStoredData: function(name_str){

      return _stored_data.hasOwnProperty(name_str) ? _stored_data[name_str] : _stored_data;
    },

    getConfig: function(){

      return _defaults;
    },

    exec: function(){

      _apply_actions();
    }
  };

  // return new axn
  return window.axn = new AXN();
})();