class AvatarTagsController < ApplicationController
  before_action :set_avatar_tag, only: %i[show]
  skip_before_action :require_login, only: %i[show index search]

  def show
    @tagged_users = @avatar_tag.tagged_users.includes(:avatar_tags).with_attached_avatar
  end

  def index
    @avatar_tags = AvatarTag.includes(:tagged_users).order(id: :desc)
  end

  def search
    query = params[:name]
    search_avatar_tags = AvatarTag.where('name LIKE ?', "%#{query}%").order(id: :desc).limit(20)
    avatar_tags_name = search_avatar_tags.pluck(:name)
    render json: avatar_tags_name
  end

  private

  def set_avatar_tag
    @avatar_tag = AvatarTag.find_by!(name: params[:avatar_tag_name])
  rescue ActiveRecord::RecordNotFound
    redirect_to root_path, danger: t('activerecord.errors.messages.not_found_avatar_tags', param: params[:avatar_tag_name])
  end
end
