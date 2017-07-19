
window.onload = function () {
	
	var indicator = document.getElementById("indicator");
	indicator.style.visibility = "hidden";
	

};


var baseName 	  = "WebBaseNew1024";
var storeName 	  = "WebBaseStore";



function getFeed(){
	var indicator = document.getElementById("indicator");
	indicator.style.visibility = "visible";
    	var width = screen.width;
    	var arr = [];
    	var i=0;
	 var FEED_URL = "http://www.3dnews.ru/news/rss/";
	 
	 
	 
	 $(document).ready(function () {
		    $.ajax({
		        type: "GET",
		        url: FEED_URL,
		        dataType: "xml",
		        error: 	 getStorage,  
		        success: xmlParser
		    });
		});

		function xmlParser(xml) {

			indicator.style.display = "none";

		    $(xml).find("item").each(function () {
		    	  var url =  $(this).find("enclosure").attr('url');
		    	 var titleTest = $(this).find("title").text();
		    	 var desc = $(this).find("description").text();
		    	 var date = $(this).find("pubDate").text()
		    	// console.log(typeof(titleTest));
		    	 // $("#rssContent").append('<div class="feed"><div class="image"><img src=' + url + ' width=' + width + 'px /><div class="title"> Title:' + $(this).find("title").text() 
			        //		+ '</div><br><div class="description">Desc: ' + $(this).find("description").text() + '</div><div class="pubDate">'+ $(this).find("pubDate").text()+ "</div></div>");					
		    	  
		    	 // $("#rssConten$(this).find("id").text()t").append('<div class="feed"><canvas class="image" id = "'+imgID+' " width ="600" height = "300"></canvas><div class="title"> Title:' + $(this).find("title").text() 
			     //  		+ '</div><br><div class="description">Desc: ' + $(this).find("description").text() + '</div><div class="pubDate">'+ $(this).find("pubDate").text()+ "</div></div>");
		    	  $("#rssContent").append('<div class="feed"><canvas class="image" id = "imgID'+i+'" width ="600" height = "300"></canvas><div class="title"> Title:' + $(this).find("title").text() 
				       		+ '</div><br><div class="description">Desc: ' + $(this).find("description").text() + '</div><div class="pubDate">'+ $(this).find("pubDate").text()+ "</div></div>");
		    	  
		    	  var imgIDtext = "imgID"+i;
		    	  
		    	  var canvasImg = document.getElementById(imgIDtext);
		    	  var x = canvasImg.getContext("2d");
		    	  var img = new Image();
		    	  img.src = url;
		    	  img.onload = function(){
		    		  x.drawImage(img, 0, 0);
		    		  //console.log("titleTest:"+titleTest);
		    		  var encodingImg = canvasImg.toDataURL();
		    		  setData(titleTest, desc, encodingImg, date); // чем плоха данная схема? переделать на передачу массива.
		    	  }
		    		          
		          i++;
		    });
		    
		    getStorage();
		}
	 
	 

		 var db = openDatabase(baseName, '1.0', 'Test DB', 2 * 1024 * 1024);
		 if(!db){alert("Failed to connect to database.");}
         var msg;
         
     	function onError( err ){
    		console.log( err )
    	}
     	
     	
         
         function setData(title_, description_, image_, pubDate_){

        	 db.transaction(function (tx) {
 tx.executeSql('CREATE TABLE IF NOT EXISTS ' + storeName + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, image TEXT, pubDate TEXT)', [],
		 null,
		 null);            

  tx.executeSql('INSERT INTO ' + storeName + ' (title, description, image, pubDate) VALUES (?, ?, ?, ?)', [title_, description_, image_, pubDate_], null, onError);
         });
         };
         
         function getStorage(){
         db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ' + storeName, [], function (tx, results) {
               var len = results.rows.length, i;
               msg = "<p>Found rows: " + len + "</p>";
               $("#rssContent").append(msg);
					
               for (i = 0; i < len; i++){
                  msg = "<p><b>" + results.rows.item(i).title + "</b></p>";
                  $("#rssContent").append(msg);
               }
            }, onError);
         });
         };
}
