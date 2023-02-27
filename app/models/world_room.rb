# == Schema Information
#
# Table name: world_rooms
#
#  id         :bigint           not null, primary key
#  name       :string(255)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  world_id   :integer          not null
#
class WorldRoom < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions

  has_many :tweets
  belongs_to_active_hash :world

  validates :name, presence: true, length: { maximum: 200 }
  validates :world_id, presence: true
end
