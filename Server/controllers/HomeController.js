const Source1=require('../config/source1')

class HomeController {
    async index(req, res, next) {
        const hotNovelsList=await Source1.srapeHotNovelsList();
        const newNovelsList=await Source1.scrapeNewNovelsList();
        const navbarList=await Source1.scrapeGenres();

        const historyList=[];
        if (req.cookies.historyList){
            const history=JSON.parse(req.cookies.historyList);

           for (const item of history){
            const novel=await Source1.scrapeNovelInfo(item.name.slice(1));
            const temp={
                title: novel.title,
                slug: novel.slug,
                chapterNumber: item.chapterNumber,
            }
            historyList.push(temp)
        };
        }


        res.render("homepage",{hotNovels: hotNovelsList,newNovels:newNovelsList, genresList: navbarList.genres,hotSelect:navbarList.options, topicsList: navbarList.danhSachList, historyList})
    }

    async novelDetail(req, res, next) {
        const slug=req.params.slug;
        const novelDetail=await Source1.scrapeNovelInfo(slug);
        let currentChapter=-1
        const novelName='/'+novelDetail.slug;
        if (req.cookies.historyList) {
            const historyList = JSON.parse(req.cookies.historyList);
            for (const item of historyList) {
                if (item.name === novelName) {
                    currentChapter= item.chapterNumber;
                }
            }
        }
       
        res.render("novelDetail",{novel:novelDetail, currentChapter})
    }

    async solve(req,res,next){
        const type=req.query.type;
        const id=req.query.id;

        const url=`https://truyenfull.vn/ajax.php?type=${type}&id=${id}`

        var result

        if (type=="hot_select"){
            result=await Source1.srapeHotNovelsListByGenre(url)
        }
        else if (type=="new_select"){ 
            result=await Source1.scrapeNewNovelsByGenres(url)
        }
        

        res.status(200).json({ success: true, hotNovels: result, newNovels: result});
    }
    async searchPost(req, res, next){
        const name = req.query.name;
        var slug = name.replace(/ /g, '+');
        const hotNovelsList=await Source1.scrapeNovelByGenre("search", "?tukhoa=" + slug);
        //const filteredNovels = hotNovelsList.filter(novel => novel.title.includes(name));
        return res.json({searchResult:hotNovelsList})
    }
    async searchGet(req, res, next){
        const name = req.query.name;
        const slug = name;
        const navbarList=await Source1.scrapeGenres();
        const novelList=await Source1.scrapeNovelByGenre("search", "?tukhoa=" + slug);

        res.render("novel/viewByGenre",{genresList: navbarList.genres, topicsList: navbarList.danhSachList, novelList})
    }
}

module.exports = new HomeController;