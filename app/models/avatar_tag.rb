# == Schema Information
#
# Table name: avatar_tags
#
#  id         :bigint           not null, primary key
#  name       :string(255)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_avatar_tags_on_name  (name) UNIQUE
#
class AvatarTag < ApplicationRecord
  has_many :avatar_tag_maps, dependent: :destroy
  has_many :tagged_users, through: :avatar_tag_maps, source: :user

  validates :name, presence: true, uniqueness: true
end
