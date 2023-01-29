# frozen_string_literal: true

class ApplicationController < ActionController::Base
  add_flash_types :success, :info, :warning, :danger

  unless Rails.env.development?
    rescue_from ActiveRecord::RecordNotFound, with: :render404
    rescue_from ActiveHash::RecordNotFound, with: :render404
    rescue_from ActionController::RoutingError, with: :render404
  end

  before_action :require_login

  def routing_error
    raise ActionController::RoutingError, params
  end

  private

  # require_loginで実行するメソッド
  def not_authenticated
    redirect_to login_path, warning: t('defaults.not_authenticated')
  end

  def render404
    render 'errors/404', status: :not_found
  end
end
