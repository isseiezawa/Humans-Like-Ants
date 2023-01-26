class UserDecorator < ApplicationDecorator
  delegate_all

  def to_twitter_url
    twitter_id? ? "https://twitter.com/#{twitter_id}" : nil
  end
end
