// server.js (continued)
// Sample user data for authentication (Replace this with a database in a real application)
const users = [
    {
        username: 'user1',
        password: 'password1',
    },
];

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
