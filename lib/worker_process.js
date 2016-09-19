'use strict';

/**
 * Worker Process runs code	that's assigned to a lib.Worker on a seperate thread
 * The function to execute, arguments to that function, Profiler object and callback 
 *		function are passed during forking.
 * Upon receiving an arbitrary message, processing begins and result is sent back to Worker
 * If an error is encountered process terminates with code > 0 (as native Node.js behaviour)
 */

var FN_ARGS = /^[^\(]*\(\s*([^\)]*)\)/m;
var FN_BODY = /function[^{]+\{([\s\S]*)\}$/;

var fnText = process.argv[2],
	profiler = process.argv[3],
	params = JSON.parse(process.argv[4]),
	callback = process.argv[5];

process.on('message', function() {
  var fnBody = extractBody(fnText);
  var fnArgs = extractArgs(fnText);

  var fn = new Function(fnArgs, fnBody);

  fn.call(profiler, params, function(err, processResult) {
  	process.send(processResult);
  	process.exit();
  });
});

process.on('uncaughtException',function(err){
	if (process.env.DEBUG) {
		console.error(err.stack);
	}
    throw err;
})

function extractArgs(fn) {
	var fnText = fn.toString(),
		args = fnText.match(FN_ARGS);
	return args[1].split(',');
}

function extractBody(fn) {
	var fnText = fn.toString(),
		body = fnText.match(FN_BODY)[1];
	return body
}
