class ProfilesController < ApplicationController
  before_action :set_user, only: %i[edit update destroy_avatar]

  def show
    @tweets = current_user.tweets.includes(:likes, :world_room).with_attached_image.order(id: :desc).page(params[:page]).per(3)

    render 'users/scrollable_list' if params[:page]
  end

  def edit; end

  def update
    if @user.update(user_params)
      redirect_to profile_path, success: t('.success', item: User.model_name.human)
    else
      flash.now['danger'] = t('.fail', item: User.model_name.human)
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy_avatar
    if @user.avatar.attached?
      @user.avatar.purge
      redirect_to profile_path, success: t('.success', item: User.human_attribute_name(:avatar))
    else
      redirect_to profile_path, success: t('.fail', item: User.human_attribute_name(:avatar))
    end
  end

  private

  def set_user
    @user = User.find(current_user.id)
  end

  def user_params
    params.require(:user).permit(:name, :email, :gender, :twitter_id, :self_introduction, :avatar, avatar_tags_attributes: [:name], avatar_tag_ids: [])
  end
end
