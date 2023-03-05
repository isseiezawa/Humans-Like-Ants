# == Schema Information
#
# Table name: information
#
#  id         :bigint           not null, primary key
#  text       :text(65535)      not null
#  title      :string(255)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_information_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Information < ApplicationRecord
  belongs_to :user

  has_one_attached :image

  validates :user, presence: true
  validates :title, presence: true, length: { maximum: 255 }
  validates :text, presence: true, length: { maximum: 65_535 }
end
