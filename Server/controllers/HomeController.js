const Source1=require('../config/source1')

class HomeController {
    async index(req, res, next) {
        const hotNovelsList=await Source1.srapeHotNovelsList();
        const newNovelsList=await Source1.scrapeNewNovelsList();

        res.render("homepage",{hotNovels: hotNovelsList,newNovels:newNovelsList})
    }

    async novelDetail(req, res, next) {
        const slug=req.params.slug;
        const novelDetail=await Source1.scrapeNovelInfo(slug);
        res.render("novelDetail",{novel:novelDetail})
    }
}

module.exports = new HomeController;