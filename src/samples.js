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


// Creating a promise. Squeleton.
const myAsyncFunction = () => {
  return new Promise((resolve, reject) => {

    // Do your task here (usually an async task) and then...

    if ( /* successful condition */ ) {
      resolve(`Success!`);
    } else {
      reject(`Failure!`);
    }
  });
}

// Creating a promise. Simple example.
const checkServer = (url) => {
  return new Promise((resolve, reject) => { 
    fetch(url)
      .then(response => resolve(`Server is ${response.status === 200 ? "OK" : "NOT OK"}`))
      .catch(() => reject(`Error fetching URL`));
  });
}

checkServer(document.URL.toString())
  .then(result => console.log(result))
  .catch(e => console.log(e));

// Creating a promise. Asynchronous API wrapping.
const delay = time => new Promise(resolve => setTimeout(resolve, time));

delay(3000)
  .then(() => console.log(`This is a delay of at least 3 seconds`))
  .catch(() => console.log(`Delay failed`));


// Promises timing.
// Old-style async call
setTimeout(() => console.log(`1`), 0); 

// Promise-like async call
Promise.resolve().then(() => console.log(`2`));

// 2
// 1


/**
 * ASYNC AWAIT
 */

// Creating and consuming. Simple example.
const checkServerWithSugar = async (url) => {
  const response = await fetch(url);
  return `Server is ${response.status === 200 ? "OK" : "NOT OK"}`;
}

checkServerWithSugar(document.URL.toString())
  .then(result => console.log(result));

// Creating and consuming. Simple example with error handling.
const checkServerWithSugar = async (url) => {
  try {
    const response = await fetch(url);
    return `Server is ${response.status === 200 ? "OK" : "NOT OK"}`;
  } catch (e) {
    throw e;
  }
}

checkServerWithSugar(document.URL.toString())
  .then(result => console.log(result))
  .catch(e => console.log(`Error: ${e}`));

// Stacking awaits. Synchronous.
async function wait() {
  await delay(500);
  await delay(500);
  return "At least 1 second has passed";
};

// Stacking awaits. Asynchronous.
async function wait() {
  const d1 = delay(500);
  const d2 = delay(500);
  await d1;
  await d2;
  return "At least 500 ms. has passed";
};