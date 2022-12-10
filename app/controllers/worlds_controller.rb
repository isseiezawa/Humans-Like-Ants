class WorldsController < ApplicationController
  skip_before_action :require_login

  def index
    @worlds = World.all
  end
end
