class World < ActiveYaml::Base
  include ActiveHash::Associations

  set_root_path 'app/models/ActiveYaml'
  set_filename 'world'

  has_many :tweets # rubocop:disable Rails/HasManyOrHasOneDependent

  def tweets_length(page_number)
    tweets.joins(:user).select(:post, :name).page(page_number).per(3).length
  end
end
