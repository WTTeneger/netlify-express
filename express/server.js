'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
// const fetch = require('node-fetch');


async function getNewsArea(account = "@amal_agishev", post_id = 'XCi4p26c0Tl') {
    let BlogState = ''
    var requestOptions = {
        method: 'GET',
        redirect: 'manual'
    };

    let a = await fetch(`https://teletype.in/${account}/${post_id}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            // получить <article>   </article>
            let article = result.match(/<article(.*?)<\/article>/g)
            // console.log(article);
            return article
        })
        .catch(error => console.log('error', error));
    return a
}

const router = express.Router();
router.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello from Express.js!</h1>');
    res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

router.get('/post', (req, res) => {
    let account = req.query.account || "@amal_agishev"
    let post_id = req.query.post_id || 'XCi4p26c0Tl'
    //     // getNewsArea(account, post_id).then((data) => {
    //     //     console.log('data', data);
    //     //     // if (!data) return res.json({ post: 'error' })
    //     //     // return res.json({ post: data[0] })
    //     // })
    res.json({
        post: {
            account: account,
            post_id: post_id
        }
    })
})

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);