/***********************************************
 * @author Jennifer Grace
 * UNHBootCamp
 * JavaScript file for Super Hero Gif Generator
 ***********************************************/

// Initial array of topics
var topics = ["Captain Marvel", "Captain America", "Black Widow", "Scarlett Witch", "Thor", "Iron Man", "Ant Man", "Black Panther"];
var favoritesArray = [];
var action;
var isFavorite = false;

// variables
var buttonsDiv = $("#buttons");
var addGIFButton = $("#submit");
var userEnteredTopic = $("#topic-input");
var gifView = $("#gif-view");
var favoritesDiv = $(".favorites");

// Function for displaying super hero buttons
function renderButtons() {
  buttonsDiv.empty();
  for (var i = 0; i < topics.length; i++) {
    var topicButton = $("<button>")
      .addClass("btn btn-primary gif-button")
      .attr("data-name", topics[i])
      .text(topics[i]);
    buttonsDiv.append(topicButton);
  }
}

// this adds the user entered topic to the topics array
addGIFButton.on("click", function () {
  event.preventDefault();
  var topic = userEnteredTopic.val().trim();
  topics.push(topic);
  userEnteredTopic.val("");

  renderButtons();
});

// This calls the API to get the gif upon user clicking a button
$(document).on("click", ".gif-button", function () {
  var currentTopic = $(this).attr("data-name");
  var apiKey = "t96GtYlvYbboFox2HkQ71NeemLbAHcQr";
  var giphyURL = "https://api.giphy.com/v1/gifs/search?q=" + currentTopic + "&api_key=" + apiKey + "&limit=10";

  callAjax(giphyURL);
});

// this will change the gif state when user clicks it
$(document).on("click", ".gif", function () {
  var state = $(this).attr("data-state");

  if (state === "still") {
    $(this).attr("src", $(this).attr("data-animate"));
    $(this).attr("data-state", "animate");
  } else {
    $(this).attr("src", $(this).attr("data-still"));
    $(this).attr("data-state", "still");
  }
});

// allow the user to pick favorites
$(document).on("click", ".favorite", function () {
  var state = $(this).attr("data-state");
  var chosenGIF = $(this).attr("id");

  if (state === "empty") {
    $(this).removeAttr("class", "glyphicon-star-empty");
    $(this).addClass("favorite btn btn-default btn-lg glyphicon glyphicon-star")
    $(this).attr("data-state", "filled");
    action = "add";
    changeFavorites(chosenGIF, action);
  } else {
    $(this).removeAttr("class", "glyphicon-star");
    $(this).addClass("favorite btn btn-default btn-lg glyphicon glyphicon-star-empty")
    $(this).attr("data-state", "empty");
    action = "remove";
    changeFavorites(chosenGIF, action);
  }

});

function callAjax(giphyURL, isFavorite) {
  $.ajax({
    url: giphyURL,
    method: "GET"
  }).then(function (response) {

    var results = response.data;

    if (!isFavorite) {
      for (var i = 0; i < results.length; i++) {
        var currentGif = results[i];
        buildGifCards(currentGif, isFavorite);
      }
    }
    else {
      buildGifCards(results, isFavorite);
    }

  });
}

function buildGifCards(currentGif, isFavorite) {
  console.log("how about this isFavorite: " + isFavorite)
  var stillImage = currentGif.images.original_still.url;
  var movingImage = currentGif.images.fixed_height.url;
  var rating = currentGif.rating;
  var title = currentGif.title;
  var id = currentGif.id;

  if (!isFavorite) {
    var columnDiv = $("<div/>", { class: "col-lg-6" });
    var favoriteButton = $("<button>").addClass("favorite card-header btn btn-default btn-lg glyphicon glyphicon-star-empty empty")
      .attr("id", movingImage + " " + id)
      .attr("data-state", "empty");
    var gifCard = $("<div>", { class: "card mt-25 mb-25" });
    var gifImage = $("<img>").addClass("card-img-bottom gif")
      .attr("src", stillImage)
      .attr("data-state", "still")
      .attr("data-still", stillImage)
      .attr("data-animate", movingImage);
    var gifDiv = $("<div>", { class: "card-body" });
    var rating = $("<p>", { class: "card-text", text: "GIF Rating: " + rating })
    var title = $("<p>", { class: "card-text", text: "GIF Title: " + title })

    rating.appendTo(gifDiv);
    title.appendTo(gifDiv);
    favoriteButton.appendTo(gifCard);
    gifImage.appendTo(gifCard);
    gifDiv.appendTo(gifCard);
    gifCard.appendTo(columnDiv)
    gifView.prepend(columnDiv);
  }
  else {
    var favorite = $("<img>", { id: id, class: "favorite-image", src: movingImage })

    favoritesDiv.append(favorite)
  }
}

function changeFavorites(chosenGIF, action) {
  var display = chosenGIF.split(" ")[0];
  var id = chosenGIF.split(" ")[1];

  if (action === "add") {
    if (!favoritesArray.includes(display)) {
      favoritesArray.push(display)

      var apiKey = "t96GtYlvYbboFox2HkQ71NeemLbAHcQr";
      var giphyURL = "https://api.giphy.com/v1/gifs/" + id + "?api_key=" + apiKey;
      callAjax(giphyURL, true)
    }
  }
  else {
    var index = favoritesArray.indexOf(display);
    if (index !== -1) {
      favoritesArray.splice(index, 1);
      var current = "#" + id;
      $(current).remove();
    }
  }
}

// this calls the function that will render the buttons
renderButtons();
