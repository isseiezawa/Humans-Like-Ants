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
  validates :post, presence: true, length: { maximum: 200 }
end
