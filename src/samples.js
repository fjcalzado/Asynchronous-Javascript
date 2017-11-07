/**
 * CALLBACKS
 */

// Anonymous.
setTimeout(function() {
  console.log("I am a delayed Hello World!");
}, 1000);

// Named.
const myCallback = () => console.log("I am a delayed Hello World!");
setTimeout(myCallback, 1000);

// Execution order.
setTimeout(function() {
  console.log("Expected to be logged immediately");
}, 0);
console.log("Surprise!");

// Callback hell.
setTimeout(function() {
  console.log("Stage 1 Completed");
  setTimeout(function() {
    console.log("Stage 2 Completed");
    setTimeout(function() {
      console.log("Stage 3 Completed");
      setTimeout(function() {
        console.log("Stage 4 Completed");
        // This can continue forever.
      }, 4000);
    }, 3000);
  }, 2000);
}, 1000);


/**
 * PROMISES
 */

// Consuming a promise. Long.
const currentURL = document.URL.toString();
const promise = fetch(currentURL);
promise.then(result => console.log(result),
  e => console.log(`Error catched:  ${e}`));

// Consuming a promise. Short.
fetch(document.URL.toString())
  .then(result => console.log(result),
    e => console.log(`Error catched:  ${e}`));

// Consuming a promise. Chained.
fetch(document.URL.toString())
  .then(result => {
    console.log(result);
    return "First Then";
  },
    e => console.log(`Error catched:  ${e}`))
  .then(result => console.log(`Second Then after ${result}: Webpage already logged`),
    e => console.log(`Error catched:  ${e}`));

// Consuming a promise. Short but more readable.
fetch(document.URL.toString())
  .then(result => console.log(result))
  .then(() => console.log(`Fetch completed and webpage logged`))
  .catch(e => console.log(`Error catched:  ${e}`));


// Creating a promise.


// Creating a promise. Asynchronous API wrapping.
const delay = time => new Promise(resolveCallback => setTimeout(resolveCallback, time));

delay(3000)
  .then(() => console.log(`This is a delay of at least 3 seconds`))
  .catch(() => console.log(`Delay failed`));
