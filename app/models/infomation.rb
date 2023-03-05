# == Schema Information
#
# Table name: infomations
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
#  index_infomations_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Infomation < ApplicationRecord
  belongs_to :user

  validates :user, presence: true
  validates :title, presence: true, length: { maximum: 255 }
  validates :text, presence: true, length: { maximum: 65_535 }
end
