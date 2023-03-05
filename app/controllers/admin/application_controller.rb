# All Administrate controllers inherit from this
# `Administrate::ApplicationController`, making it the ideal place to put
# authentication logic or other before_actions.
#
# If you want to add pagination or other controller-level concerns,
# you're free to overwrite the RESTful controller actions.
module Admin
  class ApplicationController < Administrate::ApplicationController
    add_flash_types :success, :info, :warning, :danger
    include Sorcery::Controller
    before_action :require_login
    before_action :authenticate_admin

    private

    def not_authenticated
      redirect_to login_path, warning: t('defaults.not_authenticated')
    end

    def authenticate_admin
      redirect_to root_path, warning: t('activerecord.errors.messages.not_found_admin') unless current_user.admin?
    end

    # Override this value to specify the number of elements to display at a time
    # on index pages. Defaults to 20.
    # def records_per_page
    #   params[:per_page] || 20
    # end
  end
end
