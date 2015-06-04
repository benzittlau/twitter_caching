/* #################### HELPER FUNCTIONS #################### */
insertTweet = function(context) {
  var source   = $("#tweet-template").html();
  var template = Handlebars.compile(source);
  var html    = template(context);

  $('.tweets').prepend(html);
};

clearTweets = function() {
  $('.tweets').empty();
}

insertTweetDetails = function(context) {
  var source   = $("#tweet-details-template").html();
  var template = Handlebars.compile(source);
  var html    = template(context);

  $('.tweetDetails').prepend(html);
};

clearTweetDetails = function() {
  $('.tweetDetails').empty();
}

handleSearchResponse = function(data) {
  clearTweets();
  _.forEach(data.statuses, function(tweet) {
    var handle = "@" + tweet.user.screen_name;
    var body = tweet.text;
    var id = tweet.id_str;
    insertTweet({handle: handle, body: body, id: id});
  });
};

handleTweetResponse = function(tweet) {
  clearTweetDetails();
  var handle = "@" + tweet.user.screen_name;
  var name = tweet.user.name;
  var created_at = tweet.created_at;
  var body = tweet.text;
  var id = tweet.id_str;
  insertTweetDetails({
    handle: handle,
    name: name,
    created_at: created_at,
    body: body,
    id: id
  });
};

log = function(statement) {
  console.log(statement);
  $('.logger').text(statement);
}

/* #################### END HELPER FUNCTIONS #################### */



/* #################### LOGGING #################### */
$(document).ajaxSend(function( event, jqxhr, settings ) {
  /* Configure our authorization headers and a logging event */
  log("[AJAX] Sending ajax request for " + settings.url);
});
/* #################### END LOGGING #################### */


/* #################### APPLICATION CODE #################### */
$(document).ready(function() {
  $('#searchForm').on('submit', function() {
    // Get and clear the search term
    var data = {query: $('#twitterSearch').val()}
    $('#twitterSearch').val('');

    // Request the tweets from the API
    $.getJSON('/search', data).done(handleSearchResponse);

    return false;
  });

  $('.tweets').on('click', '.tweet', function(e) {
    // Get and clear the search term
    var tweet = $(e.currentTarget);
    var data = {id: tweet.data('id')}

    // Request the tweet from the API
    $.getJSON('/tweet', data).done(handleTweetResponse);

    return false;
  });
});
/* #################### END APPLICATION CODE #################### */
