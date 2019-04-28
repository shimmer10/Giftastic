// Initial array of topics
var topics = ["Captain Marvel", "Captain America", "Black Widow", "Scarlett Witch", "Thor", "Iron Man", "Ant Man", "Black Panther"];

// variables
var buttonsDiv = $("#buttons");
var addGIFButton = $("#add-gif");
var userEnteredTopic = $("#topic-input");

// Function for displaying movie data
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

// This function handles events where one button is clicked
addGIFButton.on("click", function () {
  event.preventDefault();
  var topic = userEnteredTopic.val().trim();
  topics.push(topic);

  renderButtons();
});

// grab topic from user choise
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

      console.log(results[i].images)
    //   <div class="card" style="width: 18rem;">
    // </div>
      var gifCard = $("<div>", { class: "card mt-25 mb-25" });
      var gifImage = $("<img>", { class: "card-img-top", src: results[i].images.fixed_height.url });
      var gifDiv = $("<div>", { class: "card-body" });
      var rating = $("<p>", { class: "card-text", text: "GIF Rating: " + results[i].rating });
 
      rating.appendTo(gifDiv);
      gifDiv.appendTo(gifCard)
      gifImage.appendTo(gifCard);
      // gifDiv.prependTo("#gifs-view");

      $("#gif-view").prepend(gifCard);
    }

  });
});


// Calling the renderButtons function to display the initial list of movies
renderButtons();
