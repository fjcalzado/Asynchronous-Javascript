![Asynchronous Javascript Header](src/png/header.png)


The goal of this guide is to explain asynchronous programming in Javascript with the help of clean and easy figures to grasp key concepts in a glimpse. 

First, we will review useful general ideas to better understand what's behind asynchronous programming. Then, we will move our focus to the specific Javascript scenario to verify how these concepts are applied. Finally, we will see the most common asynchronous patterns in Javascript through examples.

## Table of Contents

- [Concurrency & Parallelism](#concurrency--parallelism)
- [CPU-Bound vs I/O-Bound Operations](#cpu-bound-vs-io-bound-operations)
- [I/O Flavors: Blocking vs. Non-blocking & Synchronous vs. Asynchronous](#io-flavors-blocking-vs-non-blocking--synchronous-vs-asynchronous)
- [Javascript Model](#javascript-model)
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
- **Scenarios 2**, **3** and **4** depicts concurrency implemented under different techniques:
  - **Scenario 3** illustrates how concurrency can be achieved with a single thread. Slices of each tasks are interleaved to keep progress on both. This is possible as long as tasks can be decomposed into simpler subtasks.
  - **Scenarios 2** and **4** draw parallelism using multiple threads where tasks or subtasks run in parallel at the exact same time. While threads of **2** are sequential, interleaving is applied in **4**.

# CPU-Bound vs I/O-Bound Operations

So far we have seen tasks that consume CPU resources, they carry a workload (piece of code) to be executed in our application. These are called **CPU-bound** operations.

Programs, however, may also consist in reading data from disk, accessing an external device or fetching some data over the network. All these input/output operations trigger requests that are attended outside our program execution context. Therefore, **I/O-bound** operations do not '*run*' or '*execute*' in our application domain<sup id="sfootnote1">[1](#tfootnote1)</sup>. 

![CPU-bound vs I/O-bound](src/png/cpu_io.png)

Bound operations also implies bottleneck with the resource is bound to. Increasing CPU resources will improve CPU-bound operations performance, while a better I/O system will boost I/O-bound operations. 

By nature, CPU-bound operations are synchronous, although interleaving or parallelism can be used to achieve concurrency. One interesting fact of I/O-bound operations is that they can be asynchronous, and, asynchrony is a very useful form of concurrency as we will see in the next section.

<sup id="tfootnote1">[1](#sfootnote1)</sup> *How and where these operations take place is out of the scope of this guide*.

# I/O Flavors: Blocking vs. Non-blocking & Synchronous vs. Asynchronous

This terms are not applied consistently in every scenario and it depends on the context. Many times they are used as synonyms or mixed up to refer to the same thing.

A possible classification in the context of I/O would be better understood if we imagine I/O operations comprising two phases: **wait** for the device to be ready or the data to be available and then **execute** the operation itself, whatever is intended for: read, write, etc.

Blocking vs Non-Blocking refers to how waiting time affects to our main program:

- `Blocking`: A blocking call does not return control to the application until is completed. Thread is locked in the meantime by putting it to wait state.
- `Non-Blocking`: A non-blocking call returns immediately with whatever result it has. In case it could be completed, it will return the desired data. Otherwise, if the operation could not be immediately satisfied, it will provide an error code indicating something like '*Temporarily unavailable*', '*I am not ready*' or '*I will block. Please, postpone the call*'. It is implied that some sort of polling is done to complete the job or to place a new request in a better moment.

![Blocking vs Non Blocking](src/png/blocking_non_blocking.png)

While synchronous vs asynchronous determine when execution takes place:

- `Synchronous`: blocking and synchronous are used as synonyms many times, meaning that the whole I/O operation is executed sequentially and therefore we must wait for it to complete.
- `Asynchronous`: the completion of the operation is later signaled using a specific mechanism such as a registered callback, promise or event (they will be explained later) which make possible to defer the processing of the response. Also, this is non-blocking by nature, as the I/O call returns immediately.

![Synchronous vs Asynchronous](src/png/sync_async.png)


Combining these flavors, we can classify I/O operations by its nature:

- `Synchronous` `Blocking` I/O. The whole operation is done in one shot blocking the execution flow:
  - The thread is blocked while waiting.
  - The response is processed immediately afterwards. 
- `Synchronous` `Non-Blocking` I/O. Similar to the previous one but using any polling technique to avoid blocking in the first stage:
  - Calls returns immediately, thread not blocked. A *try later* approach may be needed.
  - The response is processed immediately when received.
- `Asynchronous` `Non-Blocking` I/O: 
  - I/O request returns immediately returns to avoid blocking.
  - A notification is sent once completed. Then, a function to process the response is scheduled to be run at some point in our execution flow.

# Javascript Model

Javascript is aimed to run on browsers, dealing with network requests and user interactions at the same time, while trying to keep UI responsive. Therefore, Javascript has been intentionally evolved to be good for I/O-bound workloads. For that reason:

> **Javascript** uses an **asynchronous non-blocking model**, with a **single-threaded event loop** for its I/O interfaces.

This approach makes Javascript highly concurrent with just one thread. Let's see, step by step, a typical asynchronous request in Javascript:







### Javascript Event Loop

### A quick note about parallelism in Javascript

Eventhough Javascript has been designed with I/O in mind, it runs CPU intensive tasks as well. However, they can cause trouble if not handled correctly. 

Many efforts have been lately made to solve this issue. As a result, [WebWorkers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) and [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) were recently introduced to implement parallelism. CPU intensive applications will benefit from these features by enabling heavy computations in the background, in different threads.






# Summary
- Concurrency makes tasks to progress simultaneously. Parallelism is a special case of concurrency where tasks execute literally at the same time.
- These tasks can be CPU intensive. They are called CPU-bound operations and carry code to be run in our application. I/O-bound operations, on the other hand, do not execute in our programm flow but in an external context. They are intended to access devices or resources as servers, databases, files, etc. 
- I/O-bound operations can be blocking or non-blocking, depending on whether the thread is locked or not, and synchronous or asynchronous, in case the execution is sequential or the response comes at some point in the future.
- Javascript is intended for web applications with I/O-bound operations in mind. It uses an asynchronous non-blocking model with a single-threaded event loop. 
- Parallelism is slowly starting to appear in Javascript.