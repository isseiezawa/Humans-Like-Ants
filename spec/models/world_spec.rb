# == Schema Information
#
# Table name: worlds
#
#  id         :bigint           not null, primary key
#  place      :string(255)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_worlds_on_place  (place) UNIQUE
#
require 'rails_helper'

RSpec.describe World, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
