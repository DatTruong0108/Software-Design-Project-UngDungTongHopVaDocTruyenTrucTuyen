class HomeController {
    async index(req, res, next) {
        res.sender("This is novel")
    }
}

module.exports = new HomeController;