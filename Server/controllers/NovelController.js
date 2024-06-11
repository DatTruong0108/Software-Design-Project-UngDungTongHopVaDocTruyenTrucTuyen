const { join } = require('path');
const Source1=require('../config/source1')
const Source2=require('../config/source2')

function extractChapterNumber(chapterTitle) {
    const regex = /chuong-(\d+)/i;
    const match = chapterTitle.match(regex);
    return match ? match[1] : null;
}

class NovelController {
    async genre(req, res, next) {
        const slug=req.params.name;
        const navbarList=await Source1.scrapeGenres();
        const novelList=await Source1.scrapeNovelByGenre("genre",slug)

        res.render("novel/viewByGenre",{genresList: navbarList.genres, topicsList: navbarList.danhSachList, novelList})
    }

    async topic(req, res, next) {
        const slug=req.params.name;
        const navbarList=await Source1.scrapeGenres();
        const novelList=await Source1.scrapeNovelByGenre("topic",slug)

        res.render("novel/viewByGenre",{genresList: navbarList.genres, topicsList: navbarList.danhSachList, novelList})
    }
    
    async read(req, res, next) {
        let server=req.query.server;
        const name=req.baseUrl;
        const chapter=req.params.chapter;
        const chapterSlug=name+"/"+chapter;
        const chapterNumber=extractChapterNumber(chapter)
        let content

        const novelDetail=await Source1.scrapeNovelInfo(name.slice(1));    
        if (!isNaN(parseInt(server))){
            if (parseInt(server)==1){
                content=await Source1.scrapeChapterData(chapterSlug);
            }
            else if (parseInt(server)==2){
                content=await Source2.scrapeChapterData(chapterSlug);
            }
        }
        else{
            content=await Source1.scrapeChapterData(chapterSlug);
        }
       
        //console.log(chapterSlug);
        //console.log(content);
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
        if (isNaN(server)){
            server=1
        }
        
        res.render("novel/read",{server,baseUrl: chapterSlug,title:novelDetail.title,content,chapters:novelDetail.chapters,currentNovel:name, currentChapter: chapterNumber})
    }
}

module.exports = new NovelController;