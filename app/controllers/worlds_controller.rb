class WorldsController < ApplicationController
  skip_before_action :require_login
  before_action :set_world, only: %i[show]

  def show
    @tweet = Tweet.new
    @tweets = @world.tweets.includes(:user).order(id: :desc).page(params[:page]).per(3)
  end

  def index
    @worlds = World.all
  end

  private

  def set_world
    @world = World.find_by!(place: params[:place_name])
  rescue ActiveHash::RecordNotFound
    redirect_to worlds_path, danger: t('activerecord.errors.messages.not_found_world', param: params[:place_name])
  end
end
