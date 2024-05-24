require('dotenv').config();
const express = require('express');
const {engine} = require('express-handlebars');
const path = require('path');
const bodyparser = require("body-parser");
const methodOverride = require("method-override");

const route=require("./Server/routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use('/Client/public/image', express.static(__dirname + '/Client/public/image'));
app.use('/Client/public/js', express.static(__dirname + '/Client/public/js'));
app.use('/Client/public/css', express.static(__dirname + '/Client/public/css'));
app.use(express.static(__dirname + '/Client/public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(methodOverride('_method'));

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
        }
    })
);



app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'Client/views'));  // Sửa 'view' thành 'views'

route(app);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
