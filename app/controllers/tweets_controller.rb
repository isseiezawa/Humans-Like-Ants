class TweetsController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :require_login, only: %i[likes]
  before_action :set_tweet, only: %i[likes]

  def create
    @world_room = WorldRoom.find(params[:world_room_id])
    @tweet = current_user.tweets.build(tweet_params)
    @tweet.world_room_id = @world_room.id
    @tweets = @world_room.tweets.includes(:user).order(id: :desc).page(params[:page]).per(5)
    respond_to do |format|
      if @tweet.save
        format.html { redirect_to world_room_path(@world_room) }
        format.turbo_stream { render 'posting_success' }
      else
        format.html { render 'world_rooms/show', status: :unprocessable_entity }
      end
    end
  end

  def destroy
    tweet = Tweet.find(params[:id])
    tweet.destroy!

    render turbo_stream: turbo_stream.remove(tweet)
  end

  def likes
    @liked_users = @tweet.liked_users.with_attached_avatar.order(id: :desc)
  end

  private

  def set_tweet
    @tweet = Tweet.find(params[:id])
  end

  def tweet_params
    params.require(:tweet).permit(:post, :image)
  end
end
