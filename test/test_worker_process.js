/**
 * Function.prototype.toString() returns the function as string, however Sinon.JS overwrites 
 *      `Function.prototype.toString()` and returns function name when a stubbed function's toString() 
 *      method is called (in this case, it just returns 'spy'). Hence, the function arguments or 
 *      body can't be retrieved in worker_process.js and it can't be tested with Sinon.JS. 
 *      It is briefly mentioned here: http://stackoverflow.com/questions/34805203/sinon-stub-body-code
 *  
 * This behaviour breaks Priority, Retries and Timout tests; although Worker tests does succeed.
 *
 * A possible solution can be overwriting Sinon.JS's Function.prototype.toString() code
 *      to make it return the fuction as a string, however it might break other parts
 *      if/where Sinon.JS expects 'spy' as function string.
 */