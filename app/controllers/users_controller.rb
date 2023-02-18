class UsersController < ApplicationController
  before_action :set_user, only: %i[show likes]
  skip_before_action :require_login, only: %i[show new create]

  def show
    @tweets = @user.tweets.includes(:likes).with_attached_image.order(id: :desc).page(params[:page]).per(3)

    render 'scrollable_list' if params[:page]
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      redirect_to login_url, success: t('.success')
    else
      flash.now[:danger] = t('.fail')
      render :new, status: :unprocessable_entity # バリデーションエラーの場合に返す(Rails7必須)
    end
  end

  def likes
    @liked_tweets = @user.liked_tweets.includes(:user, :likes).with_attached_image.order(id: :desc)
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
