const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const db = new sqlite3.Database(':memory:');
db.serialize(function () {
 db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
 db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

app.get('/', (req, res) => {
    res.sendFile('index.html')
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT title FROM user WHERE username = '${username}' AND password = '${password}'`;
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            if (rows.length > 0) {
                res.send('Login successful');
            } else {
                res.status(401).send('Invalid username or password');
            }
        }
    });
});

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});