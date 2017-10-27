---------------------------------------------------------------------
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

---------------------------------------------------------------------





The goal of this guide is to visually explain asynchronous programming in Javascript, so you can grasp key concepts in a glimpse. Let's quickly review some of these concepts prior to enter into detail.


This will represent a statement, function call, line of code, instruction or whatever concept you prefer for a task to be executed. 



SYNCHRONOUS vs ASYNCHRONOUS

	- Synchronous: Code executed in sequence, one statement after the other.
	- Asynchronous: Statements can go outside of the main flow, allowing the program to progress with the next task.  

BLOCKING vs NON-BLOCKING

	- Blocking: Each statement must wait for the previous one to complete. Execution flow may be blocked by time-consuming tasks.
	- Non-Blocking:  

Differences between NON-BLOCKING vs ASYNCHRONOUS

While synchronous and blocking refers to the same thing, asynchronous and non-blocking may slightly differ depending on the context. Certainly, they are pretty similar concepts aimed towards a more efficient execution flow. However, they fall back in different mechanisms to get the job done. 

	- Non-Blocking: A non-blocking call returns immediately with whatever result it has; data, no-data, error or even a message saying 'hey, this call will block, postpone it'.  It is implied that some sort of polling must be done to get the rest of the data or just to place a new request in a better moment.
	- Asynchronous: An asynchronous call will also return immediately, but the task will keep progressing in the background and will signal its completion using a specific asynchronous mechanism as a registered callback, promise or event.

CONCURRENCY vs PARALLELISM