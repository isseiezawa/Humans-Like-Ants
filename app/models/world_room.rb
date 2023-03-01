# == Schema Information
#
# Table name: world_rooms
#
#  id         :bigint           not null, primary key
#  name       :string(255)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint
#  world_id   :integer          not null
#
# Indexes
#
#  index_world_rooms_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class WorldRoom < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions

  has_many :tweets, dependent: :destroy
  belongs_to :user
  belongs_to_active_hash :world

  validates :name, presence: true, length: { maximum: 200 }
  validates :user_id, presence: true
  validates :world_id, presence: true

  def tweets_length(page_number)
    tweets.joins(:user).select(:post, :name).page(page_number).per(5).length
  end
end
