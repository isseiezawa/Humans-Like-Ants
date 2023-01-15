# == Schema Information
#
# Table name: tweets
#
#  id         :bigint           not null, primary key
#  post       :text(65535)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#  world_id   :integer          not null
#
# Indexes
#
#  index_tweets_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Tweet < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions

  belongs_to :user
  belongs_to_active_hash :world

  has_one_attached :image

  validates :user, presence: true
  validates :world, presence: true
  validates :post, presence: true, length: { maximum: 200 }, allowed_characters: true

  def tweet_to_hash
    # to_json文字列、as_json文字列キーを持つハッシュ
    image.attached? ? as_json(methods: [:image_url], only: [:post], include: { user: { only: :name } }) : as_json(only: [:post], include: { user: { only: :name } })
  end

  def image_url
    # コントローラやビューのコンテキストの外でリンクを作成する為url_forではいけない
    Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true)
  end
end
