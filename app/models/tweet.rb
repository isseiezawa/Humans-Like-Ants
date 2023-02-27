# == Schema Information
#
# Table name: tweets
#
#  id            :bigint           not null, primary key
#  post          :text(65535)      not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint           not null
#  world_room_id :bigint           default(1), not null
#
# Indexes
#
#  index_tweets_on_user_id        (user_id)
#  index_tweets_on_world_room_id  (world_room_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#  fk_rails_...  (world_room_id => world_rooms.id)
#
class Tweet < ApplicationRecord
  belongs_to :user
  belongs_to :world_room
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user

  has_one_attached :image

  validates :user, presence: true
  validates :world_room, presence: true
  validates :post, presence: true, length: { maximum: 200 }, allowed_characters: true
  validates :image, attached_file_size: { maximum: 3.megabytes }, attached_file_type: { pattern: %r{^image/}, type: 'image' }

  def tweet_to_hash
    # to_json文字列、as_json文字列キーを持つハッシュ
    image.attached? ? as_json(methods: [:image_url], only: %i[id post], include: { user: { methods: [:avatar_url], only: %i[id name] } }) : as_json(only: %i[id post], include: { user: { methods: [:avatar_url], only: %i[id name] } })
  end

  def image_url
    # コントローラやビューのコンテキストの外でリンクを作成する為url_forではいけない
    Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true)
  end
end
