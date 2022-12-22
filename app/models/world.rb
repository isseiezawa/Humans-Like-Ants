class World < ActiveYaml::Base
  include ActiveHash::Associations

  set_root_path 'app/models/ActiveYaml'
  set_filename 'world'

  has_many :tweets # rubocop:disable Rails/HasManyOrHasOneDependent
end
