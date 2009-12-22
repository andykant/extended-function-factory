[Extended Function Factory](http://github.com/andykant/extended-function-factory)
===========================

About
-----
* JavaScript library that converts functions to an extended functions.
* Allows preprocessor/postprocessor functions to be attached to a function in order to increase its abilities.

Information
-----------
* Copyright:  Copyright (c) 2006-2009 Andy Kant, http://andykant.com/
* Website:    http://github.com/andykant/extended-function-factory
* License:    MIT-style license
* Version:    0.3

Usage
-----
### Extending a function
	var someFunction = function() { ... };
	$xfn(someFunction);
	
### Extending all functions in an object
	var someClass = function() { ... };
	someClass.prototype = { ... };
	$xfn.extend(someClass.prototype);
	
### Adding a preprocessor
	someFunction.pre.add(function(result) {
		// Do something.
		arguments[0] = result + '';
		
		// Always return the resulting arguments object to continue normally.
		return arguments;
	});
	
### Adding a postprocessor
	someFunction.post.add(function(result) {
		// Process the arguments.
		result = result * 10;
		
		// Always return the resulting arguments object to continue normally.
		return arguments;
	});
