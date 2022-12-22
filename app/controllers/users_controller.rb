class UsersController < ApplicationController
  before_action :set_user, only: %i[show edit update destroy]
  skip_before_action :require_login, only: %i[new create]

  def show; end

  def new
    @user = User.new
  end

  def edit; end

  def create
    @user = User.new(user_params)

    if @user.save
      redirect_to login_url, success: t('.success')
    else
      flash.now[:danger] = t('.fail')
      render :new, status: :unprocessable_entity # バリデーションエラーの場合に返す(Rails7必須)
    end
  end

  def update
    if @user.update(user_params)
      redirect_to user_url(@user), success: t('.success')
    else
      flash.now[:danger] = t('.fail')
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy

    redirect_to root_url, success: t('.success')
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :gender, :role, :twitter_id)
  end
end
