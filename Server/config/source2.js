// const { Scraper, Root, CollectContent, OpenLinks } = require('nodejs-web-scraper');
const axios = require("axios");
const cheerio = require("cheerio");
const source = require("./source");
// const { options } = require('../routes/home');

const url = "https://truyen.tangthuvien.vn";
console.log("s2")
source.getInstance();

class Source2 {
    async scrapeChapterData(slug) {
        try {
            const chapterUrl = url + "/doc-truyen" + slug;
            // Fetch the HTML content from the URL
            const { data } = await axios.get(chapterUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
            });

            // Load the HTML content into cheerio
            const $ = cheerio.load(data);

            // Extract the chapter title
            const title = $("h5 a").text().trim();

            // Extract the chapter content
            const contentDiv = $(".box-chap");
            let content = "";

            if (contentDiv.length) {
                contentDiv.contents().each((index, element) => {
                    if (element.type === "text") {
                        content += $(element).text();
                    } else if (element.name === "br") {
                        content += "\n";
                    } else {
                        content += $(element).text().trim() + "\n";
                    }
                });
            }
            const result = {
                chapterTitle: title,
                chapterContent: content
            };

            return result;
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return null;
        }
    }
}




module.exports = new Source2;

