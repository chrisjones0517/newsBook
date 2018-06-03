const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const app = express();

require('../models/Article');

const Article = mongoose.model('articles');

router.get('/', (req, res) => {
    Article.find()
        .then((articles) => {
            const news = {
                news: articles
            };
            res.render('index', news);
        });
});

router.get('/scrape', (req, res) => {
    Article.count((err, count) => {
        app.locals.countBefore = count;
    });

    rp('https://www.wsj.com', function (error, response, html) {

        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            
            $('.wsj-summary').each(function (i, element) {

                let url = $(this).parent('.wsj-card-body').parent('.wsj-card').children('.wsj-headline').children('.wsj-headline-link').attr('href');
                let summary = $(this).text();
                let headline = $(this).parent().parent().children('.wsj-headline').children('.wsj-headline-link').text();

                if (url && headline) {
                    const newArticle = {
                        heading: headline,
                        url: url,
                        summary: summary
                    };
                    new Article(newArticle)
                        .save((err) => {
                            if (err) {
                                
                            } 
                        });
                }
            });
        }
    }).then(() => {
        res.redirect('/count');
    });
});

router.get('/count', (req, res) => {
    Article.count((err, count) => {
        count;
    }).then((count) => {
        app.locals.numArticles = count - app.locals.countBefore;
        res.json({ numArticles: app.locals.numArticles });
    }).catch(err => console.log(err));
});

module.exports = router;




