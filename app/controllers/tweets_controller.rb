class TweetsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    @world = World.find_by(place: params[:world_place_name])
    @tweet = current_user.tweets.build(tweet_params)
    @tweet.world_id = @world.id
    @tweets = @world.tweets.includes(:user).order(id: :desc).page(params[:page]).per(3)
    respond_to do |format|
      if @tweet.save
        format.html { redirect_to world_path(@world.place) }
        format.turbo_stream { render 'posting_success' }
      else
        format.html { render 'worlds/show', status: :unprocessable_entity }
      end
    end
  end

  def destroy
    tweet = Tweet.find(params[:id])
    tweet.destroy!

    render turbo_stream: turbo_stream.remove(tweet)
  end

  private

  def tweet_params
    params.require(:tweet).permit(:post, :image)
  end
end
