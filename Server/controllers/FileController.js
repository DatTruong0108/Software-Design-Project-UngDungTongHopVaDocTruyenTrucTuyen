const fs = require('fs');
const path = require('path');
const Source1 = require('../config/source1');
const PDF = require('pdf-lib');
const FILESAVER = require('file-saver');
const fontkit = require('fontkit');

function calculateLinesPerPage(pageHeight, margin, lineSpacing, fontSize) {
  const availableHeight = pageHeight - 2 * margin;
  const linesPerPage = Math.floor(availableHeight / (fontSize + lineSpacing));
  return linesPerPage;
}
// Hàm tách văn bản thành các dòng ngắn hơn
function splitTextIntoLines(text, font, fontSize, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testLineWidth < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

async function createPdf(name, chapter) {
  const nameSlug = name.slice(1);
  const novelDetail = await Source1.scrapeNovelInfo(nameSlug);
  //console.log(novelDetail);
  const pdfDoc = await PDF.PDFDocument.create();

  // Đăng ký fontkit với pdf-lib
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage();

  // Đường dẫn đến tệp font
  const fontPath = path.resolve(__dirname, '../../Client/public/font/Roboto-Regular.ttf');
  const boldFontPath = path.resolve(__dirname, '../../Client/public/font/Roboto-Bold.ttf');

  // Đọc font tùy chỉnh từ tệp
  const fontBytes = fs.readFileSync(fontPath);
  const boldFontBytes = fs.readFileSync(boldFontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);
  const boldFont = await pdfDoc.embedFont(boldFontBytes);

  // Đặt kích thước font
  const titleFontSize = 24;
  const authorFontSize = 18;
  const descriptionFontSize = 12;

  // Đặt vị trí ban đầu
  const { width, height } = page.getSize();
  let y = height - 50;

  // Thêm tên tác giả
  page.drawText(novelDetail.author, {
    x: 50,
    y,
    size: authorFontSize,
    font: customFont,
    color: PDF.rgb(0, 0, 0),
  });

  // Giảm y để tránh đè lên nội dung tiếp theo
  y -= 30;

  // Tải ảnh và thêm vào PDF
  const imageBytes = await fetch(novelDetail.image).then(res => res.arrayBuffer());
  const image = await pdfDoc.embedJpg(imageBytes);
  const imageDims = image.scale(0.5);

  page.drawImage(image, {
    x: 50,
    y: y - imageDims.height,
    width: imageDims.width,
    height: imageDims.height,
  });

  y -= imageDims.height + 30;

  // Thêm tiêu đề
  page.drawText(novelDetail.title, {
    x: 50,
    y,
    size: titleFontSize,
    font: customFont,
    color: PDF.rgb(0, 0, 0),
  });

  y -= 40;

  // Xử lý mô tả
  let description = novelDetail.description;
  description = description.replace(/&nbsp;/g, ' ');
  description = description.replace(/<br>/g, '\n');

  // Split description into segments to handle bold text
  const descriptionSegments = description.split(/(<\/?b>)/g);
  var currFont = customFont;
  descriptionSegments.forEach(segment => {
    if (segment === '<b>') {
      // Begin bold text
      currFont = boldFont;
    } else if (segment === '</b>') {
      // End bold text
      currFont = customFont;
    } else if (segment !== '') {
      // Normal text'
      const lines = segment.split('\n');
      lines.forEach(line => {
        const splitLines = splitTextIntoLines(line, currFont, descriptionFontSize, width - 50);
        splitLines.forEach(splitLine => {
          page.drawText(splitLine, {
            x: 50,
            y,
            size: descriptionFontSize,
            font: currFont,
            color: PDF.rgb(0, 0, 0),
          });
          y -= 15;
        })

        
      
      });
      //y-=15;
    }
  });


  if (chapter == 'All') {
    for (const chap of novelDetail.chapters) {
        //if (chap.chapterTitle == 'Chương 1: Đêm') {
            const chapterContent = await Source1.scrapeChapterData('/' + chap.chapterSlug);
            // 1. Thêm một trang PDF với nội dung là chapterTitle ở giữa trang
            let titlePage = pdfDoc.addPage();
            const splitLines = splitTextIntoLines(chapterContent.chapterTitle, boldFont, titleFontSize, width - 50);
            var hy = height/2
            splitLines.forEach(splitLine => {
                titlePage.drawText(splitLine, {
                  x: (width - boldFont.widthOfTextAtSize(splitLine, titleFontSize)) / 2,
                  y: hy,
                  size: titleFontSize,
                  font: boldFont,
                  color: PDF.rgb(0, 0, 0)
              });
              hy -= 30
            })
            //const linesPerPage = calculateLinesPerPage(height, 50, 15, descriptionFontSize);
            //console.log(linesPerPage)
            // 2. Thêm các trang PDF chứa nội dung chapterContent
            const lines = chapterContent.chapterContent.split('\n');
            const margin = 50;
            let yPosition = height - margin;

            let contentPage = pdfDoc.addPage();

            for (let line of lines) {
              const textWidth = customFont.widthOfTextAtSize(line, descriptionFontSize);
              if (yPosition - descriptionFontSize < margin) {
                contentPage = pdfDoc.addPage();
                yPosition = height - margin;
              }
              const splitLinesContent = splitTextIntoLines(line, customFont, descriptionFontSize, width - 100);
              splitLinesContent.forEach(splitLine => {
                contentPage.drawText(splitLine, {
                    x: margin,
                    y: yPosition,
                    size: descriptionFontSize,
                    font: customFont,
                    color: PDF.rgb(0, 0, 0)
                });
                yPosition -= 15
              })
              
            }
        //}
    }
  }
  else{
    const exportChapterSlug = name + '/' + chapter;
    console.log(exportChapterSlug);
    const chapterContent = await Source1.scrapeChapterData(exportChapterSlug);
    let titlePage = pdfDoc.addPage();
            const splitLines = splitTextIntoLines(chapterContent.chapterTitle, boldFont, titleFontSize, width - 50);
            var hy = height/2
            splitLines.forEach(splitLine => {
                titlePage.drawText(splitLine, {
                  x: (width - boldFont.widthOfTextAtSize(splitLine, titleFontSize)) / 2,
                  y: hy,
                  size: titleFontSize,
                  font: boldFont,
                  color: PDF.rgb(0, 0, 0)
              });
              hy -= 30
            })
            //const linesPerPage = calculateLinesPerPage(height, 50, 15, descriptionFontSize);
            //console.log(linesPerPage)
            // 2. Thêm các trang PDF chứa nội dung chapterContent
            const lines = chapterContent.chapterContent.split('\n');
            const margin = 50;
            let yPosition = height - margin;

            let contentPage = pdfDoc.addPage();

            for (let line of lines) {
              const textWidth = customFont.widthOfTextAtSize(line, descriptionFontSize);
              if (yPosition - descriptionFontSize < margin) {
                contentPage = pdfDoc.addPage();
                yPosition = height - margin;
              }
              const splitLinesContent = splitTextIntoLines(line, customFont, descriptionFontSize, width - 100);
              splitLinesContent.forEach(splitLine => {
                contentPage.drawText(splitLine, {
                    x: margin,
                    y: yPosition,
                    size: descriptionFontSize,
                    font: customFont,
                    color: PDF.rgb(0, 0, 0)
                });
                yPosition -= 15
              })
              
            }
  }


  
  // Thêm số trang vào cuối mỗi trang
  const pages = pdfDoc.getPages();
  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const fontSize = 10;
    page.drawText(`Page ${index + 1}`, {
      x: width - 50,
      y: 30,
      size: fontSize,
      font: customFont,
      color: PDF.rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdfDoc.save();
  // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  // FILESAVER.saveAs(blob, 'example.pdf');
  return pdfBytes;
}
const EPUB = require('epub-gen');
const ebookConverter = require('node-ebook-converter');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const fsSync = require('fs').promises;

const { Buffer } = require('buffer');

const fsExtra = require('fs-extra');
const tmp = require('tmp');

const generateEpubBuffer = async (options) => {
    return new Promise((resolve, reject) => {
        // Tạo một file tạm
        tmp.file({ postfix: '.epub' }, async (err, tempPath, fd, cleanupCallback) => {
            if (err) {
                return reject(err);
            }

            try {
                // Tạo EPUB và ghi vào file tạm
                await new EPUB(options, tempPath).promise;

                // Đọc nội dung file vào buffer
                const buffer = await fsExtra.readFile(tempPath);
                
                // Cleanup file tạm và resolve buffer
                cleanupCallback();
                resolve(buffer);
            } catch (error) {
                // Cleanup file tạm và reject error
                cleanupCallback();
                reject(error);
            }
        });
    });
};

async function getEpubOption(name,chapter){
  const nameSlug = name.slice(1);
  const novelDetail = await Source1.scrapeNovelInfo(nameSlug);
  let description = novelDetail.description;
  //description = description.replace(/&nbsp;/g, ' ');
  //description = description.replace(/<br>/g, '\n');
  const epubOptions = {
    title: novelDetail.title,
    author: novelDetail.author,
    cover: novelDetail.image,
    content: [],
  };
  epubOptions.content.push({
    title: "Lời Nói Đầu",
    author: "Tác giả: " + novelDetail.author,
    cover: novelDetail.image,
    data: description,
  });
  if (chapter === 'All') {
    for (const chap of novelDetail.chapters) {
      const chapterContent = await Source1.scrapeChapterData('/' + chap.chapterSlug);
      //console.log(chap.chapterSlug);
      epubOptions.content.push({
        title: chapterContent.chapterTitle,
        data: chapterContent.chapterContent.replace(/\n/g, '<br>'),
      });
    }
  } else {
    const exportChapterSlug = name + '/' + chapter;
    const chapterContent = await Source1.scrapeChapterData(exportChapterSlug);
    epubOptions.content.push({
      title: chapterContent.chapterTitle,
      data: chapterContent.chapterContent.replace(/\n/g, '<br>'),
    });
  }
  return epubOptions;
}

async function createEpub(name, chapter) {
  const epubOptions = await getEpubOption(name, chapter);
  //console.log(epubOptions);
  try {
    const buffer = await generateEpubBuffer(epubOptions);
    return buffer;
  } catch (err) {
    console.error('Error generating EPUB:', err);
    throw err; // Re-throw the error to handle it in the caller function if needed
  }
}


class FileController {
    async fileExport(req, res, next) {
      const chapterExport = req.body.chapterExport;
      const fileType = req.body.exportType;
      const currenNovel = req.body.currNovel;
      
      const filenameSlug = currenNovel.slice(1) + '-' + chapterExport;
      const filename = filenameSlug.replace(/-/g, '_');
      
      let fileBuffer;
      let contentType;
      let fileExtension;
    
      if (fileType === 'pdf') {
        const pdfBytes = await createPdf(currenNovel, chapterExport);
        fileBuffer = Buffer.from(pdfBytes);
        contentType = 'application/pdf';
        fileExtension = 'pdf';
      } else if (fileType === 'epub') {
        //const epubPath = `${filename}.epub`;
        //await createEpub(currenNovel, chapterExport);
        fileBuffer = await createEpub(currenNovel, chapterExport);
        contentType = 'application/epub+zip';
        fileExtension = 'epub';
        //fs.unlinkSync(epubPath); // Clean up the temporary file
      } else if (fileType === 'prc') {
        //const prcPath = `${filename}.mobi`;
        //await createPrc(currenNovel, chapterExport);
        fileBuffer = await createPrc(currenNovel, chapterExport);
        contentType = 'application/x-mobipocket-ebook';
        fileExtension = 'mobi';
        //fs.unlinkSync(prcPath); // Clean up the temporary file
      } else {
        return res.status(400).send('Invalid file type requested');
      }
    
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.${fileExtension}`);
      res.setHeader('Content-Type', contentType);
      res.send(fileBuffer);
    }
    
}


module.exports = new FileController;