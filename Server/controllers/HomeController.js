const { Scraper, Root, CollectContent, OpenLinks } = require('nodejs-web-scraper');
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://truyenfull.vn';

async function srapeHotNovelsList() {
    try {
        // Gửi yêu cầu HTTP đến trang web
        const { data } = await axios.get(url,{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });


        // Phân tích cú pháp HTML
        const $ = cheerio.load(data);

        const truyenDetails = [];
        $('#intro-index .item').each((index, element) => {
            const title = $(element).find('h3[itemprop="name"]').text().trim();
            const url = $(element).find('a[itemprop="url"]').attr('href');
            const image = $(element).find('img[itemprop="image"]').attr('src');
            truyenDetails.push({ title, url, image });
        });


        // In ra kết quả
        return truyenDetails
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function scrapeNewNovelsList() {
    try {
        // Gửi yêu cầu HTTP đến trang web với headers giả lập trình duyệt
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        // Phân tích cú pháp HTML
        const $ = cheerio.load(data);


        // Lấy danh sách các truyện từ thẻ list-index
        const truyenDetails = [];
        $('#list-index .row').each((index, element) => {
            const title = $(element).find('h3[itemprop="name"] a').text().trim();
            const url = $(element).find('h3[itemprop="name"] a').attr('href');
            const genreElements = $(element).find('div.col-cat a[itemprop="genre"]');
            const genres = genreElements.map((i, el) => $(el).text().trim()).get();
            const latestChapter = $(element).find('div.col-chap a').text().trim();
            const latestChapterUrl = $(element).find('div.col-chap a').attr('href');
            const updateTime = $(element).find('div.col-time').text().trim();
            if (title && url){
                truyenDetails.push({ title,
                    url,
                    genres,
                    latestChapter,
                    latestChapterUrl,
                    updateTime });
            }
            
        });

        // In ra kết quả
        return truyenDetails;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



class HomeController {
    async index(req, res, next) {
        const hotNovelsList=await srapeHotNovelsList();
        const newNovelsList=await scrapeNewNovelsList();

        res.render("homepage",{hotNovels: hotNovelsList,newNovels:newNovelsList})
    }
}

module.exports = new HomeController;