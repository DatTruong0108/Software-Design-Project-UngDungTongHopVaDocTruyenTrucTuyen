const axios = require("axios");
const cheerio = require("cheerio");
const source = require("./source");
// const { options } = require('../routes/home');

const url = "https://sstruyen.vn";
// console.log("s3");
source.getInstance();

class Source3 {
    async scrapeChapterData(slug) {
        try {
            const chapterUrl = url + slug;
            // Fetch the HTML content from the URL
            const { data } = await axios.get(chapterUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
            });

            const $ = cheerio.load(data);

            // Extract story title
            const storyName = $("div.rv-full-story-title h1.rv-full-story-title").text().trim();

            // Extract chapter title
            const chapterTitle = $("div.rv-chapt-title h2 a").text().trim();

            // Extract chapter content
            let chapterContent = "";
            $("div.content.container1").contents().each((index, element) => {
                if (element.type === "text" || element.tagName === "br") {
                    chapterContent += $(element).text().trim() + "\n";
                }
            });

            // Create the result object
            const result = {
                storyName,
                chapterTitle,
                chapterContent
            };

            return result;
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return null;
        }
    }
}

module.exports = new Source3;

