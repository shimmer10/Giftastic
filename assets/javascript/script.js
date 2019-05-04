/***********************************************
 * @author Jennifer Grace
 * UNHBootCamp
 * JavaScript file for Super Hero Gif Generator
 ***********************************************/

// Initial array of topics and other variables
var topics = ["Captain Marvel", "Captain America", "Black Widow", "Scarlett Witch", "Thor", "Iron Man", "Ant Man", "Black Panther"];
var favoritesArray = [];
var topic;
var action;
var isFavorite = false;
var currentTopic;
var apiKey = "t96GtYlvYbboFox2HkQ71NeemLbAHcQr";
var giphyURL; 
var state;
var chosenGIF;
var results;
var stillImage;
var movingImage;
var rating;
var title;
var id;
var display;
var index;
var current;


// html variables
var buttonsDiv = $("#buttons");
var addGIFButton = $("#submit");
var userEnteredTopic = $("#topic-input");
var gifView = $("#gif-view");
var favoritesDiv = $(".favorites");
var topicButton;
var columnDiv;
var favoriteButton;
var gifCard;
var gifImage;
var gifDiv;
var rating;
var title;
var favoriteLink;
var favorite;

// Function for displaying super hero buttons
function renderButtons() {
  buttonsDiv.empty();
  for (var i = 0; i < topics.length; i++) {
    topicButton = $("<button>")
      .addClass("btn btn-primary gif-button")
      .attr("data-name", topics[i])
      .text(topics[i]);
    buttonsDiv.append(topicButton);
  }
}

// this adds the user entered topic to the topics array
addGIFButton.on("click", function () {
  event.preventDefault();
  topic = userEnteredTopic.val().trim();
  topics.push(topic);
  userEnteredTopic.val("");

  renderButtons();
});

// This calls the API to get the gif upon user clicking a button
$(document).on("click", ".gif-button", function () {
  currentTopic = $(this).attr("data-name");
  giphyURL = "https://api.giphy.com/v1/gifs/search?q=" + currentTopic + "&api_key=" + apiKey + "&limit=10";

  callAjax(giphyURL);
});

// this will change the gif state when user clicks it
$(document).on("click", ".gif", function () {
  state = $(this).attr("data-state");

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
  state = $(this).attr("data-state");
  chosenGIF = $(this).attr("id");

  if (state === "empty") {
    $(this).removeAttr("class", "glyphicon-star-empty");
    $(this).addClass("favorite btn btn-default btn-lg glyphicon glyphicon-star");
    $(this).attr("data-state", "filled");
    action = "add";
    changeFavorites(chosenGIF, action);
  } else {
    $(this).removeAttr("class", "glyphicon-star");
    $(this).addClass("favorite btn btn-default btn-lg glyphicon glyphicon-star-empty");
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

    results = response.data;

    if (!isFavorite) {
      for (var i = 0; i < results.length; i++) {
        currentGIF = results[i];
        buildGifCards(currentGIF, isFavorite);
      }
    }
    else {
      buildGifCards(results, isFavorite);
    }
  });
}

function buildGifCards(currentGIF, isFavorite) {

  stillImage = currentGIF.images.original_still.url;
  movingImage = currentGIF.images.fixed_height.url;
  rating = currentGIF.rating;
  title = currentGIF.title;
  id = currentGIF.id;

  if (!isFavorite) {
    columnDiv = $("<div/>", { class: "col-lg-6" });
    favoriteButton = $("<button>").addClass("favorite card-header btn btn-default btn-lg glyphicon glyphicon-star-empty empty")
      .attr("id", movingImage + " " + id)
      .attr("data-state", "empty");
    gifCard = $("<div>", { class: "card mt-25 mb-25" });
    gifImage = $("<img>").addClass("card-img-bottom gif")
      .attr("src", stillImage)
      .attr("data-state", "still")
      .attr("data-still", stillImage)
      .attr("data-animate", movingImage);
    gifDiv = $("<div>", { class: "card-body" });
    rating = $("<p>", { class: "card-text", text: "GIF Rating: " + rating });
    title = $("<p>", { class: "card-text", text: "GIF Title: " + title });

    rating.appendTo(gifDiv);
    title.appendTo(gifDiv);
    favoriteButton.appendTo(gifCard);
    gifImage.appendTo(gifCard);
    gifDiv.appendTo(gifCard);
    gifCard.appendTo(columnDiv)
    gifView.prepend(columnDiv);
  }
  else {
    favoriteLink = $('<a>',{ href: movingImage, target: "_blank" });
    favorite = $("<img>")
    .attr("id", id)
    .attr("class", "favorite-image")
    .attr("src", movingImage)

    favorite.appendTo(favoriteLink);
    favoritesDiv.append(favoriteLink);
  }
}

function changeFavorites(chosenGIF, action) {
  display = chosenGIF.split(" ")[0];
  id = chosenGIF.split(" ")[1];

  if (action === "add") {
    if (!favoritesArray.includes(display)) {
      favoritesArray.push(display);

      apiKey = "t96GtYlvYbboFox2HkQ71NeemLbAHcQr";
      giphyURL = "https://api.giphy.com/v1/gifs/" + id + "?api_key=" + apiKey;
      callAjax(giphyURL, true)
    }
  }
  else {
    index = favoritesArray.indexOf(display);
    if (index !== -1) {
      favoritesArray.splice(index, 1);
      current = "#" + id;
      $(current).remove();
    }
  }
}

// this calls the function that will render the buttons
renderButtons();
