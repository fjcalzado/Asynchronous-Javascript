/**
 * CALLBACKS
 */

// Anonymous.
setTimeout(function(){
  console.log("I am a delayed Hello World!");
}, 1000);

// Named.
const myCallback = () => console.log("I am a delayed Hello World!");
setTimeout(myCallback, 1000);