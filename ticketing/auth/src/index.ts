import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/users/currentuser', (req, res) => {
    res.send('Hello!');
});

app.listen(3000, () => {
    console.log('Auth service listening on port', 3000);
});