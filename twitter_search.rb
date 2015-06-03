require 'sinatra'
require 'httparty'
require 'dotenv'
require 'json'
Dotenv.load

get '/twitter_search' do
  erb :twitter_search
end

def twitter_request(url)
  options = {
    :query => {:q => params[:query]},
    :headers => {'Authorization' => "Bearer #{ENV['bearer']}"}
  }

  return HTTParty.get(url, options)
end

get '/search' do
  response = twitter_request('https://api.twitter.com/1.1/search/tweets.json')

  return response.body
end

get '/rate_limit_status' do
  response = twitter_request('https://api.twitter.com/1.1/application/rate_limit_status.json')

  limits = JSON.parse(response.body)

  return limits["resources"]["search"].to_json
end

#curl --request 'POST' 'https://api.twitter.com/oauth2/token' --header 'Authorization: Basic <token>' --header 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8' --data "grant_type=client_credentials" --verbose
#
