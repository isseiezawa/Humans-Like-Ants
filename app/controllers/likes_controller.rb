class LikesController < ApplicationController
  def create
    tweet = Tweet.find(params[:tweet_id])
    current_user.like(tweet)
  end

  def destroy
    tweet = Tweet.find(params[:tweet_id])
    current_user.unlike(tweet)
  end
end
