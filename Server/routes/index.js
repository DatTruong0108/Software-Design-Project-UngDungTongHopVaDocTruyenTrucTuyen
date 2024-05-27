const homeRouter = require('./home');
const novelRouter=require('./novel')

function route(app){
    app.use('/:slug',novelRouter);
    app.use('/',homeRouter);  
}

module.exports=route;