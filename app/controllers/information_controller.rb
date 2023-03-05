class InformationController < ApplicationController
  def index
    @informations = Information.includes(:user).with_attached_image.order(id: :desc).page(params[:page]).per(5)
  end
end
