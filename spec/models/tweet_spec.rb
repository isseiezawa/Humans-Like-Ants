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
require 'rails_helper'

RSpec.describe Tweet, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
