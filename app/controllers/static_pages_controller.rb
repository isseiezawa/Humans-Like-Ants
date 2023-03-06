# frozen_string_literal: true

class StaticPagesController < ApplicationController
  skip_before_action :require_login

  def top; end

  def guide; end

  def privacy_policy; end

  def terms_of_service; end

  def inquiry; end
end
