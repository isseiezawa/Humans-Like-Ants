class WorldsController < ApplicationController
  skip_before_action :require_login
  before_action :set_world, only: %i[show]

  def show
    @tweet = Tweet.new
    @tweets = @world.tweets.to_json(only: [:post], include: {user: {only: :name}})
  end

  def index
    @worlds = World.all
  end

  private

  def set_world
    @world = World.find_by(place: params[:place_name])
  end
end
