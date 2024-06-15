
require('dotenv').config();
const express = require('express');
const {engine} = require('express-handlebars');
const path = require('path');
const bodyparser = require("body-parser");
const methodOverride = require("method-override");
const Handlebars = require('handlebars');
const cookieParser = require('cookie-parser');

const configs = require('././Server/config/');
const route=require("./Server/routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());
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
Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i) {
        block.data.index = i;
        block.data.first = i === 0;
        block.data.last = i === (n - 1);
        accum += block.fn(this);
    }
    return accum;
});

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: {
            extract: (a, b) => a - b,
            eachGenres: Handlebars.helpers.eachGenres,
            convertToHtml: Handlebars.helpers.convertToHtml,
            splitArray: Handlebars.helpers.splitArray,
            sum: (a, b) => Number(a) + Number(b),
            ifEqual: function (a,b, opts) {
                if (a.toString()==b.toString()) {
                  return opts.fn(this);
                }
                return opts.inverse(this);
            },
            times: Handlebars.helpers.times
        }
    })
);



app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'Client/views'));  // Sửa 'view' thành 'views'

route(app);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
