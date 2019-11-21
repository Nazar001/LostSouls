const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require("multer");
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    host: "localhost",
    user: "nazar",
    password: "nazar",
    database: "lostsouls"
});

app.get('/signin/:login/:password', function (req, res) {
    var login = req.params.login;
    var password = req.params.password;
    connection.query(`SELECT * FROM staff WHERE login="${login}" AND password="${password}" LIMIT 1`, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/signup', function (req, res) {
    var item = req.body;
    var login = item.login;
    var refferal = item.refferal;
    connection.query(`SELECT * FROM staff WHERE login="${login}" LIMIT 1`, function (err, result) {
        if (!result[0]) {
            connection.query(`SELECT * FROM staff WHERE refferal="${refferal}" LIMIT 1`, function (err, result) {
                if (result[0]) {
                    connection.query('INSERT INTO staff SET ?', item, function (err, result) {
                        if (err) res.send(JSON.stringify("Reg"));
                        res.send(JSON.stringify(result.insertId));
                    });
                } else {
                    res.send(JSON.stringify("Reff"));
                }
            });
        } else {
            res.send(JSON.stringify("Login"));
        }
    });
});

let count = 1;
const upload = multer({ dest: "../src/assets/images/items/" });
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        let id = req.originalUrl.slice(8, req.originalUrl.lenght);
        var mkdirp = require('mkdirp');
        mkdirp(`../src/assets/images/items/${id}`);
        cb(null, `../src/assets/images/items/${id}`);
    },
    filename: (req, file, cb) => {
        let id = req.originalUrl.slice(8, req.originalUrl.lenght);
        let img = count + "-" + id + "-" + file.originalname;
        count++;
        cb(null, img);
        connection.query(`INSERT INTO images (url) VALUES ("${img}")`, function (err, result) {
            if (err) throw err;
            connection.query(`INSERT INTO item_images (item_id, image_id) VALUES (${id}, ${result.insertId})`, function (err, result) {
                if (err) throw err;
            });
        });
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
app.use(express.static(__dirname));
app.use(multer({ storage: storageConfig, fileFilter: fileFilter }).array('file'));
app.post("/upload/:id", upload.array('file'), function (req, res) {
    let filedata = req.body;
    count = 1;
    if (!filedata)
        res.send(JSON.stringify("Ошибка при загрузке файла"));
    else
        res.send(JSON.stringify("Товар добавлен в каталог!"));
});



app.get('/getitems', function (req, res) {
    connection.query("SELECT * FROM items", function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});



app.get('/getsearchitems/:search', function (req, res) {
    var search = req.params.search;
    connection.query(`SELECT * FROM items WHERE name LIKE '%${search}%'`, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/getitem/:id", function (req, res) {
    var id = req.params.id;
    connection.query(`SELECT * FROM items WHERE id=${id}`, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/getitemimage/:imageid", function (req, res) {
    var id = req.params.imageid;
    connection.query(`SELECT * FROM item_images WHERE item_id=${id} LIMIT 1`, function (err, result) {
        if (err) throw err;
        connection.query(`SELECT * FROM images WHERE id=${result[0].image_id} LIMIT 1`, function (err, result) {
            if (err) throw err;
            res.send(JSON.stringify(result[0].url));
        });
    });
});

app.listen(3333, function () {
    console.log('Example app listening on port 3333!');
});