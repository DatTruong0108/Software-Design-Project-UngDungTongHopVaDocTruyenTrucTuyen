
const { Scraper, Root, CollectContent, OpenLinks } = require('nodejs-web-scraper');
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://truyenfull.vn';


function getSlugFromUrl(url) {
    if (url){
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/').filter(segment => segment.length > 0);
        return pathSegments[0];
    }
    else return url
   
}


class Source1 {
    async srapeHotNovelsList() {
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
                const slug=getSlugFromUrl(url);
               
                truyenDetails.push({ title, url, image ,slug});
            });
    
    
            // In ra kết quả
            return truyenDetails
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    async scrapeNewNovelsList() {
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
                const genreUrls = genreElements.map((i, el) => $(el).attr('href')).get();

                const latestChapter = $(element).find('div.col-chap a').text().trim();
                const latestChapterUrl = $(element).find('div.col-chap a').attr('href');

                const updateTime = $(element).find('div.col-time').text().trim();
                const slug=getSlugFromUrl(url)
                if (title && url){
                    truyenDetails.push({ title,
                        url,
                        genres,
                        genreUrls,
                        latestChapter,
                        latestChapterUrl,
                        updateTime,
                        slug });
                }
                
            });
            
    
            // In ra kết quả
            return truyenDetails;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async scrapeNovelInfo(slug) {
        try {
            const novelUrl=url+'/'+slug;
            // Fetch the HTML from the given URL
            const { data } = await axios.get(novelUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
                }
            });
    
            // Load the HTML into cheerio
            const $ = cheerio.load(data);
    
            // Extract novel information
            const title = $('h3.title[itemprop="name"]').text().trim();
            const image = $('img[itemprop="image"]').attr('src');
            const author = $('a[itemprop="author"]').text().trim();
            const genres = [];
            $('a[itemprop="genre"]').each((i, el) => {
                genres.push($(el).text().trim());
            });
            const source = $('.source').text().trim();
            const status = $('.text-success').text().trim();
            const ratingValue = $('span[itemprop="ratingValue"]').text().trim();
            const ratingCount = $('span[itemprop="ratingCount"]').text().trim();
            const description = $('div.desc-text[itemprop="description"]').html();
    
            // Extract chapters information
            const chapters = [];
            $('.list-chapter li a').each((i, el) => {
                const chapterTitle = $(el).text().trim();
                const chapterUrl = $(el).attr('href');
                chapters.push({ chapterTitle, chapterUrl });
            });
    
            // Return the extracted information
            return {
                title,
                image,
                author,
                genres,
                source,
                status,
                rating: {
                    value: ratingValue,
                    count: ratingCount
                },
                description,
                chapters
            };
        } catch (error) {
            console.error('Error fetching novel info:', error);
        }
    }
    
}

module.exports = new Source1;