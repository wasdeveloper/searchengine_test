const request = require('request')
const express = require('express')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const app = express.Router();
const port = 3000

const useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36';

var browser;
puppeteer.launch({headless:true}).then((result)=>{ 
    console.log('Broswer Loaded') 
    browser = result;
}).catch((error)=>{
    console.log(error)
});

app.get('/piratebay/:keyword', async(req, res) => {
    const searchURL = "https://thepiratebay10.org/search/"
    const domain = "https://thepiratebay10.org"
    const keyword = req.params.keyword
    const url = searchURL + keyword.trim()
    const page = await getNewPage();
    page.setJavaScriptEnabled(false);
    await page.goto(url);
    const html = await page.content();
    if(html){
        const $ = cheerio.load(html)
        const tbody = $('tbody');
        const data = [];
        tbody.find('tr').each((index,result)=>{
            const element = $(result);
            const name = element.find('.detName').text().trim();
            const link = element.find('a:nth-child(2)').attr('href');
            data.push({name,link})
        })
        res.send(data);
    }
    else res.send("Error");
    page.close();
  })


app.get('/skidrowreloaded/:keyword', async(req, res) => {
    const searchURL = "https://www.skidrowreloaded.com/?s="
    const domain = "https://www.skidrowreloaded.com/"
    const keyword = req.params.keyword
    const url = searchURL + keyword.trim()
    const html = await getHTML(url);
    if(html){
        const $ = cheerio.load(html)
        const data = [];
        $('.post').each((index,result)=>{
            const element = $(result);
            if(checkExists(element.find('.post-excerpt'))){
                const link = element.find('h2').find('a').attr('href')
                const name = element.find('h2').text().trim()
                const image = element.find('.post-excerpt').find('a').find('img.lazy').attr('data-lazy-src')
                const meta = element.find('.meta').text().trim()
                data.push({name,link,image,meta})
            }
        })
        res.send(data);
    }
    else res.send("Error");
  })

  app.get('/yst/:keyword', async(req, res) => {
    const searchURL = "https://yts.mx/browse-movies/"
    const domain = "https://yts.mx"
    const keyword = req.params.keyword
    const url = searchURL + keyword.trim()
    const page = await getNewPage();
    page.setJavaScriptEnabled(false);
    await page.goto(url);
    const html = await page.content();
    if(html){
        const $ = cheerio.load(html)
        const data = [];
        $('.browse-movie-wrap').each((index,result)=>{
            const element = $(result);
            const link = element.find('.browse-movie-bottom').find('a').attr('href')
            const name = element.find('.browse-movie-bottom').text().trim()
            const image = element.find('img').attr('src')
            data.push({name,link,image})
        })
        res.send(data);
    }
    else res.send("Error");
  })

app.get('/1337x/:keyword', async(req, res) => {
    const searchURL = "https://1337x.to/search/"
    const domain = "https://1337x.to"
    const keyword = req.params.keyword
    const url = searchURL + keyword.trim()+"/1/"
    const page = await getNewPage();
    page.setJavaScriptEnabled(false);
    await page.goto(url);
    const html = await page.content();
    if(html){
        const $ = cheerio.load(html)
        const tbody = $('tbody')
        const data = [];
        tbody.find('tr').each((index,result)=>{
            const element = $(result);
            const link = domain + element.find('.name').find('a:nth-child(2)').attr('href')
            const name = element.find('.name').find('a:nth-child(2)').text().trim()
            data.push({name,link})
        })
        res.send(data);
    }
    else res.send("Error");
})

app.get('/genlib/:keyword', async(req, res) => {
const searchURL = "http://gen.lib.rus.ec/search.php?req="
const domain = "http://gen.lib.rus.ec/"
const postUrl = "&open=0&res=25&view=simple&phrase=1&column=def";
const keyword = req.params.keyword
const url = searchURL + keyword.trim()+postUrl
const html = await getHTML(url);
if(html){
    const $ = cheerio.load(html)
    const table = $('table.c')
    const data = [];
    $(table).find('tr').each((index,result)=>{
        if(index === 0) return
        const element = $(result);
        let author,title,link;
        $(element).find('td').each((i,r)=>{
            const e = $(r);
            if(i==1)       author = e.text().trim();
            else if(i==2)       { title = e.text() ; link = domain + e.find('a').attr('href'); }
        });
        data.push({author,title,link});
    })
    res.send(data);
}
else res.send("Error");
})

app.get('/steamunlocked/:keyword', async(req, res) => {
    const searchURL = "https://steamunlocked.net/?s="
    const domain = "https://steamunlocked.net"
    const keyword = req.params.keyword
    const url = searchURL + keyword.trim()
    const html = await getHTML(url);
    if(html){
        const $ = cheerio.load(html)
        const data = [];
        $('.blog-post').each((index,result)=>{
            const element = $(result);
            const link = element.find('.blog-content').find('a').attr('href')
            const name = element.find('.blog-content').text().trim();
            const image = element.find('img').attr('src')
            data.push({name,link,image})
        })
        res.send(data);
    }
    else res.send("Error");
  })

app.get('/vidcloud9/:keyword', async(req, res) => {
    const searchURL = "https://vidcloud9.com/search.html?keyword="
    const domain = "https://vidcloud9.com"
    const keyword = req.params.keyword
    const url = searchURL + keyword
    const html = await getHTML(url);
    if(html){
        const $ = cheerio.load(html)
        let data = [];
        $('.video-block').each((index,result)=>{
            const element = $(result).children('a');
            const link = domain+element.attr('href')
            const name = element.children('.name').text().trim();
            const meta = element.children('.meta').text().trim();
            data.push(name,link,meta)
        })
        res.send(data);
    }
    else res.send("Error");
  })

  app.get('/gogo/:keyword', async(req, res) => {
    const searchURL = "https://www26.gogoanimes.tv/search.html?keyword="
    const domain = "https://www26.gogoanimes.tv"
    const keyword = req.params.keyword
    const url = searchURL + keyword
    const page = await getNewPage();
    page.setJavaScriptEnabled(false);
    await page.goto(url);
    const html = await page.content();
    if(html){
        const $ = cheerio.load(html)
        const elementlist = $('ul.items');
        const data = [];
        $(elementlist).find('li').each((index,result)=>{
            const element = $(result)
            const name = element.find('.name').text().trim();
            const link = domain + element.find('.img').children('a').attr('href')
            const image = element.find('.img').find('img').attr('src')
            const meta = element.find('.released').text().trim();
            const node = {name,link,image,meta}
            data.push(node)
        })
        page.close();
        res.send(data);
    }
    else res.send("Error");
  })
  app.get('/youtube/:keyword', async(req, res) => {
    const domain = "https://www.youtube.com"
    const searchURL = "https://www.youtube.com/results?search_query="
    const keyword = req.params.keyword
    const url = searchURL + keyword.trim().replace(/ /g,'+');
    const page = await getNewPage();
    await page.goto(url);
    await page.waitForSelector('ytd-video-renderer', { timeout: 10000 });
    const html = await page.content();
    const $ = cheerio.load(html)
    const data = [];
    $('#contents ytd-video-renderer,#contents ytd-grid-video-renderer').each((index, result) => {
        const element = $(result)
        data.push({
            link: domain + element.find('#video-title').attr('href').trim(),
            title: element.find('#video-title').text().trim(),
            release_date: element.find('#metadata-line span:nth-child(2)').text().trim(),
        })
    });
    page.close();
    res.send(data);
})

function getHTML(url){
    const options = {
        url,
        headers: {'User-Agent': useragent}
    };
    return new Promise((res,rej)=>{
        request(options , (error,response,html)=>{
                if(error) {console.log(error);res(undefined)}
                else if(response.statusCode == 200) res(html)
                else {console.log(`ERROR status code : ${response.statusCode}`);res(undefined)}
            })
    })
}

function getNewPage(){
    return new Promise( async(res,rej)=>{
        const page = await browser.newPage();
        page.setRequestInterception(true);
        page.on('request', (req) => {
            if(req.resourceType() === 'image' 
                || req.resourceType() === 'stylesheet' 
                || req.resourceType() === 'font'
                || req.resourceType() === 'media'
                || req.resourceType () === 'fetch' ) 
                req.abort();
            else req.continue();
        });
        res(page);
    })
}

function checkExists(data){
    let a = ""+data;
    return a.trim().length > 0
}

module.exports = app;