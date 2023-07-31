// server.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3030;

const users = [
    {
        username: 'user1',
        password: 'password1',
    },
];

// Secret key for JWT (You should keep this secret in a real application)
const secretKey = 'your_secret_key_here';

app.use(bodyParser.json());

// Sample transient data for friends (Replace this with a database in a real application)
let friends = [];

// Middleware to verify JWT token for authorized access
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log("NOOO")
            return res.sendStatus(403);
        }

        req.user = user;
        console.log("YAAY")
        next();
    });
}

// API endpoint to add a friend
app.post('/api/friends', authenticateToken, (req, res) => {
    const { firstName, lastName, email, dateOfBirth } = req.body;

    if (!firstName || !lastName || !email || !dateOfBirth) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const friend = { firstName, lastName, email, dateOfBirth };
    friends.push(friend);
    return res.status(201).json(friend);
});

// API endpoint to retrieve all friends
app.get('/api/friends', authenticateToken, (req, res) => {
    return res.json(friends);
});

// API endpoint to update a friend's details
app.put('/api/friends/:email', authenticateToken, (req, res) => {
    const email = req.params.email;
    const { firstName, lastName, dateOfBirth } = req.body;

    const friend = friends.find((friend) => friend.email === email);

    if (!friend) {
        return res.status(404).json({ message: 'Friend not found.' });
    }

    friend.firstName = firstName || friend.firstName;
    friend.lastName = lastName || friend.lastName;
    friend.dateOfBirth = dateOfBirth || friend.dateOfBirth;

    return res.json(friend);
});

// API endpoint to delete a friend
app.delete('/api/friends/:email', authenticateToken, (req, res) => {
    const email = req.params.email;
    friends = friends.filter((friend) => friend.email !== email);
    return res.json({ message: 'Friend deleted successfully.' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// server.js (continued)
// Sample user data for authentication (Replace this with a database in a real application)

// API endpoint for user login and issue JWT token
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find((user) => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Create and sign JWT token
    const token = jwt.sign({ username }, secretKey);

    return res.json({ token });
});

// server.js (continued)
// API endpoint for user signup
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingUser = users.find((user) => user.username === username);

    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    // Add the new user to the users array
    const newUser = { username, password };
    users.push(newUser);

    // Create and sign JWT token for the new user
    const token = jwt.sign({ username }, secretKey);

    return res.status(201).json({ message: 'User created successfully.', token });
});
