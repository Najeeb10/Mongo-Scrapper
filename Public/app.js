
function addArticle(insertDiv, article){


	console.log("addArticle()");
	
	//Create a bootstrap panel for each article
	var articlePanel = $("<div>").attr({
		"data-id": article._id,
		"class": "panel panel-default"
	})


	//Create the required heading div and insert title text
	var headingDiv = $("<div>").attr({
		"class": "panel-heading"
	})

	var title = $("<h3>").attr({
		"class": "panel-title"
	})

	title.text(article.title);

	headingDiv.append(title);

	//Create a div for the article link and insert link
	var link = $("<div>").attr({
		"class": "panel-body"
	})

	link.text(article.link);

   //Append the title and link divs to the main panel
	articlePanel.append(headingDiv);
	articlePanel.append(link);

	//Add the panel to the DOM
	$(insertDiv).prepend(articlePanel);
 }



$(document).ready(function(){

	//Scrape the targeted site into the DB
	$.get("/scrape", function(data){
		console.log("get /scrape data: ", data);
	})

	
})


$("#scrapeButton").on("click", function(){
	console.log("scrapeButton")
	$.ajax('/scrape', function(data) {	


	console.log(data);

		for (var i = 0; i <= 5; i++){
			var currentArticle = data[i];
			addArticle("#articlesDiv", currentArticle);
		}
	});
})

// Save notes
$(document).on("click", "#noteButton", function(){
	var articleID = $(this).attr("data-id");
	var noteTitle = $("#newTitleInput").val();
	var noteBody = $("#newBodyInput").val();

	$.ajax({
		method: "POST",
		url: "/articles/" + articleID,
		data: {
			title: noteTitle,
			body: noteBody
		}
	}).done(function(data){
		console.log(data);
		$("#noteDiv").empty();
	});
	$("#newTitleInput").val("");
	$("#newBodyInput").val("");
});
