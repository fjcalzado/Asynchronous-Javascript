![Asynchronous Javascript Header](src/png/header.png)


Asynchrony is one of the key features of Javascript. The goal of this guide is to go deeper into its building blocks and internals. By knowing how they work, you will be able to write better code and responsive apps. 

Explanations are supported by simple drawings to easily grasp concepts in a glimpse. First of all, we will review useful general ideas to better understand what's behind asynchronous programming. Then, we will move our focus to the specific Javascript model to verify how these concepts are applied. Finally, we will see the most common asynchronous patterns in Javascript through examples.



## Table of Contents

- [Concurrency & Parallelism](#concurrency--parallelism)
- [CPU-Bound vs I/O-Bound Operations](#cpu-bound-vs-io-bound-operations)
- [I/O Flavors: Blocking vs. Non-blocking & Synchronous vs. Asynchronous](#io-flavors-blocking-vs-non-blocking--synchronous-vs-asynchronous)
- [Javascript Model](#javascript-model)
  - [Javascript Event Loop](#javascript-event-loop)
  - [A quick note about Parallelism](#a-quick-note-about-parallelism)
- [Summary](#summary)




# Concurrency & Parallelism

Concurrency and parallelism are related concepts, very often confused, with important differences between them. A simple definition would be:

- `Concurrency`: two or more tasks make progress simultaneously. 
- `Parallelism`: tasks literally run at the same time, at the exact same instant.

While concurrency is a much broader, general problem than parallelism, the later represents a specific case of concurrency where true simultaneity happens.

Many people still believe that concurrency implies more than one thread, **this is not true**. Interleaving is a common mechanism to implement concurrency in scenarios with limited resources. Think of any modern OS trying to do multitasking in the background with a single or few cores. It just slices up concurrent tasks and interleave them, so each one will run for a short time and all of them will progress in the long term.

Let's illustrate this:

![Concurrency Scenarios](src/png/concurrency.png)

- **Scenario 1** is neither concurrent nor parallel. It is just a sequential execution, each task at a time. 
- **Scenarios 2**, **3** and **4** depict concurrency implemented under different techniques:
  - **Scenario 3** illustrates how concurrency can be achieved with a single thread. Portions of each task are interleaved to keep progress on both. This is possible as long as tasks can be decomposed into simpler subtasks.
  - **Scenarios 2** and **4** draw parallelism using multiple threads where tasks or subtasks run in parallel at the exact same time. While threads of **2** are sequential, interleaving is applied in **4**.




# CPU-Bound vs I/O-Bound Operations

So far we have seen tasks that consume CPU resources, they carry a workload (piece of code) to be executed in our application. These are called **CPU-bound** operations.

Programs, however, may also consist in reading data from disk, accessing an external database or fetching some data over the network. All these input/output operations trigger requests that are attended outside our program execution context. Therefore, **I/O-bound** operations do not '*run*' or '*execute*' in our application domain<sup id="sfootnote1">[1](#tfootnote1)</sup>. 

![CPU-bound vs I/O-bound](src/png/cpu_io.png)

Bound operations also implies bottleneck with the resource is bound to. Increasing CPU resources will improve CPU-bound operations performance, while a better I/O system will boost I/O-bound operations. 

By nature, CPU-bound operations are synchronous, although interleaving or parallelism can be used to achieve concurrency. One interesting fact of I/O-bound operations is that they can be asynchronous, and, asynchrony is a very useful form of concurrency as we will see in the next section.

<sup id="tfootnote1">[1](#sfootnote1)</sup> *How and where these operations take place is out of the scope of this guide. They are enabled through APIs implemented in the browsers, and in last instance, the OS itself*.




# I/O Flavors: Blocking vs. Non-blocking & Synchronous vs. Asynchronous

This terms are not always applied consistently by every author and it depends on the context. Many times, they are used as synonyms or mixed up to refer to the same thing.

A possible classification in the context of I/O would be better understood if we imagine I/O operations comprising two phases: 
1. **Wait** for the device to be ready, I/O operation to be completed or the data to be available and then
2. **Execute** the response itself, whatever is intended to do as a response or with the received data.

Blocking vs Non-Blocking refers to how waiting time affects to our main program:

- `Blocking`: A blocking call does not return control to the application until is completed. Thread is locked by putting it to wait state.
- `Non-Blocking`: A non-blocking call returns immediately with whatever result it has. In case it could be completed, it will return the desired data. Otherwise, if the operation could not be immediately satisfied, it will provide an error code indicating something like '*Temporarily unavailable*', '*I am not ready*' or '*I will block. Please, postpone the call*'. It is implied that some sort of polling is done to complete the job or to place a new request in a better moment.

![Blocking vs Non Blocking](src/png/blocking_non_blocking.png)

While synchronous vs asynchronous determine when does our response take place:

- `Synchronous`: blocking and synchronous are used as synonyms many times, meaning that the whole I/O operation is executed sequentially and therefore we must wait for it to complete to process the result.
- `Asynchronous`: the completion of the operation is later signaled using a specific mechanism such as a registered callback, promise or event (they will be explained later) which make possible to defer the processing of the response. Also, this is non-blocking by nature, as the I/O call returns immediately.

![Synchronous vs Asynchronous](src/png/sync_async.png)


Combining these flavors, we can classify I/O operations:

- `Synchronous` `Blocking` I/O. The whole operation is done in one shot blocking the execution flow:
  - The thread is blocked while waiting.
  - The response is processed immediately afterwards. 
- `Synchronous` `Non-Blocking` I/O. Similar to the previous one but using any polling technique to avoid blocking in the first stage:
  - Calls returns immediately, thread not blocked. A *try later* approach may be needed.
  - The response is processed immediately when received.
- `Asynchronous` `Non-Blocking` I/O: 
  - I/O request returns immediately to avoid blocking.
  - A notification is sent once the operatino is completed. Then, a function to process the response (callback) is scheduled to be run at some point in our execution flow.




# Javascript Model

Javascript is aimed to run on browsers, dealing with network requests and user interactions at the same time, while trying to keep UI responsive. Therefore, Javascript has been intentionally evolved to be good for I/O-bound workloads. For that reason:

> **Javascript** uses an **asynchronous non-blocking model**, with a **single-threaded event loop** for its I/O interfaces.

This approach makes Javascript highly concurrent with just one thread. We already know what **asynchronous** and **non-blocking** mean but, what does *event loop* stand for? This mechanism will be explained in detail within the next chapter. First of all, let's review with all the notions learned so far, what a typical asynchronous request in Javascript looks like:

![Javascript asynchronous call](src/png/async_call.png)

Step by step, an asynchronous I/O call can be summarized as:

![Javascript asynchronous call steps](src/png/async_call_steps.png)


## Javascript Event Loop

What happens when we run a Javascript program? How responses to asynchronous calls are treated concurrently within our program? That is exactly what the event loop model<sup id="sfootnote2">[2](#tfootnote2)</sup> answers:

![Event Loop Model](src/png/event_loop_model.png)

+ ### Call Stack 
  It basically keeps track of where in the programm we are. Each function call enters the stack as a frame, reserving a block of memory for its arguments and local variables. If we step into a function, a new frame is put on top of the stack. If we return from a function, its frame is popped out from the top (LIFO, last in first out). This way, inner calls are stacked on top of its parent. The stack on the top will be attended first.
+ ### Heap
  Large unestructured memory region to dynamically allocate objects. It is shared by whole program and a *garbage collector* will make sure to free what is not used anymore. 
+ ### Queue
  Whenever an external context notify an event to our application (like in the case of asynchronous operations), it is pushed to a list of messages pending to be executed, together with its corresponding callback. A callback is just a function to be executed as a response of an event.
+ ### Event Loop
  When the call stack is emtpy, the next message in the queue is processed. The processing consists of calling the associated callback and thus creating an initial frame in the call stack. This initial frame may lead to subsequents frames and the message processing ends when the stack becomes empty again.


So, while the queue is the storage of external notifications and its callbacks, the event loop is the mechanism to dispatch them. This mechanism follows a synchronous fashion: each message is processed completely before any other message is processed. Callbacks will not be fired as soon as notified, they must wait in the queue for their turn. This waiting time will depend on the number of pending messages as well as the processing time for each one.

Therefore, as we can imagine, the problem with the event loop is that if we keep pushing multiple messages to the queue and the call stack takes too long to finish running, we will end up delaying all the execution flow. On browsers, this means delaying renders and making the whole page seem slow.


<sup id="tfootnote2">[2](#sfootnote2)</sup> *What has been explained here is the theoretical model. Real implementation in Javascript engines and browsers may be heavily optimized*.

## A quick note about Parallelism

Eventhough Javascript has been designed with I/O in mind, it runs CPU intensive tasks as well. However, they can cause trouble if not handled correctly. Any processing intensive task may end up blocking our whole code execution, as explained in the event loop section. 

Many efforts have been lately made to solve this issue. As a result, [WebWorkers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) and [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) were recently introduced to implement parallelism. CPU intensive applications will benefit from these features by enabling heavy operations to be computed in the background, in different threads.






# Summary
- Concurrency makes tasks to progress simultaneously. Parallelism is a special case of concurrency where tasks execute literally at the same time.
- These tasks can be CPU intensive. They are called CPU-bound operations and carry code to be run in our application. I/O-bound operations, on the other hand, do not execute in our programm flow but in an external context. They are intended to access devices or resources as servers, databases, files, etc. 
- I/O-bound operations can be blocking or non-blocking, depending on whether the thread is locked or not, and synchronous or asynchronous, in case the execution is sequential or the response comes at some point in the future.
- Javascript is intended for web applications with I/O-bound operations in mind. It uses an asynchronous non-blocking model with a single-threaded event loop.
- Event loop model allows to dispatch asynchronous notifications concurrently, but also can be exhausted and make application performance decrease if not understood correctly.
- Parallelism is slowly starting to appear in Javascript.
