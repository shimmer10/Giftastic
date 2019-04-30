// Initial array of topics
var topics = ["Captain Marvel", "Captain America", "Black Widow", "Scarlett Witch", "Thor", "Iron Man", "Ant Man", "Black Panther"];

// variables
var buttonsDiv = $("#buttons");
var addGIFButton = $("#submit");
var userEnteredTopic = $("#topic-input");

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

  renderButtons();
});

// This calls the API to get the gif upon user clicking a button
$(document).on("click", ".gif-button", function () {
  var currentTopic = $(this).attr("data-name");
  var apiKey = "t96GtYlvYbboFox2HkQ71NeemLbAHcQr";
  var giphyURL = "https://api.giphy.com/v1/gifs/search?q=" + currentTopic + "&api_key=" + apiKey + "&limit=10";

  $.ajax({
    url: giphyURL,
    method: "GET"
  }).then(function (response) {

    var results = response.data;

    for (var i = 0; i < results.length; i++) {

      var stillImage = results[i].images.original_still.url;
      var movingImage = results[i].images.fixed_height.url;
      var rating = results[i].rating;
      var title = results[i].title;

      var gifCard = $("<div>", { class: "card mt-25 mb-25" });
      var gifImage = $("<img>").addClass("card-img-bottom gif")
      .attr("src", stillImage)
      .attr("data-state", "still")
      .attr("data-still", stillImage)
      .attr("data-animate", movingImage);
      var gifDiv = $("<div>", { class: "card-body" });
      var rating = $("<p>", { class: "card-text", text: "GIF Rating: " + rating })
      var title = $("<p>", { class: "card-text", text: "GIF Title: " + title })
      var favoriteButton = $("<button>").addClass("btn btn-default btn-lg glyphicon glyphicon-star-empty empty")
      .attr("id", "favorite")
      .attr("data-state", "empty");

      rating.appendTo(gifDiv);
      title.appendTo(gifDiv);
      favoriteButton.appendTo(gifCard);
      gifImage.appendTo(gifCard);
      gifDiv.appendTo(gifCard);
      $("#gif-view").prepend(gifCard);
    }
  });
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
$(document).on("click", "#favorite", function () {
  var state = $(this).attr("data-state");

  if (state === "empty") {
    $(this).removeAttr("class", "glyphicon-star-empty");
    $(this).addClass("btn btn-default btn-lg glyphicon glyphicon-star")
    $(this).attr("data-state", "filled");
  } else {
    $(this).removeAttr("class", "glyphicon-star");
    $(this).addClass("btn btn-default btn-lg glyphicon glyphicon-star-empty")
    $(this).attr("data-state", "empty");
  }
});


// this calls the function that will render the buttons
renderButtons();
