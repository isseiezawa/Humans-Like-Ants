module Admin
  class InformationController < Admin::ApplicationController
    def scoped_resource
      resource_class.with_attached_image
    end
  end
end
