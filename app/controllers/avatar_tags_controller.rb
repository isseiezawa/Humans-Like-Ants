class AvatarTagsController < ApplicationController
  before_action :set_avatar_tag, only: %i[show]

  def show
    @tagged_users = @avatar_tag.tagged_users
  end

  def search
    query = params[:name]
    search_avatar_tags = AvatarTag.where('name LIKE ?', "%#{query}%").limit(5)
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
