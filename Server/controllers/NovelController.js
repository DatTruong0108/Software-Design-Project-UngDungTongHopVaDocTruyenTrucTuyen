const Source1=require('../config/source1')

function extractChapterNumber(chapterTitle) {
    const regex = /chuong-(\d+)/i;
    const match = chapterTitle.match(regex);
    return match ? match[1] : null;
}

class NovelController {
    async read(req, res, next) {
        const name=req.baseUrl;
        const chapter=req.params.chapter;
        const chapterSlug=name+"/"+chapter;
        const chapterNumber=extractChapterNumber(chapter)
        

        const novelDetail=await Source1.scrapeNovelInfo(name.slice(1));   
        console.log(novelDetail)  
        const content=await Source1.scrapeChapterData(chapterSlug);



        res.cookie('currenNovel', name, { maxAge: 86400000});
        res.cookie('currenChapter', chapterNumber, { maxAge: 86400000});
        
        res.render("novel/read",{content,chapters:novelDetail.chapters,currentNovel:name, currentChapter: chapterNumber})
    }
}

module.exports = new NovelController;