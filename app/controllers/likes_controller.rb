class LikesController < ApplicationController
  def create
    tweet = Tweet.find(params[:tweet_id]).decorate

    respond_to do |format|
      if current_user.like(tweet)
        format.turbo_stream { render turbo_stream: turbo_stream.replace(
            "like-button-#{tweet.id}",
            partial: 'likes/like_button',
            locals: { tweet: tweet, liked: true}
          )
        }
        format.json { render json: t('.success', name: tweet.user.name, post: tweet.post_decorate ) }
      else
        format.json { render json: t('.fail', name: tweet.user.name, post: tweet.post_decorate) }
      end
    end
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
