# frozen_string_literal: true

class ApplicationController < ActionController::Base
  add_flash_types :success, :info, :warning, :danger

  before_action :require_login

  private

  # require_loginで実行するメソッド
  def not_authenticated
    redirect_to login_path, warning: t('defaults.not_authenticated')
  end
end
