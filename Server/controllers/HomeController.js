const { Scraper, Root, CollectContent, OpenLinks } = require('nodejs-web-scraper');
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://truyenfull.vn';

async function scrapeTruyenData() {
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


class HomeController {
    async index(req, res, next) {
        const hotNovelsList=await scrapeTruyenData();
        res.render("homepage",{hotNovels: hotNovelsList})
    }
}

module.exports = new HomeController;