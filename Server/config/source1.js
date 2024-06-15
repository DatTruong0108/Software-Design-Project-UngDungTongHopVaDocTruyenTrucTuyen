
// const { Scraper, Root, CollectContent, OpenLinks } = require('nodejs-web-scraper');
const axios = require("axios");
const cheerio = require("cheerio");
const source = require("./source");
// const { options } = require('../routes/home');

const url = "https://truyenfull.vn";
console.log("s1")
source.getInstance();

function getSlugFromUrl(url) {
    if (url) {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split("/").filter(segment => segment.length > 0);
        return pathSegments[0];
    } else return url;

}

function getGenreSlugFromUrl(url) {
    if (url) {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split("/").filter(segment => segment.length > 0);
        return pathSegments[1];
    } else return url;

}

function extractChapterNumber(chapterTitle) {
    const regex = /Chương\s+(\d+)/i;
    const match = chapterTitle.match(regex);
    return match ? match[1] : null;
}


class Source1 {
    async srapeHotNovelsListByGenre(url) {
        try {
            // Gửi yêu cầu HTTP đến trang web
            const { data } = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
            });

            // Phân tích cú pháp HTML
            const $ = cheerio.load(data);

            const bookList = [];

            // Select each book item and extract the necessary information
            $("div.item").each((index, element) => {
                const title = $(element).find(".title h3").text().trim();
                const url = $(element).find("a").attr("href").trim();
                const image = $(element).find("img").attr("src").trim();
                const slug = getSlugFromUrl(url);

                bookList.push({ title, url, image, slug });
            });

            return bookList;

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async srapeHotNovelsList() {
        try {
            // Gửi yêu cầu HTTP đến trang web
            const { data } = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
            });

            // Phân tích cú pháp HTML
            const $ = cheerio.load(data);

            const truyenDetails = [];
            $("#intro-index .item").each((index, element) => {
                const title = $(element).find("h3[itemprop=\"name\"]").text().trim();
                const url = $(element).find("a[itemprop=\"url\"]").attr("href");
                const image = $(element).find("img[itemprop=\"image\"]").attr("src");
                const slug = getSlugFromUrl(url);

                truyenDetails.push({ title, url, image, slug });
            });

            // In ra kết quả
            return truyenDetails;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async scrapeNewNovelsByGenres(url) {
        try {
            // Gửi yêu cầu HTTP đến trang web với headers giả lập trình duyệt
            const { data } = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
            });

            // Phân tích cú pháp HTML
            const $ = cheerio.load(data);

            // Lấy danh sách các truyện từ thẻ list-index
            const truyenDetails = [];
            $(".row[itemscope][itemtype=\"https://schema.org/Book\"]").each((index, element) => {
                const title = $(element).find("h3[itemprop=\"name\"] a").text().trim();
                const url = $(element).find("h3[itemprop=\"name\"] a").attr("href");
                const genreElements = $(element).find("div.col-cat a[itemprop=\"genre\"]");
                const genres = genreElements.map((i, el) => $(el).text().trim()).get();
                const genreUrls = genreElements.map((i, el) => $(el).attr("href")).get();

                const latestChapter = $(element).find("div.col-chap a").text().trim();
                const latestChapterUrl = $(element).find("div.col-chap a").attr("href");

                const chapterNumber = extractChapterNumber(latestChapter);

                const updateTime = $(element).find("div.col-time").text().trim();
                const slug = getSlugFromUrl(url);
                const chapterSlug = slug + "/chuong-" + chapterNumber;
                if (title && url) {
                    truyenDetails.push({
                        title,
                        url,
                        genres,
                        genreUrls,
                        latestChapter,
                        latestChapterUrl,
                        chapterSlug,
                        updateTime,
                        slug
                    });
                }

            });

            // In ra kết quả
            return truyenDetails;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async scrapeNewNovelsList() {
        try {
            // Gửi yêu cầu HTTP đến trang web với headers giả lập trình duyệt
            const { data } = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
            });

            // Phân tích cú pháp HTML
            const $ = cheerio.load(data);

            // Lấy danh sách các truyện từ thẻ list-index
            const truyenDetails = [];
            $("#list-index .row").each((index, element) => {
                const title = $(element).find("h3[itemprop=\"name\"] a").text().trim();
                const url = $(element).find("h3[itemprop=\"name\"] a").attr("href");
                const genreElements = $(element).find("div.col-cat a[itemprop=\"genre\"]");
                const genres = genreElements.map((i, el) => $(el).text().trim()).get();
                const genreUrls = genreElements.map((i, el) => $(el).attr("href")).get();

                const latestChapter = $(element).find("div.col-chap a").text().trim();
                const latestChapterUrl = $(element).find("div.col-chap a").attr("href");

                const chapterNumber = extractChapterNumber(latestChapter);

                const updateTime = $(element).find("div.col-time").text().trim();
                const slug = getSlugFromUrl(url);
                const chapterSlug = slug + "/chuong-" + chapterNumber;
                if (title && url) {
                    truyenDetails.push({
                        title,
                        url,
                        genres,
                        genreUrls,
                        latestChapter,
                        latestChapterUrl,
                        chapterSlug,
                        updateTime,
                        slug
                    });
                }

            });

            // In ra kết quả
            return truyenDetails;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async scrapeNovelInfo(slug) {
        try {
            const novelUrl = url + "/" + slug;
            // Fetch the HTML from the given URL
            const { data } = await axios.get(novelUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
            });

            // Load the HTML into cheerio
            const $ = cheerio.load(data);
            // console.log(data)

            // Extract novel information
            const title = $("h3.title[itemprop=\"name\"]").text().trim();
            const image = $("img[itemprop=\"image\"]").attr("src");
            const author = $("a[itemprop=\"author\"]").text().trim();
            const authorUrl = $("a[itemprop=\"author\"]").attr("href");
            const totalPage = $("#total-page").val();

            const genres = [];
            $("a[itemprop=\"genre\"]").each((i, el) => {
                genres.push($(el).text().trim());
            });
            const uniqueGenres = [];
            const seen = {};
            genres.forEach((genre) => {
                const lowerCaseGenre = genre.toLowerCase();
                if (!seen[lowerCaseGenre]) {
                    seen[lowerCaseGenre] = true;
                    uniqueGenres.push(genre);
                }
            });
            const genreUrls = [];
            $("a[itemprop=\"genre\"]").each((i, el) => {
                genreUrls.push($(el).attr("href"));
            });
            // console.log(genres)

            const source = $(".source").text().trim();
            const status = $(".text-success").text().trim();
            const ratingValue = $("span[itemprop=\"ratingValue\"]").text().trim();
            const ratingCount = $("span[itemprop=\"ratingCount\"]").text().trim();
            const description = $("div.desc-text[itemprop=\"description\"]").html();

            // Extract chapters information
            const chapters = [];
            $(".list-chapter li a").each((i, el) => {
                const chapterTitle = $(el).text().trim();
                const chapterUrl = $(el).attr("href");
                const chapterSlug = slug + "/chuong-" + (i + 1);
                chapters.push({ chapterTitle, chapterUrl, chapterSlug });
            });

            // Return the extracted informatiosn
            return {
                title,
                image,
                author,
                authorUrl,
                genres: uniqueGenres,
                genreUrls,
                source,
                status,
                rating: {
                    value: ratingValue,
                    count: ratingCount
                },
                description,
                chapters,
                slug: slug,
                totalPage
            };
        } catch (error) {
            console.error("Error fetching novel info:", error);
        }
    }

    async scrapeNovelInfoByPage(slug, name, page) {
        try {
            const novelUrl = url + "/" + slug;
            // Fetch the HTML from the given URL
            const { data } = await axios.get(novelUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
            });

            // Load the HTML into cheerio
            const $ = cheerio.load(data);
            // console.log(data)

            // Extract novel information
            const title = $("h3.title[itemprop=\"name\"]").text().trim();
            const image = $("img[itemprop=\"image\"]").attr("src");
            const author = $("a[itemprop=\"author\"]").text().trim();
            const authorUrl = $("a[itemprop=\"author\"]").attr("href");
            const totalPage = $("#total-page").val();

            const genres = [];
            $("a[itemprop=\"genre\"]").each((i, el) => {
                genres.push($(el).text().trim());
            });
            const uniqueGenres = [];
            const seen = {};
            genres.forEach((genre) => {
                const lowerCaseGenre = genre.toLowerCase();
                if (!seen[lowerCaseGenre]) {
                    seen[lowerCaseGenre] = true;
                    uniqueGenres.push(genre);
                }
            });
            const genreUrls = [];
            $("a[itemprop=\"genre\"]").each((i, el) => {
                genreUrls.push($(el).attr("href"));
            });
            // console.log(genres)

            const source = $(".source").text().trim();
            const status = $(".text-success").text().trim();
            const ratingValue = $("span[itemprop=\"ratingValue\"]").text().trim();
            const ratingCount = $("span[itemprop=\"ratingCount\"]").text().trim();
            const description = $("div.desc-text[itemprop=\"description\"]").html();

            // Extract chapters information
            const chapters = [];
            $(".list-chapter li a").each((i, el) => {
                const chapterTitle = $(el).text().trim();
                const chapterUrl = $(el).attr("href");
                const chapterSlug = name + "/chuong-" + ((i + 1) + (parseInt(page) - 1) * 50);
                chapters.push({ chapterTitle, chapterUrl, chapterSlug });
            });

            // Return the extracted informatiosn
            return {
                title,
                image,
                author,
                authorUrl,
                genres: uniqueGenres,
                genreUrls,
                source,
                status,
                rating: {
                    value: ratingValue,
                    count: ratingCount
                },
                description,
                chapters,
                slug: slug,
                totalPage
            };
        } catch (error) {
            console.error("Error fetching novel info:", error);
        }
    }

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
            
    
            // Extract the story name
            const storyName = $("a.truyen-title").text().trim();

            // Extract the chapter title
            const chapterTitle = $("a.chapter-title").text().trim();
            $("#ads-chapter-pc-top").remove();

            // Extract the chapter content
            const chapterContent = $("#chapter-c")
                .html()
                .replace(/<br\s*\/?>/gi, "\n")
                .replace(/<\/?p>/gi, "")
                .trim();

            // Create the result object
            const result = {
                storyName,
                chapterTitle,
                chapterContent,
            };

            return result;
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return null;
        }
    }

    async scrapeGenres() {
        try {
            const { data } = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
            });
            const $ = cheerio.load(data);

            const genres = [];

            // Select the genre list
            $(".dropdown-menu.multi-column .row .col-md-4 ul.dropdown-menu li a").each((index, element) => {
                const genre = $(element).text().trim();
                const genreUrl = $(element).attr("href").trim();
                const slug = getGenreSlugFromUrl(genreUrl);
                genres.push({ genre, genreUrl, slug });
            });

            const danhSachList = [];

            // Selecting the appropriate list elements within the "Danh sách" dropdown
            $("li:contains(\"Danh sách\") .dropdown-menu li a").each((index, element) => {
                const title = $(element).text().trim();
                const link = $(element).attr("href").trim();
                const slug = getGenreSlugFromUrl(link);
                danhSachList.push({ title, url: link, slug });
            });

            const options = [];
            $("#hot-select option").each((index, element) => {
                const value = $(element).attr("value").trim();
                const text = $(element).text().trim();
                options.push({ value, text });
            });

            const result = { genres, danhSachList, options };
            return result;
        } catch (error) {
            console.error("Error scraping genres:", error);
            return [];
        }

    }

    async scrapeNovelByGenre(type, slug) {
        let baseUrl;
        if (type == "genre") {

            baseUrl = url + "/the-loai/" + slug;
        } else if (type == "topic") {
            baseUrl = url + "/danh-sach/" + slug;
        } else if (type == "search") {
            baseUrl = url + "/tim-kiem/" + slug;
        }

        try {
            const { data } = await axios.get(baseUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                }
            });
            const $ = cheerio.load(data);

            const novels = [];

            $(".list .row").each((index, element) => {
                const titleElement = $(element).find(".truyen-title a");
                const title = titleElement.attr("title");
                const link = titleElement.attr("href");
                const image = $(element).find("[data-image]").attr("data-image");

                if (title) {
                    const author = $(element).find(".author").text().trim();
                    const chapter = $(element).find(".text-info a").text().replace("Chương ", "").trim();
                    const slug = getSlugFromUrl(link);

                    const novel = {
                        title,
                        author,
                        link,
                        chapter,
                        image,
                        slug
                    };

                    novels.push(novel);
                }

            });

            return novels;
        } catch (error) {
            console.error("Error scraping data:", error);
            return [];
        }
    }

}



module.exports = new Source1;