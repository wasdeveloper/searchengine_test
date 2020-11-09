const request = require('request')
const express = require('express')
const cheerio = require('cheerio')
var cors = require('cors')

const app = express()
const port = 3000 || env
app.use(cors())

// const searchURL = "https://vidcloud9.com/search.html?keyword="
const searchURL = 'https://www3.watchserieshd.tv/search.html?keyword='
const domain = 'https://www3.watchserieshd.tv'

// seacrh/:keyword
app.get('/search/:keyword', (req, res) => {
  //req.params.keyword
  const keyword = req.params.keyword
  console.log(keyword)
  const url = searchURL + keyword
  request(url, (error, response, html) => {
    if (error) res.send(error)
    
    if (response.statusCode === 200) {
      console.log(200)
      const $ = cheerio.load(html)
      let data = []
      $('.video-block').each((index, result) => {
        const result_tag = $(result)
          .children('div')
          .children('div')
        const element = result_tag.children('a')
        const val = result_tag.children('img')
        const img_link = val.attr('src')
        const link = element.attr('href')
        const name = $(result)
          .children('div')
          .children('h5')
          .children('a')
          .text()
        //   const name = element.children('.name').text().trim();
        //   const meta = element.children('.meta').text().trim();
        var myObj=new Object();
        myObj.name=name;
        myObj.link="https://www3.watchserieshd.tv"+link;
        myObj.img =img_link;
        data.push(myObj);
        // const tag = `<a href="${link}" ><img src="${img_link}"/></a><br><b>${name}</b>`;
      })

      const page = `<html><body>${data}</body></html>`
      //   console.log(page);
      res.json(data)
    }
    else{
      res.json([])
    }
  })
})
app.get('/type', (req, res) => {
  var a = ['Music', 'Movies', 'Books', 'Test', 'Music', 'Movies', 'Books', 'Test', 'Test', 'Test', 'Test', 'Test']
  res.json(a)
})

app.get('/', (req, res) => {
  res.send('Helo from ')
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
