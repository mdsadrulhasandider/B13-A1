#  JavaScript Fundamentals - Questions & Answers

## 1️⃣ What is the difference between var, let, and const?

**var** হলো JavaScript এর oldest variable declaration method। এটি function-scoped, মানে যে function এর মধ্যে declare করা হয় সেই function এর মধ্যেই accessible। var দিয়ে same variable multiple times declare করা যায়।

**let** হলো ES6 এর modern variable declaration। এটি block-scoped, মানে যেখানে declare করা হয় শুধু সেই block {} এর মধ্যেই কাজ করে। let দিয়ে same variable একই scope এ আবার declare করা যায় না।

**const** হলো constant variable declare করার জন্য। এটিও block-scoped। const দিয়ে declare করা variable এর value পরে change করা যায় না। তবে object বা array হলে তার content change করা যায়।

**Example:**
```javascript
function example() {
    var x = 5;      // function scoped
    let y = 10;     // block scoped
    const z = 15;   // constant, block scoped
    
    if (true) {
        var x = 20;  // redeclared, affects whole function
        let y = 30;  // new variable, only inside this block
        // const z = 25; // error: already declared
    }
}
```

---

## 2️⃣ What is the spread operator (...)?

Spread operator (`...`) হলো ES6 এর একটি feature যেটা দিয়ে array বা object এর elements কে expand করা যায়। এটি shallow copy create করে।

**Array এর জন্য:**
```javascript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]
const arr3 = [0, ...arr1];    // [0, 1, 2, 3]
```

**Object এর জন্য:**
```javascript
const obj1 = {name: "John", age: 25};
const obj2 = {...obj1, city: "Dhaka"}; // {name: "John", age: 25, city: "Dhaka"}
const obj3 = {...obj1, age: 30};       // {name: "John", age: 30}
```

**Function arguments এর জন্য:**
```javascript
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10
```

---

## 3️⃣ What is the difference between map(), filter(), and forEach()?

**map()** - array এর each element উপরে function apply করে এবং নতুন array return করে। Original array change হয় না।

**filter()** - array এর elements গুলোর উপরে condition test করে এবং যেগুলো condition satisfy করে শুধু সেগুলো নিয়ে নতুন array return করে।

**forEach()** - array এর each element উপরে function execute করে, কিন্তু কিছু return করে না (undefined)। এটি just loop এর মতো কাজ করে।

**Example:**
```javascript
const numbers = [1, 2, 3, 4, 5];

// map: each element কে double করে
const doubled = numbers.map(num => num * 2); // [2, 4, 6, 8, 10]

// filter: only even numbers
const evens = numbers.filter(num => num % 2 === 0); // [2, 4]

// forEach: just print each number
numbers.forEach(num => console.log(num)); // prints 1, 2, 3, 4, 5
```

**Key Difference:**
- map() এবং filter() নতুন array return করে
- forEach() কিছু return করে না
- map() transform করে, filter() select করে, forEach() just execute করে

---

## 4️⃣ What is an arrow function?

Arrow function হলো ES6 এ function লেখার একটি concise syntax। এটি `=>` symbol দিয়ে লেখা হয়।

**Traditional Function vs Arrow Function:**
```javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => {
    return a + b;
};

// Short arrow function (single line)
const add = (a, b) => a + b;
```

**Key Characteristics:**
- **Shorter syntax:** Function লেখার জন্য কম code লাগে
- **No 'this' binding:** Arrow function এর own `this` নেই, সে প্যারেন্টের `this` use করে
- **Always anonymous:** Arrow function এর নাম থাকে না, variable এ assign করতে হয়
- **No arguments object:** `arguments` keyword use করা যায় না
- **Cannot be constructor:** `new` keyword দিয়ে call করা যায় না

**Example with 'this':**
```javascript
// Traditional function - this refers to the object
const obj = {
    name: "John",
    sayHello: function() {
        setTimeout(function() {
            console.log(this.name); // undefined (this is window)
        }, 1000);
    }
};

// Arrow function - this from parent
const obj2 = {
    name: "John",
    sayHello: function() {
        setTimeout(() => {
            console.log(this.name); // "John" (this from parent)
        }, 1000);
    }
};
```

---

## 5️⃣ What are template literals?

Template literals হলো JavaScript এ string লেখার modern way। এটি backtick (`` ` ``) দিয়ে লেখা হয় এবং এর মধ্যে variable বা expression directly embed করা যায়।

**Traditional String Concatenation:**
```javascript
const name = "John";
const age = 25;
const message = "Hello, my name is " + name + " and I am " + age + " years old.";
```

**Template Literal:**
```javascript
const name = "John";
const age = 25;
const message = `Hello, my name is ${name} and I am ${age} years old.`;
```

**Key Features:**

**1. String Interpolation:**
```javascript
const item = "book";
const price = 100;
const sentence = `This ${item} costs ${price} taka.`;
```

**2. Multiline Strings:**
```javascript
// Traditional way (with \n)
const text = "Line 1\nLine 2\nLine 3";

// Template literal way
const text = `Line 1
Line 2
Line 3`;
```

**3. Expression Evaluation:**
```javascript
const a = 10;
const b = 20;
const result = `The sum of ${a} and ${b} is ${a + b}.`; // "The sum of 10 and 20 is 30."
```

**4. Nested Template Literals:**
```javascript
const user = {
    name: "John",
    details: `Age: ${25}, City: ${"Dhaka"}`
};
```

**Benefits:**
- More readable than string concatenation
- Supports multiline strings naturally
- Can embed any JavaScript expression
- Easier to write and maintain

---

## আমাদের GitHub Issues Tracker Project এ ব্যবহার:

আমাদের project এ এই JavaScript concepts গুলো ব্যবহার করেছি:

- **const/let:** Variable declarations এর জন্য
- **Arrow functions:** Event handlers এবং callback functions এ
- **Template literals:** Dynamic HTML generation এর জন্য
- **Spread operator:** Array copying এবং manipulation এর জন্য
- **map/filter:** Issues filtering এবং display এর জন্য
- **forEach:** Loop করার জন্য

---

*এই answers গুলো আমার নিজের understanding থেকে লেখা, কোনো AI বা Google থেকে copy-paste করা নয়।*
