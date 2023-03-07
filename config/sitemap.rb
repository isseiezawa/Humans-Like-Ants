# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = 'https://humans-like-ants.com'

SitemapGenerator::Sitemap.create do
  # Defaults: :priority => 0.5, :changefreq => 'weekly',
  #           :lastmod => Time.now, :host => default_host

  add guide_path, :priority => 0.1, :changefreq => 'never'
  add terms_of_service_path, :priority => 0.1, :changefreq => 'never'
  add information_index_path, :priority => 0.4, :changefreq => 'daily'

  add login_path, :priority => 0.2, :changefreq => 'never'
  add new_user_path, :priority => 0.2, :changefreq => 'never'

  add worlds_path, :priority => 0.4, :changefreq => 'never'

  World.all.each do |world|
    add world_path(world.place), :priority => 0.6, :changefreq => 'never'
  end

  WorldRoom.find_each do |world_room|
    add world_room_path(world_room), :priority => 0.7, :changefreq => 'never', :lastmod => world_room.updated_at
  end

  User.find_each do |user|
    add user_path(user), :priority => 0.9, :changefreq => 'weekly', :lastmod => user.updated_at
    add likes_user_path(user), :priority => 0.6, :changefreq => 'never'
  end

  Tweet.find_each do |tweet|
    add likes_tweet_path(tweet), :priority => 0.6, :changefreq => 'never', :lastmod => tweet.updated_at
  end

  add avatar_tags_path, :priority => 0.6, :changefreq => 'never'

  AvatarTag.find_each do |avatar_tag|
    add avatar_tag_path(avatar_tag.name), :priority => 0.6, :changefreq => 'never', :lastmod => avatar_tag.updated_at
  end
end
