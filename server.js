require('dotenv').config();
const express = require('express');
const {engine} = require('express-handlebars');
const path = require('path');
const bodyparser = require("body-parser");
const methodOverride = require("method-override");
const Handlebars = require('handlebars');

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

Handlebars.registerHelper('eachGenres', function(genres, genreUrls, options) {
    let result = '';
    for (let i = 0; i < genres.length; i++) {
        result += options.fn({ name: genres[i], url: genreUrls[i], last: i === genres.length - 1 });
    }
    return result;
});
Handlebars.registerHelper('convertToHtml', function(html) {
    // Convert HTML entities to actual characters
    let decodedHtml = new Handlebars.SafeString(html);
    decodedHtml = Handlebars.Utils.escapeExpression(decodedHtml).replace(/\n/g, '<br>');
    return decodedHtml;
});
Handlebars.registerHelper('splitArray', function(array, parts, partIndex) {
    const result = [];
    const len = Math.ceil(array.length / parts);
    for (let i = 0; i < len; i++) {
        if (array[i + len * partIndex]) {
            result.push(array[i + len * partIndex]);
        }
    }
    return result;
});

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            eachGenres: Handlebars.helpers.eachGenres,
            convertToHtml: Handlebars.helpers.convertToHtml,
            splitArray: Handlebars.helpers.splitArray

        }
    })
);



app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'Client/views'));  // Sửa 'view' thành 'views'

route(app);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
