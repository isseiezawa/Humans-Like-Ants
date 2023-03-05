class InformationController < ApplicationController
  skip_before_action :require_login, only: %i[index]

  def index
    @informations = Information.includes(:user).with_attached_image.order(id: :desc).page(params[:page]).per(5)
  end
end
