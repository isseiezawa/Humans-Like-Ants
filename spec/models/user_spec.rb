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
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'バリデーションのテスト' do
    context 'email入力時' do
      it '空欄時にエラーが発生すること' do
        user_without_email = build(:user, email: '')
        expect(user_without_email).to be_invalid
        expect(user_without_email.errors[:email]).to eq ['を入力してください']
      end
    end

    context 'name入力時' do
      it '空欄時にエラーが発生すること' do
        user_without_name = build(:user, name: '')
        expect(user_without_name).to be_invalid # user.valid?がfalseかどうかチェック
        expect(user_without_name.errors[:name]).to eq ['を入力してください']
      end

      it '51文字以上の場合エラーが発生すること' do
        name_with_more_than_51_charactors = build(:user, name: 'a' * 51)
        expect(name_with_more_than_51_charactors).to be_invalid
        expect(name_with_more_than_51_charactors.errors[:name]).to eq ['は50文字以内で入力してください']
      end
    end

    context 'password入力時' do
      it '空欄時にエラーが発生すること' do
        user_without_password = build(:user, password: '')
        expect(user_without_password).to be_invalid
        expect(user_without_password.errors[:password]).to eq ['は8文字以上で入力してください']
      end

      it '7文字以下の場合エラーが発生すること' do
        password_less_than_7_characters = build(:user, password: 'a' * 7)
        expect(password_less_than_7_characters).to be_invalid
        expect(password_less_than_7_characters.errors[:password]).to eq ['は8文字以上で入力してください']
      end
    end

    context 'self_introduction入力時' do
      it '161文字以上の場合エラーが発生すること' do
        self_introduction_with_more_than_161_charactors = build(:user, self_introduction: 'a' * 161)
        expect(self_introduction_with_more_than_161_charactors).to be_invalid
        expect(self_introduction_with_more_than_161_charactors.errors[:self_introduction]).to eq ['は160文字以内で入力してください']
      end
    end

    context 'twitter_id入力時' do
      it '51文字以上の場合エラーが発生すること' do
        twitter_id_with_more_than_51_charactors = build(:user, twitter_id: 'a' * 51)
        expect(twitter_id_with_more_than_51_charactors).to be_invalid
        expect(twitter_id_with_more_than_51_charactors.errors[:twitter_id]).to eq ['は50文字以内で入力してください']
      end
    end
  end
end
