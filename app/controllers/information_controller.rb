class InformationController < ApplicationController
  def index
    @informations = Information.includes(:user).order(id: :desc)
  end
end
