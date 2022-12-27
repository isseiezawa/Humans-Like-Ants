class TweetsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    @tweet = current_user.tweets.build(tweet_params)
    @world = World.find(@tweet.world_id)

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
    @tweet = Tweet.find(params[:id])
    @tweet.destroy!

    render json: { status: :ok, message: t('.success') }
  end

  private

  def tweet_params
    params.require(:tweet).permit(:post, :world_id, :image)
  end
end
