const { join } = require('path');
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

        let historyList = [];

        if (req.cookies.historyList) {
            historyList = JSON.parse(req.cookies.historyList);
            const existingEntry = historyList.find(item => item.name === name);
    
            if (existingEntry) {
                // Update the chapter number for the existing entry
                existingEntry.chapterNumber = chapterNumber;
            } else {
                // Add a new entry if the name does not exist in the history list
                historyList.push({ name, chapterNumber });
            }
        } else {
            // Create a new history list and add the current entry
            historyList.push({ name, chapterNumber });
        }
        
        res.cookie('historyList', JSON.stringify(historyList), { maxAge: 86400000,httpOnly: true });
       

        res.cookie('currenNovel', name, { maxAge: 86400000});
        res.cookie('currenChapter', chapterNumber, { maxAge: 86400000});
        
        res.render("novel/read",{content,chapters:novelDetail.chapters,currentNovel:name, currentChapter: chapterNumber})
    }
}

module.exports = new NovelController;