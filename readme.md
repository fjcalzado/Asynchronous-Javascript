![Asynchronous Javascript Header](src/png/header.png)


The goal of this guide is to explain asynchronous programming in Javascript with the help of clean and easy figures to grasp key concepts in a glimpse. 

First, we will review useful general ideas to better understand what's behind asynchronous programming. Then, we will move our focus to the specific Javascript scenario to verify how these concepts are applied. Finally, we will see the most common asynchronous patterns in Javascript through examples.

Let's refresh these concepts before going deeper.

# Concurrency and Parallelism

![Concurrency Scenarios](src/png/concurrency.png)

# I/O Flavors: Blocking vs. Non-blocking & Synchronous vs. Asynchronous

This terms are not applied consistently in every scenario and it all depends on the context. Many times they are used as synonyms or mixed up to refer to the same thing.

A possible classification in the context of I/O would be better understood if we imagine I/O operations comprising two phases: **wait** for the device to be ready or the data to be available and then **execute** the operation itself, whatever is intended for, read, write, etc.

Blocking vs Non-Blocking refers to how waiting time affects to our main program:

- `Blocking`: A blocking call does not return control to the application until is completed. Thread is locked in the meantime by putting it to wait state.
- `Non-Blocking`: A non-blocking call returns immediately with whatever result it has. In case it could be completed, it will return the desired data. Otherwise, if the operation could not be immediately satisfied, it will provide an error code indicating something like '*Temporarily unavailable*', '*I am not ready*' or '*I will block. Please, postpone the call*'. It is implied that some sort of polling is done to complete the job or to place a new request in a better moment.

![Blocking vs Non Blocking](src/png/blocking_non_blocking.png)

While synchronous vs asynchronous determine when execution takes place:

- `Synchronous`: blocking and synchronous are used as synonyms many times, meaning that the whole I/O operation is executed sequentially and therefore we must wait for it to complete.
- `Asynchronous`: the completion of the operation is later signaled using a specific mechanism such as a registered callback, promise or event (they will be explained later) which make possible to defer the processing of the response. Also, this is non-blocking by nature, as the I/O call returns immediately.

![Synchronous vs Asynchronous](src/png/sync_async.png)


Combining different fashions we can classify I/O operations by its nature:

- `Synchronous` `Blocking` I/O. The whole operation is done in one shot blocking the execution flow:
  - The thread is blocked in order to wait for the device to be ready.
  - The response is processed immediately afterwards. 
- `Synchronous` `Non-Blocking` I/O. Similar to the previous one but using polling to avoid blocking in the first stage:
  - Operation will not block the thread, instead, polling is used.
  - The response is processed immediately when received.
- `Asynchronous` `Non-Blocking` I/O: 
  -  We just send an I/O request that immediately returns to avoid blocking. There is no need for active polling in this case. OS takes care of everything and keep it transparent to us.
  - A notification is sent once completed. Then, a function to process the response is scheduled to be run at some point in our execution flow.
