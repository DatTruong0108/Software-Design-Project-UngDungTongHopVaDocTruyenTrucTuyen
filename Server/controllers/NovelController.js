const Source1=require('../config/source1')

class NovelController {
    async read(req, res, next) {
        const name=req.baseUrl;
        const chapter=req.params.chapter;
        const chapterSlug=name+"/"+chapter;

        const content=await Source1.scrapeChapterData(chapterSlug);
        console.log(content)
        
        res.render("novel/read",{content})
    }
}

module.exports = new NovelController;