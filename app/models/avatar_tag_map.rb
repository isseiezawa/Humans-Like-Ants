# == Schema Information
#
# Table name: avatar_tag_maps
#
#  id            :bigint           not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  avatar_tag_id :bigint           not null
#  user_id       :bigint           not null
#
# Indexes
#
#  index_avatar_tag_maps_on_avatar_tag_id              (avatar_tag_id)
#  index_avatar_tag_maps_on_user_id                    (user_id)
#  index_avatar_tag_maps_on_user_id_and_avatar_tag_id  (user_id,avatar_tag_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (avatar_tag_id => avatar_tags.id)
#  fk_rails_...  (user_id => users.id)
#
class AvatarTagMap < ApplicationRecord
  belongs_to :user
  belongs_to :avatar_tag

  validates :user_id, presence: true, uniqueness: { scope: :avatar_tag_id }
  validates :avatar_tag_id, presence: true
end
