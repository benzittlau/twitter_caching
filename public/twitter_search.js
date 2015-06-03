/* HELPER FUNCTIONS */
insertTweet = function(context) {
  var source   = $("#tweet-template").html();
  var template = Handlebars.compile(source);
  var html    = template(context);

  $('.tweets').prepend(html);
};

clearTweets = function() {
  $('.tweets').empty();
}

handleTwitterResponse = function(data) {
  clearTweets();
  _.forEach(data.statuses, function(tweet) {
    var handle = "@" + tweet.user.screen_name;
    var body = tweet.text;
    insertTweet({handle: handle, body: body});
  });
};

/* END HELPER FUNCTIONS */



/* LOGGING */
$(document).ajaxSend(function( event, jqxhr, settings ) {
  /* Configure our authorization headers and a logging event */
  console.log("[AJAX] Sending ajax request for " + settings.url);
});
/* END LOGGING */


/* APPLICATION CODE */
$(document).ready(function() {
  $('#searchForm').on('submit', function() {
    // Get and clear the search term
    var data = {query: $('#twitterSearch').val()}
    $('#twitterSearch').val('');

    // Request the tweets from the API
    $.getJSON('/search', data).done(handleTwitterResponse);
  });
});
/* END APPLICATION CODE */
