# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                :bigint           not null, primary key
#  crypted_password  :string(255)
#  email             :string(255)      not null
#  gender            :integer          default("unselected"), not null
#  name              :string(255)      not null
#  role              :integer          default("general"), not null
#  salt              :string(255)
#  self_introduction :text(65535)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  twitter_id        :string(255)
#
# Indexes
#
#  index_users_on_email  (email) UNIQUE
#
FactoryBot.define do
  factory :user do
    name { 'name' }
    sequence(:email) { |n| "test-#{n}@example.com" }
    password { 'password' }
    password_confirmation { 'password' }
    self_introduction { 'hello' }
    gender { :unselected }
    role { :general }
  end
end
