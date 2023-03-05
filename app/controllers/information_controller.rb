class InformationController < ApplicationController
  def index
    @informations = Information.includes(:user).with_attached_image.order(id: :desc)
  end
end
