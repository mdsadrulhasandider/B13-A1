Answers to Questions

1. What is the difference between getElementById, getElementsByClassName, and querySelector / querySelectorAll?


1)  getElementById This method finds one element by its id. Since id is
    unique, it returns only one element. If the id is not found, it
    returns null.

2)  getElementsByClassName This method finds all elements with the same
    class name. It returns an HTMLCollection. It is live, so if the DOM
    changes, the collection also updates automatically.

3)  querySelector This method returns the first element that matches a
    CSS selector. We can use id, class, tag name, or any valid CSS
    selector.

4)  querySelectorAll This method returns all elements that match a CSS
    selector. It returns a NodeList. It is not live, so it does not
    update automatically.


2.  How do you create and insert a new element into the DOM?

First, we create an element using document.createElement(). Then we add
text or class to it. After that, we insert it into a parent element
using appendChild().

Example:

const div = document.createElement("div");
div.textContent = "New Job Card";
document.getElementById("container").appendChild(div);


3. What is Event Bubbling? And how does it work?

Event Bubbling means when an event happens on an element, it first runs
on that element, then moves to its parent, then to the parent's parent,
and continues upward.

For example, if we click a button inside a div: First the button click
runs. Then the div click runs. Then body click runs.

This upward process is called bubbling.

4.  What is Event Delegation in JavaScript? Why is it useful?

Event Delegation means adding one event listener to a parent element
instead of adding many listeners to child elements.

It is useful because: - It improves performance. - It works for
dynamically added elements. - It makes the code easier to manage.

5. What is the difference between preventDefault() and stopPropagation() methods?

preventDefault() This stops the default behavior of an element. For
example, stopping a form from submitting.

stopPropagation() This stops the event from moving up to parent
elements.

Sometimes both are used together when we want full control over the
event.
