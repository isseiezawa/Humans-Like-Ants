# == Schema Information
#
# Table name: tweets
#
#  id         :bigint           not null, primary key
#  post       :text(65535)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_tweets_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :tweet do
    user { nil }
    world { nil }
    post { 'MyText' }
  end
end
