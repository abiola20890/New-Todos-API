require('dotenv').config();

const express = require('express');
const cors = require('cors');  // cors = Cross Origin Resource Sharing means to allow request from the frontend to backend
const logRequest = require('./logger'); // Import the logger middleware
const validateTodo = require('./validator');
const errorHandler = require('./errorHandle');
const app = express(); 
// middleware to parse JSON bodies
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5500', // Replace with your frontend URL
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};


app.use(cors(corsOptions));

app.use(logRequest); // Use the logger middleware

let todos = [
    //in memory data: array of objects
    { id: 1, task: 'Finish Week 4 Slides', completed: false },
    { id: 2, task: 'Deploy API (Today!)', completed: true }
];

// GET Request
app.get('/', (req, res) => {
    res.send('Todo API is ready');
});

// GET all todos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// POST
app.post('/todos', validateTodo, (req, res, next) => {
    try
    {   
      const {task} = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }
    const newTodo = {
        id: todos.length + 1,
        task,
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo); // echo back the created todo
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// GET ONE todo by ID
app.get('/todos/:id', (req, res, next) => {
    try {
      const Id = parseInt(req.params.id);
      if(isNaN(Id)){
        throw new Error('Invalid ID ');
    }
    const todo = todos.find(t => t.id === Id);
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    
    }
    res.json(todo);
} catch (error) {
        next(error); // Pass errors to the error handler    
    }
});

    // JSON means JavaScript Object Notation use only for data transfer
    // request.params is use only in id  because the id is path of the url

// PATCH / partial update
app.patch('/todos/:id', (req, res, next) => {
   try {
     const Id = parseInt(req.params.id);
     if(isNaN(Id)){
        throw new Error('Invalid ID ');
    }
    const todo = todos.find(t => t.id === Id);
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    Object.assign(todo, req.body);
    res.status(200).json(todo);
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// DELETE
app.delete('/todos/:id', (req, res, nest) => {
    try {
        const Id = parseInt(req.params.id);
    const lengthBeforeDelete = todos.length;
    todos = todos.filter(t => t.id !== Id);
    if (todos.length === lengthBeforeDelete) {
        return res.status(404).json({ error: 'Todo not found' });
    }   
    res.status(204).send();
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});


app.get('/todos/completed', (req, res) => {
    try {
       const completed = todos.filter(t => t.completed);
    res.json(completed);
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

app.use(require('./errorHandle')); // Import and use the error handling middleware

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`TODO API is Live on port ${PORT}`);
});
