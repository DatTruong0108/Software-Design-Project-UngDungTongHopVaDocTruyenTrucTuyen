const homeRouter = require("./home");
const novelRouter = require("./novel");
const genreRouter = require("./genre");
const topicRouter = require("./topic");

function route(app) {
    app.use("/topic", topicRouter);
    app.use("/genre", genreRouter);
    app.use("/:slug", novelRouter);
    app.use("/", homeRouter);
}

module.exports = route;