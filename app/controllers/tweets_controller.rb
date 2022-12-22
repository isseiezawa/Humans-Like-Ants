class TweetsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    tweet = Tweet.new(tweet_params)

    if tweet.save
      render json: { status: :ok, message: t('.success'), data: tweet }
    else
      render json: { status: :unprocessable_entity, message: t('.failure'), data: tweet.errors }
    end
  end

  def destroy
    tweet = Tweet.find(params[:id])

    tweet.destroy!

    render json: { status: :ok, message: t('.success') }
  end

  private

  def tweet_params
    params.require(:tweet).permit(:user_id, :world_id, :post)
  end
end
