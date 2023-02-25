class AvatarTagsController < ApplicationController

  def search
    query = params[:name]
    search_avatar_tags = AvatarTag.where('name LIKE ?', "%#{query}%").limit(5)
    avatar_tags_name = search_avatar_tags.pluck(:name)
    render json: avatar_tags_name
  end
end
