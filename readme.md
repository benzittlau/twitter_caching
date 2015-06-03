# Introduction
This is a demo application setup to be used as a test bench for experimenting with caching in a single page javascript application.  It uses the twitter API (proxied through a sinatra server) as the API to experiment with.

# Usage
You'll need to get a twitter API bearer token to authenticate your requests, and place it in a .env file:

```
bearer=<your_token>
```

Run a bundle install to install dependencies.

```
bundle install
```


Finally start sinatra:

```
ruby twitter_search.rb
```

The app should be available at [http://127.0.0.1:4567]!
