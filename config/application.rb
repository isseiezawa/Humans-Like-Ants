require_relative 'boot'

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'active_storage/engine'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_mailbox/engine'
require 'action_text/engine'
require 'action_view/railtie'
require 'action_cable/engine'
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module HumansLikeAnts
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    config.i18n.default_locale = :ja
    config.time_zone = 'Tokyo'
    # DB Time zone
    config.active_record.default_timezone = :local
    # 訳文の探索場所を指示
    config.i18n.load_path += Dir[Rails.root.join('config/locales/**/*.{rb,yml}').to_s]

    # config.eager_load_paths << Rails.root.join("extras")

    config.generators do |g|
      # Don't generate system test files.
      g.system_tests = nil
      g.skip_routes true
      g.helper false
      g.test_framework :rspec,
        view_specs: false
    end
  end
end
