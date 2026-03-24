/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Trophy, 
  Users, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  LogOut, 
  User as UserIcon,
  Flame,
  Layout,
  FileUp,
  ChevronRight,
  BrainCircuit,
  Lightbulb,
  Play,
  RotateCcw,
  XCircle,
  Search,
  Github
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Markdown from 'react-markdown';

import { Lesson, Exercise, User, TestQuestion } from './types';
import { getMentorHelp, getLessonExplanation } from './lib/gemini';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const LESSONS: Lesson[] = [
  {
    id: 'basics-1',
    title: 'Variables: The Storage Boxes',
    description: 'Learn how to store data in your code using variables.',
    illustration: '📦',
    content: `
# Variables: Your Coding Storage Boxes

Think of a variable as a **storage box** with a label on it. 
Inside the box, you can put different things: numbers, text, or even more complex data.

### Why do we need them?
Imagine you're building a game and you want to keep track of the player's score. 
You'd create a variable called \`score\` and update it every time the player gets a point!

### How to use them:
In most languages, you declare a variable like this:
\`\`\`javascript
let score = 0;
let playerName = "CodeHero";
\`\`\`
    `,
    exercises: [
      {
        id: 'ex-1-1',
        question: 'Drag the correct blocks to create a variable named "age" and set it to 25.',
        type: 'drag-and-drop',
        options: ['let', 'age', '=', '25', ';', 'var', 'const'],
        correctAnswer: ['let', 'age', '=', '25', ';'],
        explanation: 'In JavaScript, we use `let` to declare a variable, followed by the name, an equals sign, the value, and a semicolon.',
      },
      {
        id: 'ex-1-2',
        question: 'Fix the error in this code: `let 1stPlace = "Winner";`',
        type: 'coding',
        correctAnswer: 'let firstPlace = "Winner";',
        explanation: 'Variable names cannot start with a number! They should start with a letter or an underscore.',
        hint: 'Try changing the name to something that starts with a letter.',
      }
    ]
  },
  {
    id: 'basics-2',
    title: 'Data Types: Different Kinds of Stuff',
    description: 'Explore the different types of data you can store in variables.',
    illustration: '🔢',
    content: `
# Data Types: What's in the Box?

Not all data is the same! Just like you wouldn't put a liquid in a cardboard box, 
different types of data need different "types" in code.

### Common Data Types:
1.  **Strings**: Text data, always wrapped in quotes (e.g., \`"Hello!"\`).
2.  **Numbers**: Whole numbers or decimals (e.g., \`42\`, \`3.14\`).
3.  **Booleans**: True or False values (e.g., \`true\`, \`false\`).
    `,
    exercises: [
      {
        id: 'ex-2-1',
        question: 'Which of these is a valid String?',
        type: 'multiple-choice',
        options: ['42', 'true', '"Coding is fun!"', 'undefined'],
        correctAnswer: '"Coding is fun!"',
        explanation: 'Strings are always wrapped in double or single quotes.',
      }
    ]
  },
  {
    id: 'basics-3',
    title: 'Functions: The Magic Machines',
    description: 'Learn how to group code into reusable "machines" called functions.',
    illustration: '⚙️',
    content: `
# Functions: Your Code Machines

A function is like a **magic machine**. You give it some input (ingredients), 
it does some work (processing), and it gives you an output (the result).

### Why use functions?
Instead of writing the same code over and over, you can just call your function! 
It makes your code cleaner and easier to manage.
    `,
    exercises: [
      {
        id: 'ex-3-1',
        question: 'Complete the function to add two numbers.',
        type: 'coding',
        correctAnswer: 'function add(a, b) { return a + b; }',
        explanation: 'A function starts with the `function` keyword, followed by its name, parameters in parentheses, and the code to run in curly braces.',
      }
    ]
  },
  {
    id: 'basics-4',
    title: 'Conditionals: Making Decisions',
    description: 'Teach your code how to make decisions using if-else statements.',
    illustration: '🚦',
    content: `
# Conditionals: The Fork in the Road

Conditionals allow your code to make decisions. It's like saying: "If it's raining, take an umbrella. Otherwise, wear sunglasses."

### The If-Else Statement:
\`\`\`javascript
if (isRaining) {
  console.log("Take an umbrella!");
} else {
  console.log("Wear sunglasses!");
}
\`\`\`

### Comparison Operators:
- \`==\` : Equal to
- \`!=\` : Not equal to
- \`>\` : Greater than
- \`<\` : Less than
    `,
    exercises: [
      {
        id: 'ex-4-1',
        question: 'Complete the condition to check if age is 18 or older.',
        type: 'coding',
        correctAnswer: 'if (age >= 18) { return "Adult"; }',
        explanation: 'We use the `>=` operator to check if a value is greater than or equal to another.',
      }
    ]
  },
  {
    id: 'basics-5',
    title: 'Loops: Doing Things Again',
    description: 'Learn how to repeat actions without writing the same code twice.',
    illustration: '🔄',
    content: `
# Loops: The Infinite (or not) Cycle

Loops are used to repeat a block of code multiple times. This is incredibly useful for tasks like printing a list of names or moving a character in a game.

### The For Loop:
\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log("Hello number " + i);
}
\`\`\`

### The While Loop:
\`\`\`javascript
while (energy > 0) {
  run();
  energy--;
}
\`\`\`
    `,
    exercises: [
      {
        id: 'ex-5-1',
        question: 'Write a loop that runs 3 times.',
        type: 'coding',
        correctAnswer: 'for (let i = 0; i < 3; i++) { }',
        explanation: 'A for loop has three parts: initialization, condition, and increment.',
      }
    ]
  },
  {
    id: 'basics-6',
    title: 'Arrays: The Shopping List',
    description: 'Store multiple values in a single variable using arrays.',
    illustration: '📝',
    content: `
# Arrays: Your Coding Lists

An array is a special variable that can hold more than one value at a time. Think of it like a shopping list or a row of lockers.

### Creating an Array:
\`\`\`javascript
let fruits = ["Apple", "Banana", "Cherry"];
\`\`\`

### Accessing Items:
Items in an array are indexed starting from **0**.
\`\`\`javascript
let firstFruit = fruits[0]; // "Apple"
\`\`\`
    `,
    exercises: [
      {
        id: 'ex-6-1',
        question: 'Drag the blocks to create an array with "Red" and "Blue".',
        type: 'drag-and-drop',
        options: ['let', 'colors', '=', '[', '"Red"', ',', '"Blue"', ']', ';'],
        correctAnswer: ['let', 'colors', '=', '[', '"Red"', ',', '"Blue"', ']', ';'],
        explanation: 'Arrays are defined using square brackets `[]` and items are separated by commas.',
      }
    ]
  },
  {
    id: 'basics-7',
    title: 'Objects: The Digital Folders',
    description: 'Learn how to store complex data using key-value pairs.',
    illustration: '📂',
    content: `
# Objects: Organizing Your Data

If an array is a list, an **Object** is like a digital folder or a real-world object (like a car or a person). It stores data in **key-value pairs**.

### Creating an Object:
\`\`\`javascript
let person = {
  name: "Keerthana",
  age: 24,
  isCoding: true
};
\`\`\`

### Accessing Properties:
You can use "dot notation" to get values:
\`\`\`javascript
console.log(person.name); // "Keerthana"
\`\`\`
    `,
    exercises: [
      {
        id: 'ex-7-1',
        question: 'Create an object named "car" with a "brand" property set to "Tesla".',
        type: 'coding',
        correctAnswer: 'let car = { brand: "Tesla" };',
        explanation: 'Objects use curly braces `{}` and properties are defined as `key: value`.',
      }
    ]
  },
  {
    id: 'basics-8',
    title: 'Scope: Where Can I See It?',
    description: 'Understand global and local scope to avoid "Variable Not Found" errors.',
    illustration: '🔭',
    content: `
# Scope: The Visibility of Variables

**Scope** determines where a variable can be accessed in your code.

### 1. Global Scope:
Variables declared outside of any function are **Global**. They can be seen from anywhere!

### 2. Local (Function) Scope:
Variables declared inside a function are **Local**. They only exist inside that function.

### Why it matters:
Using local variables helps prevent "name collisions" where two different parts of your code accidentally use the same variable name for different things.
    `,
    exercises: [
      {
        id: 'ex-8-1',
        question: 'Is a variable declared inside a function accessible outside of it?',
        type: 'multiple-choice',
        options: ['Yes', 'No', 'Only if it is a number', 'Sometimes'],
        correctAnswer: 'No',
        explanation: 'Variables inside a function have local scope and cannot be accessed from the outside.',
      }
    ]
  },
  {
    id: 'basics-9',
    title: 'Error Handling: Catching Bugs',
    description: 'Learn how to prevent your app from crashing using try-catch.',
    illustration: '🛡️',
    content: `
# Error Handling: Your Code's Shield

Sometimes things go wrong (like a network failure or a typo). **Error Handling** allows your code to fail gracefully instead of crashing the whole app.

### The Try-Catch Block:
\`\`\`javascript
try {
  // Code that might fail
  let result = riskyOperation();
} catch (error) {
  // What to do if it fails
  console.log("Oops! Something went wrong: " + error.message);
}
\`\`\`
    `,
    exercises: [
      {
        id: 'ex-9-1',
        question: 'Drag the blocks to create a basic try-catch structure.',
        type: 'drag-and-drop',
        options: ['try', '{', '}', 'catch', '(', 'err', ')'],
        correctAnswer: ['try', '{', '}', 'catch', '(', 'err', ')', '{', '}'],
        explanation: 'The `try` block contains the risky code, and the `catch` block handles any errors that occur.',
      }
    ]
  },
  {
    id: 'basics-10',
    title: 'Async/Await: Waiting for Results',
    description: 'Learn how to handle tasks that take time, like fetching data from the web.',
    illustration: '⏳',
    content: `
# Async/Await: The Patient Coder

Some tasks take time, like downloading a file or fetching data from an API. We use **Async/Await** to tell our code to wait for these tasks to finish.

### How it works:
1.  **async**: Marks a function as asynchronous.
2.  **await**: Tells the code to pause until the task is done.

\`\`\`javascript
async function getUserData() {
  let response = await fetch("https://api.example.com/user");
  let data = await response.json();
  return data;
}
\`\`\`
    `,
    exercises: [
      {
        id: 'ex-10-1',
        question: 'What keyword is used to pause execution until a Promise is resolved?',
        type: 'multiple-choice',
        options: ['wait', 'pause', 'await', 'stop'],
        correctAnswer: 'await',
        explanation: 'The `await` keyword is used inside an `async` function to wait for a Promise.',
      }
    ]
  }
];

const TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 'q1',
    question: 'What keyword is used to declare a variable that can be reassigned?',
    options: ['const', 'let', 'var', 'static'],
    correctAnswer: 1,
    explanation: '`let` allows you to declare variables that can be changed later. `const` is for constants that stay the same.',
  },
  {
    id: 'q2',
    question: 'Which of the following is NOT a primitive data type in JavaScript?',
    options: ['String', 'Number', 'Boolean', 'Object'],
    correctAnswer: 3,
    explanation: 'Objects are complex data types, while Strings, Numbers, and Booleans are primitives.',
  },
  {
    id: 'q3',
    question: 'What does the "===" operator do?',
    options: ['Assigns a value', 'Checks for equality only', 'Checks for equality and type', 'Checks if a value is greater than'],
    correctAnswer: 2,
    explanation: '`===` is the strict equality operator, checking both the value and the data type.',
  },
  {
    id: 'q4',
    question: 'How do you call a function named "myFunction"?',
    options: ['call myFunction()', 'myFunction()', 'run myFunction', 'execute myFunction'],
    correctAnswer: 1,
    explanation: 'You call a function by writing its name followed by parentheses.',
  },
  {
    id: 'q5',
    question: 'What is the result of "5" + 5 in JavaScript?',
    options: ['10', '"55"', 'Error', 'NaN'],
    correctAnswer: 1,
    explanation: 'When you add a string and a number, JavaScript converts the number to a string and joins them together (concatenation).',
  },
  {
    id: 'q6',
    question: 'Which symbol is used for comments in JavaScript?',
    options: ['#', '//', '/*', '<!--'],
    correctAnswer: 1,
    explanation: '`//` is used for single-line comments in JavaScript.',
  },
  {
    id: 'q7',
    question: 'What is an array?',
    options: ['A single value', 'A collection of values', 'A type of function', 'A variable name'],
    correctAnswer: 1,
    explanation: 'An array is a special variable that can hold more than one value at a time.',
  },
  {
    id: 'q8',
    question: 'What is the index of the first element in an array?',
    options: ['1', '0', '-1', 'First'],
    correctAnswer: 1,
    explanation: 'Arrays in JavaScript are zero-indexed, meaning the first element is at index 0.',
  },
  {
    id: 'q9',
    question: 'What does "NaN" stand for?',
    options: ['Not a Number', 'New and Nice', 'Null and None', 'Next and Now'],
    correctAnswer: 0,
    explanation: '`NaN` represents a value that is not a legal number.',
  },
  {
    id: 'q10',
    question: 'Which method is used to add an element to the end of an array?',
    options: ['pop()', 'shift()', 'push()', 'unshift()'],
    correctAnswer: 2,
    explanation: '`push()` adds one or more elements to the end of an array and returns the new length.',
  },
  {
    id: 'q11',
    question: 'What is the purpose of an "if" statement?',
    options: ['To repeat code', 'To make decisions', 'To store data', 'To define a function'],
    correctAnswer: 1,
    explanation: 'If statements are used to execute a block of code only if a specified condition is true.',
  },
  {
    id: 'q12',
    question: 'Which loop is best when you know exactly how many times you want to repeat?',
    options: ['while loop', 'for loop', 'do-while loop', 'infinite loop'],
    correctAnswer: 1,
    explanation: 'A for loop is typically used when the number of iterations is known beforehand.',
  },
  {
    id: 'q13',
    question: 'How do you access the second element in an array named "myArray"?',
    options: ['myArray[1]', 'myArray[2]', 'myArray.second()', 'myArray{1}'],
    correctAnswer: 0,
    explanation: 'Since arrays are zero-indexed, the second element is at index 1.',
  },
  {
    id: 'q14',
    question: 'What does the "!" operator do in a condition?',
    options: ['Adds two values', 'Checks if equal', 'Negates the condition (NOT)', 'Ends the script'],
    correctAnswer: 2,
    explanation: 'The `!` operator is the logical NOT operator, which reverses the boolean value of a condition.',
  },
  {
    id: 'q15',
    question: 'What happens in an infinite loop?',
    options: ['The code runs once', 'The code never runs', 'The code runs forever', 'The computer explodes'],
    correctAnswer: 2,
    explanation: 'An infinite loop occurs when the loop condition never becomes false, causing the code to repeat indefinitely.',
  },
  {
    id: 'q16',
    question: 'How do you access a property "name" in an object called "user"?',
    options: ['user["name"]', 'user.name', 'Both A and B', 'user->name'],
    correctAnswer: 2,
    explanation: 'In JavaScript, you can access object properties using both dot notation (`user.name`) and bracket notation (`user["name"]`).',
  },
  {
    id: 'q17',
    question: 'What is a "Global Variable"?',
    options: ['A variable used only in one function', 'A variable accessible from anywhere in the code', 'A variable that stores Earth data', 'A variable that cannot be changed'],
    correctAnswer: 1,
    explanation: 'Global variables are declared outside of functions and are accessible throughout the entire script.',
  },
  {
    id: 'q18',
    question: 'Which block is used to handle errors in JavaScript?',
    options: ['if-else', 'try-catch', 'for-loop', 'switch-case'],
    correctAnswer: 1,
    explanation: 'The `try-catch` block is specifically designed for error handling.',
  },
  {
    id: 'q19',
    question: 'What does the "async" keyword do?',
    options: ['Speeds up the code', 'Makes a function return a Promise', 'Deletes the function', 'Runs the code in reverse'],
    correctAnswer: 1,
    explanation: 'The `async` keyword ensures that the function returns a promise, and wraps non-promises in it.',
  },
  {
    id: 'q20',
    question: 'What is the purpose of the "finally" block in try-catch?',
    options: ['To catch errors', 'To try code', 'To run code regardless of whether an error occurred', 'To end the program'],
    correctAnswer: 2,
    explanation: 'The `finally` block always executes after the `try` and `catch` blocks, regardless of the outcome.',
  }
];

// --- Components ---

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 z-50 flex items-center justify-between px-6">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
        <Code2 className="text-white w-5 h-5" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white">CodeBuddy</span>
    </div>
    
    {user && (
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
          <Flame className="text-orange-500 w-4 h-4" />
          <span className="text-sm font-semibold text-orange-500">{user.streak} Day Streak</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-zinc-500">{user.email}</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    )}
  </nav>
);

const AuthScreen = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      toast.error('Please fill in all fields');
      return;
    }

    // Simulated Auth
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: isLogin ? email.split('@')[0] : name,
      streak: 0,
      xp: 0,
      lastActive: new Date().toISOString(),
      completedLessons: [],
    };
    
    localStorage.setItem('codebuddy_user', JSON.stringify(user));
    onLogin(user);
    toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
            <Code2 className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CodeBuddy</h1>
          <p className="text-zinc-400">Master coding with your AI companion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-2.5 rounded-xl transition-all">
              <Search className="w-4 h-4" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-2.5 rounded-xl transition-all">
              <Github className="w-4 h-4" />
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-zinc-500 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-500 font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user, onStartLesson, onStartTest }: { user: User, onStartLesson: (lesson: Lesson) => void, onStartTest: () => void }) => {
  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Progress & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}! 👋</h2>
              <p className="text-zinc-400 mb-8">You're doing great! Keep up the momentum to reach your 7-day goal.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4">
                  <Flame className="text-orange-500 w-6 h-6 mb-2" />
                  <p className="text-2xl font-bold text-white">{user.streak}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Day Streak</p>
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4">
                  <Trophy className="text-yellow-500 w-6 h-6 mb-2" />
                  <p className="text-2xl font-bold text-white">{user.completedLessons.length}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Lessons Done</p>
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4">
                  <BrainCircuit className="text-blue-500 w-6 h-6 mb-2" />
                  <p className="text-2xl font-bold text-white">{user.xp}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">XP Earned</p>
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4">
                  <Users className="text-purple-500 w-6 h-6 mb-2" />
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Active Buddies</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Your Learning Path</h3>
              <button className="text-orange-500 text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LESSONS.map((lesson) => (
                <motion.button
                  key={lesson.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onStartLesson(lesson)}
                  className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 p-6 rounded-2xl text-left transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{lesson.illustration}</div>
                    {user.completedLessons.includes(lesson.id) && (
                      <CheckCircle2 className="text-green-500 w-6 h-6" />
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-orange-500 transition-colors">{lesson.title}</h4>
                  <p className="text-sm text-zinc-500 line-clamp-2">{lesson.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    <span>{lesson.exercises.length} Exercises</span>
                    <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                    <span>15 Mins</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Buddy System & AI Mentor */}
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="text-purple-500 w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Coding Buddies</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Sarah K.', status: 'Coding now...', avatar: '👩‍💻' },
                { name: 'Alex M.', status: 'Last active 2h ago', avatar: '👨‍💻' },
                { name: 'Leo R.', status: 'On a 12-day streak!', avatar: '🦁' },
              ].map((buddy, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-xl border border-zinc-800/50">
                  <div className="text-2xl">{buddy.avatar}</div>
                  <div>
                    <p className="text-sm font-bold text-white">{buddy.name}</p>
                    <p className="text-xs text-zinc-500">{buddy.status}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border border-dashed border-zinc-700 rounded-xl text-zinc-500 text-sm font-medium hover:bg-zinc-800 transition-all">
                + Add New Buddy
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20">
            <HelpCircle className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">Ready for a challenge?</h3>
            <p className="text-orange-100 text-sm mb-6">Test your knowledge with our weekly quiz and earn bonus XP!</p>
            <button 
              onClick={onStartTest}
              className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-50 shadow-lg transition-all"
            >
              Take the Test
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileUp className="text-blue-500 w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Resources</h3>
            </div>
            <div className="p-8 border-2 border-dashed border-zinc-800 rounded-2xl text-center hover:border-blue-500/50 transition-all cursor-pointer group">
              <FileUp className="w-8 h-8 text-zinc-600 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm font-medium text-zinc-400">Upload PDF Notes</p>
              <p className="text-xs text-zinc-600 mt-1">Drag and drop or click to browse</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LessonView = ({ lesson, onComplete, onBack }: { lesson: Lesson, onComplete: () => void, onBack: () => void }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(-1); // -1 means content view
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const currentExercise = currentExerciseIndex >= 0 ? lesson.exercises[currentExerciseIndex] : null;

  const handleCheck = async () => {
    if (!currentExercise) return;

    const isCorrect = userCode.trim().toLowerCase() === (currentExercise.correctAnswer as string).toLowerCase();

    if (isCorrect) {
      setFeedback({ type: 'success', message: 'Perfect! You nailed it! 🚀' });
      toast.success('Correct answer!');
    } else {
      setIsAiLoading(true);
      const mentorHelp = await getMentorHelp(userCode, 'Incorrect logic or syntax', currentExercise.question);
      setFeedback({ type: 'error', message: mentorHelp });
      setIsAiLoading(false);
    }
  };

  const handleNext = () => {
    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setUserCode('');
      setFeedback(null);
    } else {
      onComplete();
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {currentExerciseIndex === -1 ? (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">{lesson.illustration}</div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
                  <p className="text-zinc-500">{lesson.description}</p>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <Markdown>{lesson.content}</Markdown>
              </div>

              <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-4">
                <Lightbulb className="text-blue-500 w-6 h-6 shrink-0" />
                <div>
                  <h4 className="text-blue-500 font-bold mb-1">Pro Tip</h4>
                  <p className="text-sm text-blue-100/80">Always use descriptive names for your variables. Instead of \`let x = 10\`, use \`let playerHealth = 10\`. It makes your code much easier to read!</p>
                </div>
              </div>

              <button 
                onClick={() => setCurrentExerciseIndex(0)}
                className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                Start Exercises
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key={currentExerciseIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-xs font-bold uppercase tracking-wider">
                    Exercise {currentExerciseIndex + 1} of {lesson.exercises.length}
                  </div>
                </div>
                <div className="flex gap-1">
                  {lesson.exercises.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-8 h-1.5 rounded-full transition-all",
                        i === currentExerciseIndex ? "bg-orange-500" : i < currentExerciseIndex ? "bg-green-500" : "bg-zinc-800"
                      )} 
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-6">{currentExercise?.question}</h3>

              {currentExercise?.type === 'coding' ? (
                <div className="space-y-4">
                  <div className="relative">
                    <textarea 
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                      placeholder="// Type your code here..."
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => setUserCode('')}
                        className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {feedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-6 rounded-2xl border flex gap-4",
                        feedback.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-100" : "bg-red-500/10 border-red-500/20 text-red-100"
                      )}
                    >
                      {feedback.type === 'success' ? <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" /> : <AlertCircle className="text-red-500 w-6 h-6 shrink-0" />}
                      <div>
                        <p className="text-sm leading-relaxed">{feedback.message}</p>
                        {feedback.type === 'success' && (
                          <p className="text-xs text-green-500/70 mt-2 font-medium">{currentExercise.explanation}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      onClick={handleCheck}
                      disabled={isAiLoading || !userCode.trim()}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isAiLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Check Answer
                        </>
                      )}
                    </button>
                    {feedback?.type === 'success' && (
                      <button 
                        onClick={handleNext}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                      >
                        Next
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Simplified Drag and Drop Simulation */}
                  <div className="flex flex-wrap gap-3 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl min-h-[100px]">
                    {userCode.split(' ').filter(Boolean).map((word, i) => (
                      <button 
                        key={i}
                        onClick={() => setUserCode(userCode.split(' ').filter((_, idx) => idx !== i).join(' '))}
                        className="px-4 py-2 bg-orange-500 text-white rounded-xl font-mono text-sm shadow-lg shadow-orange-500/20"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {currentExercise?.options?.map((option, i) => (
                      <button 
                        key={i}
                        onClick={() => setUserCode(prev => prev ? `${prev} ${option}` : option)}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-mono text-sm border border-zinc-700 transition-all"
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {feedback && (
                    <div className={cn(
                      "p-6 rounded-2xl border flex gap-4",
                      feedback.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-100" : "bg-red-500/10 border-red-500/20 text-red-100"
                    )}>
                      {feedback.type === 'success' ? <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" /> : <AlertCircle className="text-red-500 w-6 h-6 shrink-0" />}
                      <p className="text-sm">{feedback.message}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        const isCorrect = userCode.trim() === (currentExercise?.correctAnswer as string[]).join(' ');
                        if (isCorrect) {
                          setFeedback({ type: 'success', message: 'Awesome! You built it correctly! 🧱' });
                        } else {
                          setFeedback({ type: 'error', message: 'Not quite. Try rearranging the blocks!' });
                        }
                      }}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                      Check Blocks
                    </button>
                    {feedback?.type === 'success' && (
                      <button 
                        onClick={handleNext}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                      >
                        Next
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="text-purple-500 w-5 h-5" />
              <h3 className="text-lg font-bold text-white">AI Mentor</h3>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 mb-4">
              <p className="text-sm text-zinc-400 italic">"I'm watching your progress! If you get stuck, I'll provide hints based on your code."</p>
            </div>
            <button 
              onClick={async () => {
                setIsAiLoading(true);
                const explanation = await getLessonExplanation(lesson.title);
                setAiExplanation(explanation);
                setIsAiLoading(false);
              }}
              className="w-full py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border border-purple-500/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Explain this concept
            </button>

            {aiExplanation && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-800"
              >
                <p className="text-xs text-zinc-300 leading-relaxed">{aiExplanation}</p>
              </motion.div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Learning Goals</h3>
            <ul className="space-y-3">
              {[
                'Understand variable declaration',
                'Learn naming conventions',
                'Practice basic assignment',
                'Identify common errors'
              ].map((goal, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                  <div className="w-5 h-5 rounded-full border border-zinc-800 flex items-center justify-center shrink-0">
                    {i === 0 && <CheckCircle2 className="text-green-500 w-4 h-4" />}
                  </div>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestView = ({ onComplete, onBack }: { onComplete: (score: number) => void, onBack: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = TEST_QUESTIONS[currentIndex];

  const handleAnswer = () => {
    if (selectedOption === null) return;

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      toast.success('Correct!');
    } else {
      toast.error('Incorrect!');
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < TEST_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-3xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Final Assessment</h2>
          <div className="text-sm font-bold text-zinc-500">
            Question {currentIndex + 1} of {TEST_QUESTIONS.length}
          </div>
        </div>

        <div className="w-full h-2 bg-zinc-800 rounded-full mb-8">
          <div 
            className="h-full bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / TEST_QUESTIONS.length) * 100}%` }}
          />
        </div>

        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-medium text-white leading-relaxed">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                disabled={showExplanation}
                onClick={() => setSelectedOption(i)}
                className={cn(
                  "w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group",
                  selectedOption === i 
                    ? "bg-orange-500/10 border-orange-500 text-orange-500" 
                    : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white",
                  showExplanation && i === currentQuestion.correctAnswer && "bg-green-500/10 border-green-500 text-green-500",
                  showExplanation && selectedOption === i && i !== currentQuestion.correctAnswer && "bg-red-500/10 border-red-500 text-red-500"
                )}
              >
                <span>{option}</span>
                {showExplanation && i === currentQuestion.correctAnswer && <CheckCircle2 className="w-5 h-5" />}
                {showExplanation && selectedOption === i && i !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5" />}
              </button>
            ))}
          </div>

          {showExplanation && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-zinc-800/50 border border-zinc-700 rounded-2xl"
            >
              <h4 className="text-sm font-bold text-white mb-2">Explanation</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">{currentQuestion.explanation}</p>
            </motion.div>
          )}

          <div className="pt-4">
            {!showExplanation ? (
              <button 
                onClick={handleAnswer}
                disabled={selectedOption === null}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {currentIndex === TEST_QUESTIONS.length - 1 ? 'Finish Test' : 'Next Question'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'lesson' | 'test' | 'result'>('dashboard');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [testScore, setTestScore] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('codebuddy_user');
    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      
      // Check for streak reset
      const lastActive = new Date(parsedUser.lastActive);
      const now = new Date();
      const lastDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diffDays = Math.floor((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        const updatedUser = { ...parsedUser, streak: 0, lastActive: now.toISOString() };
        setUser(updatedUser);
        localStorage.setItem('codebuddy_user', JSON.stringify(updatedUser));
      } else {
        setUser(parsedUser);
      }
    }
  }, []);

  const updateStatsOnCompletion = (xpAmount: number, lessonId?: string) => {
    if (!user) return;

    const now = new Date();
    const lastActive = new Date(user.lastActive);
    const lastDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let newStreak = user.streak;
    if (nowDate > lastDate) {
      newStreak += 1;
    }

    const updatedUser: User = {
      ...user,
      xp: user.xp + xpAmount,
      streak: newStreak,
      lastActive: now.toISOString(),
      completedLessons: lessonId 
        ? [...new Set([...user.completedLessons, lessonId])]
        : user.completedLessons
    };

    setUser(updatedUser);
    localStorage.setItem('codebuddy_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('codebuddy_user');
    setUser(null);
    setView('dashboard');
  };

  if (!user) {
    return (
      <>
        <Toaster position="top-center" theme="dark" />
        <AuthScreen onLogin={setUser} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500/30">
      <Toaster position="top-center" theme="dark" />
      <Navbar user={user} onLogout={handleLogout} />

      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard 
              user={user} 
              onStartLesson={(lesson) => {
                setActiveLesson(lesson);
                setView('lesson');
              }}
              onStartTest={() => setView('test')}
            />
          </motion.div>
        )}

        {view === 'lesson' && activeLesson && (
          <motion.div 
            key="lesson"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LessonView 
              lesson={activeLesson} 
              onBack={() => setView('dashboard')}
              onComplete={() => {
                updateStatsOnCompletion(50, activeLesson.id);
                toast.success('Lesson completed! +50 XP');
                setView('dashboard');
              }}
            />
          </motion.div>
        )}

        {view === 'test' && (
          <motion.div 
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TestView 
              onBack={() => setView('dashboard')}
              onComplete={(score) => {
                const xpEarned = score * 20;
                updateStatsOnCompletion(xpEarned);
                setTestScore(score);
                setView('result');
              }}
            />
          </motion.div>
        )}

        {view === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-12 px-6 flex flex-center justify-center"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
              <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="text-yellow-500 w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Test Complete!</h2>
              <p className="text-zinc-400 mb-8">You scored {testScore} out of {TEST_QUESTIONS.length}</p>
              
              <div className="space-y-4">
                <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800">
                  <p className="text-sm text-zinc-500 uppercase font-bold tracking-widest mb-1">XP Earned</p>
                  <p className="text-2xl font-bold text-orange-500">+{testScore * 20}</p>
                </div>
                <button 
                  onClick={() => setView('dashboard')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 border-t border-zinc-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code2 className="text-orange-500 w-5 h-5" />
          <span className="font-bold text-white">CodeBuddy</span>
        </div>
        <p className="text-zinc-600 text-sm">© 2026 CodeBuddy. Built for future developers.</p>
      </footer>
    </div>
  );
}
