var http= require('http'),
    express = require('express'),
    cons = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    bodyParser = require('body-parser');
    
    
var app = express();
app.engine('html', cons.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');
app.use(bodyParser.urlencoded({
  extended: false
}));

MongoClient.connect('mongodb://localhost:27017/media', function(err,db){
    assert.equal(null, err);
    console.log('Successfully connected to Mongo');
    
    app.get('/',function(req,res){
        res.render('movie');
    });
    
    app.post('/movie', function(req,res, next){
         db.collection('movies').insertOne({'title': req.body.title, 'year': req.body.year, 'imdb': req.body.imdb});
         next();     
    });
    app.all('/movie', function(req,res,next){
        db.collection('movies').find({}).toArray(function(err, docs){
             assert.equal(null, err);
             res.render('result', {'movies': docs});                
         });
    });
    
}); 
app.listen(3000);   
console.log('Express app running on port 3000');
