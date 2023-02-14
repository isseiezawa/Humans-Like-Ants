class LikesController < ApplicationController
  def create
    tweet = Tweet.find(params[:tweet_id])
    current_user.like(tweet)
    render turbo_stream: turbo_stream.replace(
      "like-button-#{tweet.id}",
      partial: 'likes/like_button',
      locals: { tweet: tweet, liked: true}
    )
  end

  def destroy
    tweet = Tweet.find(params[:tweet_id])
    current_user.unlike(tweet)
    render turbo_stream: turbo_stream.replace(
      "like-button-#{tweet.id}",
      partial: 'likes/like_button',
      locals: { tweet: tweet, liked: false}
    )
  end
end
