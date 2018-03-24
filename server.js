// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");

var app = express();

var Article = require("./models/Article.js");
var Comment = require("./models/Comment.js");

var PORT = process.env.PORT || 3000

// Body Parser 
app.use(bodyParser.urlencoded({
  extended: false
}));

//Use public directory
app.use(express.static('public'));

var URLmongoose = process.env.MONGODB_URI || "mongodb://localhost/scrapper";
mongoose.Promise = Promise;

mongoose.connect(URLmongoose);


// Main route 
app.get("/", function(req, res) {
  res.send(index.html);
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    
    if (error) {
      console.log(error);
    }
   
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
	console.log("scrape");
  // Make a request for the news section of ycombinator
  request("https://www.bbc.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $(".module__title").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");

    
      var result = {
      	  title: title,
      	  link: link
      	};

      // If this found element had both a title and a link
      if (title && link) {

      	 Article.find({link: result.link}, function(error, articleArr){
				//If the current article is already in the database
				if(articleArr.length){
					console.log("Article skipped: ", articleArr)
				}//Otherwise, store it to the DB
				else{
				  	var scrapedArticle = new Article(result);
				  	scrapedArticle.save(function(error, doc){
				  		if (error){
				  			console.log("error: ", error);
				  		}else{
				  			console.log("new article scraped:", doc);
				  		}
				  	});
				}
			})
		};

        
        
  });

  });
  
  });  





//Retrieve all articles from the DB
app.get("/articles", function(request, response){
	Article.find({}, function(error, doc){
		if(error){
			console.log(error);
		}else{
			response.json(doc);
		}
	});
});

//Retrieve a specific article by id
app.get("/articles/:id", function(request, response){
	//Find the specific article in the DB
	Article.findOne({"_id": request.params.id})
	//Populate thehat article's comments
	.populate("comment")
	//Run the query
	.exec(function(error, doc){
		if(error){
			console.log(error);
		}else{
			response.json(doc);
		}
	});
});

//Add and replace notes
app.post("/articles/:id", function(request, response){
	//Make a new Note from the user's input
	var newNote = new Note(request.body);

	newNote.save(function(error, doc){
		if (error){
			console.log(error);
		} else{
			//Add new note/replace old note with new note
			Article.findOneAndUpdate({"_id": request.params.id}, {"note": doc._id})
			.exec(function(error, doc){
				if(error){
					console.log(error);
				} else{
					response.send(doc);
				}
			})
		}
	});
});


// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});