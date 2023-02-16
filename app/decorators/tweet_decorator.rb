class TweetDecorator < ApplicationDecorator
  delegate_all

  def post_decorate
    post[0, 3] + (post[4] ? '...' : '')
  end
end
