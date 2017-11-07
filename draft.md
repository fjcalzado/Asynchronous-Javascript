```
ESTRUCTURA

GENERAL

1) Mecanismos de asincronia a bajo nivel. Single-Thread (ST). Multi-Thread (MT). Escenarios Sync ST vs Sync MT vs Async ST vs Async MT. IMPORTANTE: Síncrono/Asíncrono hace referencia 'a lo que pasa dentro del thread'. Por tanto, la erronea creencia de que asíncrono = multithread no es cierta.
2) Concurrencia vs paralelismo. Excepto Sync ST, el resto son escenarios de concurrencia. Paralelismo es un caso especifico de concurrencia que utiliza multiples threads. Habitualmente se emplea el termino paralelismo cuando se tienen multiples threads ejecutando simultáneamente subtareas de una tarea mayor (descomposición de un problema complejo en problemas más pequeños y ejecución de éstos en paralelo). 

LOW LEVEL - JAVASCRIPT

1) IMPORTANTISIMO: Ubicar el escenario de JS en single-thread asincrono. Pero con la peculiaridad que las operaciones asíncronas no conllevan carga de instrucciones en la cpu ! Hacer incapié en que hay 2 tipos de tareas: que ejecutan código en el contexto de ejecución actual, el de nuestro programa (y por tanto ocupan tiempo en CPU, CPU-Bound operations), y las que no (I/O-Bound operations, estas van en otro contexto diferente, bien un threadpool aparte o un el propio SO. Pero esto es transparente a nosotros! La clave aqui es que nuestro single-thread pide al runtime realizar una de estas operaciones, y nosotros nos desentendemos, no se bloquea nuestro single-thread. Cuando se completa, ese runtime levanta un mensaje que entra por la message que para ser procesado, cada mensaje se asocia a una funcion, normalmente un callback.). Leer Two Types of Task (http://blog.stephencleary.com/2014/04/a-tour-of-task-part-0-overview.html). ESTE CONCEPTO HACE LA ASINCRONIA DE JS UN POQUITO MÁS PECULIAR. Es un Single-Thread que entrelaza por debajo para modelar la concurrencia, pero lo que está entrelanzando son llamadas a metodos asíncronos que no tienen código de cpu que ejecutar, sino simplemente tiempo de espera (network i/o, filesystem i/o, i/o bounds operations in general).
3) JS funciona en un contexto single-threaded y posee un modelo de concurrencia basado en un loop de eventos.


HIGH LEVEL - JAVASCRIPT

1) HIGH LEVEL. Sync/Blocking vs Async vs Non-Blocking desde una perspectiva de más alto nivel. Tareas que salen fuera del flujo.
2) Typical Async Patterns and mechanism:
  - Callbacks
  - Promises
  - Async/Await
  - Observables  
  - EventEmitters (only for Node?)
  - Streams

```


# CONCURRENCY


Concurrency is much broader, general problem than parallelism

Parallelism, literally running simultaneously, at the exact same time.

These two concepts are very often confused between them. While concurrency is a much broader, general problem than parallelism, the later represents a specific case of concurrency. 

Many people still believe that concurrency implies more than one thread, this is not true. Interleaving is a common mechanism to implement concurrency in scenarios with limited resources. Think of any modern OS trying to do multitasking in the background with a single or few cores. It just slices up concurrent tasks and interleave them, so each one will run for a short time and all of them will progress in the long term.


# JAVASCRIPT 

Javascript uses an asynchronous non-blocking model, with a single-threaded event loop for its I/O interfaces. This can be summarized in the following figure:

[FIGURE WITH NUMBERED 'STEPS']

1. An I/O operation is requested. Its non-blocking nature means that returns immediately. Our program flow will not be blocked and we can keep executing tasks in the meantime.
2. A system call initializes a context change, where the real operation will hapen (e.g: wait for a delay, fetch some data, etc). The SO will take care of everything.
3. Completion of the operation will be signaled asynchronously. A notification, translated into a message, is enqueued in a list of messages pending to be processed by the Javascript runtime.
4. The event loop processes one message at a time. We must wait for our turn. More details later.
5. Once the message is processed, a previously registered function (callback) is scheduled in our execution thread. The aim of the callback is to do whatever we want to do as a response of the I/O operation (e.g.: consume the data received, confirm that an operation has been done succesfully, etc.). 


IMPORTANT: How JS implements concurrency via its event-loop model
"JavaScript execution in Node.js is single threaded, so concurrency refers to the event loop's capacity to execute JavaScript callback functions after completing other work. Any code that is expected to run in a concurrent manner must allow the event loop to continue running as non-JavaScript operations, like I/O, are occurring."



# Event loop queue vs jobs queue for promises

https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
https://github.com/nodejs/node/issues/2736
https://stackoverflow.com/questions/36870467/what-is-the-order-of-execution-in-javascript-promises
https://stackoverflow.com/questions/40880416/what-is-the-difference-between-event-loop-queue-and-job-queue
