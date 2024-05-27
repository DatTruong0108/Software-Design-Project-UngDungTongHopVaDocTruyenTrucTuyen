const Source1=require('../config/source1')

class HomeController {
    async index(req, res, next) {
        const hotNovelsList=await Source1.srapeHotNovelsList();
        const newNovelsList=await Source1.scrapeNewNovelsList();
        const navbarList=await Source1.scrapeGenres();

        const result=await Source1.scrapeNewNovelsByGenres("https://truyenfull.vn/ajax.php?type=new_select&id=6")

        res.render("homepage",{hotNovels: hotNovelsList,newNovels:newNovelsList, genresList: navbarList.genres,hotSelect:navbarList.options, topicsList: navbarList.danhSachList})
    }

    async novelDetail(req, res, next) {
        const slug=req.params.slug;
        
        const novelDetail=await Source1.scrapeNovelInfo(slug);
        res.render("novelDetail",{novel:novelDetail})
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
}

module.exports = new HomeController;