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
class User < ApplicationRecord
  authenticates_with_sorcery!

  has_many :world_rooms, dependent: :destroy
  has_many :tweets, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_tweets, through: :likes, source: :tweet
  has_many :avatar_tag_maps, dependent: :destroy
  has_many :avatar_tags, through: :avatar_tag_maps
  has_many :informations, dependent: :destroy

  # avatar_tagsテーブルへの同時保存設定
  accepts_nested_attributes_for :avatar_tag_maps, allow_destroy: true
  accepts_nested_attributes_for :avatar_tags

  has_one_attached :avatar

  validates :password, length: { minimum: 8 }, if: -> { new_record? || changes[:crypted_password] }
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true, length: { maximum: 50 }, allowed_characters: true
  validates :self_introduction, length: { maximum: 160 }
  validates :twitter_id, length: { maximum: 50 }
  validates :avatar, attached_file_size: { maximum: 2.megabytes }, attached_file_type: { pattern: /^\.gltf$/i, type: 'gltf' }

  enum gender: { unselected: 0, man: 1, woman: 2 }
  enum role: { general: 0, admin: 1 }

  def avatar_to_hash
    avatar.attached? ? as_json(methods: [:avatar_url], only: [:avatar_url]) : nil
  end

  def avatar_url
    avatar.attached? ? Rails.application.routes.url_helpers.rails_blob_path(avatar, only_path: true) : nil
  end

  def own?(object)
    object.user_id == id
  end

  def like(tweet)
    liked_tweets << tweet
  rescue ActiveRecord::RecordInvalid
    false
  end

  def unlike(tweet)
    liked_tweets.destroy(tweet)
  end

  def like?(tweet_likes)
    tweet_likes.pluck(:user_id).include?(id)
  end

  # 代入関数を使用
  def avatar_tags_attributes=(avatar_tags_attributes)
    # expect {"uniq_id"=>{"name"=>"text"}}
    avatar_tags_attributes.values.uniq.each do |tag_params|
      next if tag_params['name'].blank?

      # モデル.find_or_create_by(name: 'text')
      # 条件を指定して初めの1件を取得し1件もなければ作成
      tag = AvatarTag.find_or_create_by(tag_params)

      avatar_tags << tag unless avatar_tags.exists?(name: tag.name)
    end
  end
end
