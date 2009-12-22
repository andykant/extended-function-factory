/*
Extended Function Factory
-------------------------
Copyright:  Copyright (c) 2006-2009 Andy Kant, http://andykant.com/
Website:    http://github.com/andykant/extended-function-factory
License:    MIT-style license
Version:    0.3
-------------------------
About:
	JavaScript library that converts functions to an extended functions.
	Allows preprocessor/postprocessor functions to be attached to a function in order to increase its abilities.
Arguments:
	fn          - (function) The function to extend.
Returns:
	(function)  - An extended function object.
Public Methods:
	$xfn.extend - Converts every function property in an object to an extended function.
	<CALL>      - Calls processors before/after calling the original function.
	pre.add     - (function fn, <OPTIONAL> number priority) Add a preprocessor.
	pre.remove  - (function fn) Remove a preprocessor.
	post.add    - (function fn, <OPTIONAL> number priority) Add a postprocessor.
	post.remove - (function fn) Remove a postprocessor.
*/
$xfn = function(fn) {
	if (typeof fn != 'function') {
		return fn;
	}
	
	// Define functionality.
	var _pre = [];
	var _post = [];
	var _search = function(left, right, priority, proc) {
		if (right < left) {
			return left;
		}
		var index = Math.floor((left + right) / 2);
		if (priority < proc[index][1]) {
			return _search(index + 1, right, priority, proc);
		} else if (priority > proc[index][1]) {
			return _search(left, index - 1, priority, proc);
		} else {
			while (index < proc.length && priority == proc[index][1]) {
				index++;
			};
			return index;
		}
	};
	var _add = function(proc) {
		return function(fn, priority) {
			priority = priority || 0;
			var idx = _search(0, proc.length - 1, priority, proc);
			for (var i = proc.length; i > idx; i--) {
				proc[i] = proc[i-1];
			}
			proc[idx] = [fn, priority];
		};
	};
	var _remove = function(proc) {
		return function(fn) {
			for (var i = 0; i < proc.length; i++) {
				if (proc[i][0] == fn) {
					proc.splice(i,1);
				}
			}
		};
	};
	
	// Return extended function.
	var func = function() {
		for (var i = 0; i < _pre.length; i++) {
			arguments = _pre[i][0].apply(this, arguments);
			if (typeof arguments == 'undefined') return undefined;
		}
		var result = fn.apply(this, arguments);
		for (var i = 0; i < _post.length; i++) {
			result = _post[i][0].call(this, result);
			if (typeof result == 'undefined') return undefined;
		}
		return result;
	};
	func.pre = {
		add: _add(_pre),
		remove: _remove(_pre)
	};
	func.post = {
		add: _add(_post),
		remove: _remove(_post)
	};
	return func;
};
// Extend an entire object.
$xfn.extend = function(obj) {
	for (var prop in obj) {
		if (typeof obj[prop] == 'function') {
			obj[prop] = $xfn(obj[prop]);
		}
	}
};
// Set the revision number.
$xfn.revision = 3;
