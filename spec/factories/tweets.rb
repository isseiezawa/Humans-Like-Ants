FactoryBot.define do
  factory :tweet do
    user { nil }
    world { nil }
    post { 'MyText' }
  end
end
