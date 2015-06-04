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

handleSearchResponse = function(data, cacheTweets) {
  clearTweets();
  clearTweetDetails();
  _.forEach(data.statuses, function(tweet) {
    var handle = "@" + tweet.user.screen_name;
    var body = tweet.text;
    var id = tweet.id_str;
    insertTweet({handle: handle, body: body, id: id});

    if(cacheTweets) {
      key = '/tweet/' + JSON.stringify({id: id});
      TwitterCache.inject(key, tweet);
    }
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
    TwitterCache.getResource('/search', data, handleSearchResponse);

    return false;
  });

  $('.tweets').on('click', '.tweet', function(e) {
    // Get and clear the search term
    var tweet = $(e.currentTarget);
    var data = {id: tweet.data('id')}

    // Request the tweet from the API
    TwitterCache.getResource('/tweet', data, handleTweetResponse);

    return false;
  });
});
/* #################### END APPLICATION CODE #################### */

/* #################### CACHING CODE #################### */
var TwitterCache = {
  cache: {},
  getResource: function(url, data, callback) {
    key = url + "/" + JSON.stringify(data);
    if(this.cache[key]) {
      log("[CACHE] Blocked ajax request for " + url);
      callback(this.cache[key].payload, false);
    } else {
      $.getJSON(url, data).done(function(data) {
        TwitterCache.handleResponse(key, data, callback);
      });
    }
  },

  inject: function(key, payload) {
    console.log("Caching " + key);
    console.log(payload);
    this.cache[key] = {
      timestamp: Date.now,
      payload: payload
    }
  },

  handleResponse: function(key, data, callback) {
    this.inject(key, data);

    callback(data, true);
  }
}
/* #################### END CACHING CODE #################### */
