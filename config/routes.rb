# frozen_string_literal: true

# == Route Map
#
#                                   Prefix Verb   URI Pattern                                                                                       Controller#Action
#                                     root GET    /                                                                                                 static_pages#top
#                                    guide GET    /guide(.:format)                                                                                  static_pages#guide
#                         terms_of_service GET    /terms_of_service(.:format)                                                                       static_pages#terms_of_service
#                                    login GET    /login(.:format)                                                                                  user_sessions#new
#                                          POST   /login(.:format)                                                                                  user_sessions#create
#                                   logout DELETE /logout(.:format)                                                                                 user_sessions#destroy
#                        information_index GET    /information(.:format)                                                                            information#index
#                               likes_user GET    /users/:id/likes(.:format)                                                                        users#likes
#                                    users POST   /users(.:format)                                                                                  users#create
#                                 new_user GET    /users/new(.:format)                                                                              users#new
#                                     user GET    /users/:id(.:format)                                                                              users#show
#                   destroy_avatar_profile DELETE /profile/destroy_avatar(.:format)                                                                 profiles#destroy_avatar
#                             edit_profile GET    /profile/edit(.:format)                                                                           profiles#edit
#                                  profile GET    /profile(.:format)                                                                                profiles#show
#                                          PATCH  /profile(.:format)                                                                                profiles#update
#                                          PUT    /profile(.:format)                                                                                profiles#update
#                            search_worlds GET    /worlds/search(.:format)                                                                          worlds#search
#                 search_world_world_rooms GET    /worlds/:world_place_name/world_rooms/search(.:format)                                            world_rooms#search
#                        world_room_tweets POST   /world_rooms/:world_room_id/tweets(.:format)                                                      tweets#create
#                        world_world_rooms POST   /worlds/:world_place_name/world_rooms(.:format)                                                   world_rooms#create
#                               world_room GET    /world_rooms/:id(.:format)                                                                        world_rooms#show
#                                          DELETE /world_rooms/:id(.:format)                                                                        world_rooms#destroy
#                                   worlds GET    /worlds(.:format)                                                                                 worlds#index
#                                    world GET    /worlds/:place_name(.:format)                                                                     worlds#show
#                               tweet_like DELETE /tweets/:tweet_id/like(.:format)                                                                  likes#destroy
#                                          POST   /tweets/:tweet_id/like(.:format)                                                                  likes#create
#                              likes_tweet GET    /tweets/:id/likes(.:format)                                                                       tweets#likes
#                                    tweet DELETE /tweets/:id(.:format)                                                                             tweets#destroy
#                       search_avatar_tags GET    /avatar_tags/search(.:format)                                                                     avatar_tags#search
#                              avatar_tags GET    /avatar_tags(.:format)                                                                            avatar_tags#index
#                               avatar_tag GET    /avatar_tags/:avatar_tag_name(.:format)                                                           avatar_tags#show
#                              admin_users GET    /admin/users(.:format)                                                                            admin/users#index
#                                          POST   /admin/users(.:format)                                                                            admin/users#create
#                           new_admin_user GET    /admin/users/new(.:format)                                                                        admin/users#new
#                          edit_admin_user GET    /admin/users/:id/edit(.:format)                                                                   admin/users#edit
#                               admin_user GET    /admin/users/:id(.:format)                                                                        admin/users#show
#                                          PATCH  /admin/users/:id(.:format)                                                                        admin/users#update
#                                          PUT    /admin/users/:id(.:format)                                                                        admin/users#update
#                                          DELETE /admin/users/:id(.:format)                                                                        admin/users#destroy
#                             admin_tweets GET    /admin/tweets(.:format)                                                                           admin/tweets#index
#                                          POST   /admin/tweets(.:format)                                                                           admin/tweets#create
#                          new_admin_tweet GET    /admin/tweets/new(.:format)                                                                       admin/tweets#new
#                         edit_admin_tweet GET    /admin/tweets/:id/edit(.:format)                                                                  admin/tweets#edit
#                              admin_tweet GET    /admin/tweets/:id(.:format)                                                                       admin/tweets#show
#                                          PATCH  /admin/tweets/:id(.:format)                                                                       admin/tweets#update
#                                          PUT    /admin/tweets/:id(.:format)                                                                       admin/tweets#update
#                                          DELETE /admin/tweets/:id(.:format)                                                                       admin/tweets#destroy
#                        admin_world_rooms GET    /admin/world_rooms(.:format)                                                                      admin/world_rooms#index
#                                          POST   /admin/world_rooms(.:format)                                                                      admin/world_rooms#create
#                     new_admin_world_room GET    /admin/world_rooms/new(.:format)                                                                  admin/world_rooms#new
#                    edit_admin_world_room GET    /admin/world_rooms/:id/edit(.:format)                                                             admin/world_rooms#edit
#                         admin_world_room GET    /admin/world_rooms/:id(.:format)                                                                  admin/world_rooms#show
#                                          PATCH  /admin/world_rooms/:id(.:format)                                                                  admin/world_rooms#update
#                                          PUT    /admin/world_rooms/:id(.:format)                                                                  admin/world_rooms#update
#                                          DELETE /admin/world_rooms/:id(.:format)                                                                  admin/world_rooms#destroy
#                              admin_likes GET    /admin/likes(.:format)                                                                            admin/likes#index
#                                          POST   /admin/likes(.:format)                                                                            admin/likes#create
#                           new_admin_like GET    /admin/likes/new(.:format)                                                                        admin/likes#new
#                          edit_admin_like GET    /admin/likes/:id/edit(.:format)                                                                   admin/likes#edit
#                               admin_like GET    /admin/likes/:id(.:format)                                                                        admin/likes#show
#                                          PATCH  /admin/likes/:id(.:format)                                                                        admin/likes#update
#                                          PUT    /admin/likes/:id(.:format)                                                                        admin/likes#update
#                                          DELETE /admin/likes/:id(.:format)                                                                        admin/likes#destroy
#                    admin_avatar_tag_maps GET    /admin/avatar_tag_maps(.:format)                                                                  admin/avatar_tag_maps#index
#                                          POST   /admin/avatar_tag_maps(.:format)                                                                  admin/avatar_tag_maps#create
#                 new_admin_avatar_tag_map GET    /admin/avatar_tag_maps/new(.:format)                                                              admin/avatar_tag_maps#new
#                edit_admin_avatar_tag_map GET    /admin/avatar_tag_maps/:id/edit(.:format)                                                         admin/avatar_tag_maps#edit
#                     admin_avatar_tag_map GET    /admin/avatar_tag_maps/:id(.:format)                                                              admin/avatar_tag_maps#show
#                                          PATCH  /admin/avatar_tag_maps/:id(.:format)                                                              admin/avatar_tag_maps#update
#                                          PUT    /admin/avatar_tag_maps/:id(.:format)                                                              admin/avatar_tag_maps#update
#                                          DELETE /admin/avatar_tag_maps/:id(.:format)                                                              admin/avatar_tag_maps#destroy
#                        admin_avatar_tags GET    /admin/avatar_tags(.:format)                                                                      admin/avatar_tags#index
#                                          POST   /admin/avatar_tags(.:format)                                                                      admin/avatar_tags#create
#                     new_admin_avatar_tag GET    /admin/avatar_tags/new(.:format)                                                                  admin/avatar_tags#new
#                    edit_admin_avatar_tag GET    /admin/avatar_tags/:id/edit(.:format)                                                             admin/avatar_tags#edit
#                         admin_avatar_tag GET    /admin/avatar_tags/:id(.:format)                                                                  admin/avatar_tags#show
#                                          PATCH  /admin/avatar_tags/:id(.:format)                                                                  admin/avatar_tags#update
#                                          PUT    /admin/avatar_tags/:id(.:format)                                                                  admin/avatar_tags#update
#                                          DELETE /admin/avatar_tags/:id(.:format)                                                                  admin/avatar_tags#destroy
#                  admin_information_index GET    /admin/information(.:format)                                                                      admin/information#index
#                                          POST   /admin/information(.:format)                                                                      admin/information#create
#                    new_admin_information GET    /admin/information/new(.:format)                                                                  admin/information#new
#                   edit_admin_information GET    /admin/information/:id/edit(.:format)                                                             admin/information#edit
#                        admin_information GET    /admin/information/:id(.:format)                                                                  admin/information#show
#                                          PATCH  /admin/information/:id(.:format)                                                                  admin/information#update
#                                          PUT    /admin/information/:id(.:format)                                                                  admin/information#update
#                                          DELETE /admin/information/:id(.:format)                                                                  admin/information#destroy
#                               admin_root GET    /admin(.:format)                                                                                  admin/users#index
#                                          GET    /*path(.:format)                                                                                  application#routing_error
#         turbo_recede_historical_location GET    /recede_historical_location(.:format)                                                             turbo/native/navigation#recede
#         turbo_resume_historical_location GET    /resume_historical_location(.:format)                                                             turbo/native/navigation#resume
#        turbo_refresh_historical_location GET    /refresh_historical_location(.:format)                                                            turbo/native/navigation#refresh
#            rails_postmark_inbound_emails POST   /rails/action_mailbox/postmark/inbound_emails(.:format)                                           action_mailbox/ingresses/postmark/inbound_emails#create
#               rails_relay_inbound_emails POST   /rails/action_mailbox/relay/inbound_emails(.:format)                                              action_mailbox/ingresses/relay/inbound_emails#create
#            rails_sendgrid_inbound_emails POST   /rails/action_mailbox/sendgrid/inbound_emails(.:format)                                           action_mailbox/ingresses/sendgrid/inbound_emails#create
#      rails_mandrill_inbound_health_check GET    /rails/action_mailbox/mandrill/inbound_emails(.:format)                                           action_mailbox/ingresses/mandrill/inbound_emails#health_check
#            rails_mandrill_inbound_emails POST   /rails/action_mailbox/mandrill/inbound_emails(.:format)                                           action_mailbox/ingresses/mandrill/inbound_emails#create
#             rails_mailgun_inbound_emails POST   /rails/action_mailbox/mailgun/inbound_emails/mime(.:format)                                       action_mailbox/ingresses/mailgun/inbound_emails#create
#           rails_conductor_inbound_emails GET    /rails/conductor/action_mailbox/inbound_emails(.:format)                                          rails/conductor/action_mailbox/inbound_emails#index
#                                          POST   /rails/conductor/action_mailbox/inbound_emails(.:format)                                          rails/conductor/action_mailbox/inbound_emails#create
#        new_rails_conductor_inbound_email GET    /rails/conductor/action_mailbox/inbound_emails/new(.:format)                                      rails/conductor/action_mailbox/inbound_emails#new
#       edit_rails_conductor_inbound_email GET    /rails/conductor/action_mailbox/inbound_emails/:id/edit(.:format)                                 rails/conductor/action_mailbox/inbound_emails#edit
#            rails_conductor_inbound_email GET    /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                                      rails/conductor/action_mailbox/inbound_emails#show
#                                          PATCH  /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                                      rails/conductor/action_mailbox/inbound_emails#update
#                                          PUT    /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                                      rails/conductor/action_mailbox/inbound_emails#update
#                                          DELETE /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                                      rails/conductor/action_mailbox/inbound_emails#destroy
# new_rails_conductor_inbound_email_source GET    /rails/conductor/action_mailbox/inbound_emails/sources/new(.:format)                              rails/conductor/action_mailbox/inbound_emails/sources#new
#    rails_conductor_inbound_email_sources POST   /rails/conductor/action_mailbox/inbound_emails/sources(.:format)                                  rails/conductor/action_mailbox/inbound_emails/sources#create
#    rails_conductor_inbound_email_reroute POST   /rails/conductor/action_mailbox/:inbound_email_id/reroute(.:format)                               rails/conductor/action_mailbox/reroutes#create
# rails_conductor_inbound_email_incinerate POST   /rails/conductor/action_mailbox/:inbound_email_id/incinerate(.:format)                            rails/conductor/action_mailbox/incinerates#create
#                       rails_service_blob GET    /rails/active_storage/blobs/redirect/:signed_id/*filename(.:format)                               active_storage/blobs/redirect#show
#                 rails_service_blob_proxy GET    /rails/active_storage/blobs/proxy/:signed_id/*filename(.:format)                                  active_storage/blobs/proxy#show
#                                          GET    /rails/active_storage/blobs/:signed_id/*filename(.:format)                                        active_storage/blobs/redirect#show
#                rails_blob_representation GET    /rails/active_storage/representations/redirect/:signed_blob_id/:variation_key/*filename(.:format) active_storage/representations/redirect#show
#          rails_blob_representation_proxy GET    /rails/active_storage/representations/proxy/:signed_blob_id/:variation_key/*filename(.:format)    active_storage/representations/proxy#show
#                                          GET    /rails/active_storage/representations/:signed_blob_id/:variation_key/*filename(.:format)          active_storage/representations/redirect#show
#                       rails_disk_service GET    /rails/active_storage/disk/:encoded_key/*filename(.:format)                                       active_storage/disk#show
#                update_rails_disk_service PUT    /rails/active_storage/disk/:encoded_token(.:format)                                               active_storage/disk#update
#                     rails_direct_uploads POST   /rails/active_storage/direct_uploads(.:format)                                                    active_storage/direct_uploads#create

Rails.application.routes.draw do
  root 'static_pages#top'
  get 'guide', to: 'static_pages#guide'
  get 'terms_of_service', to: 'static_pages#terms_of_service'

  get 'login', to: 'user_sessions#new'
  post 'login', to: 'user_sessions#create'
  delete 'logout', to: 'user_sessions#destroy'

  resources :information, only: %i[index]

  resources :users, only: %i[show new create] do
    get :likes, on: :member
  end

  resource :profile, only: %i[show edit update] do
    delete :destroy_avatar, on: :collection
  end

  resources :worlds, only: %i[show index], param: 'place_name' do
    get :search, on: :collection
    resources :world_rooms, only: %i[show create destroy], shallow: true do
      get :search, on: :collection
      resources :tweets, only: %i[create]
    end
  end

  resources :tweets, only: %i[destroy] do
    resource :like, only: %i[create destroy]
    get :likes, on: :member
  end

  resources :avatar_tags, only: %i[show index], param: 'avatar_tag_name' do
    get :search, on: :collection
  end

  namespace :admin do
    resources :users
    resources :tweets
    resources :world_rooms
    resources :likes
    resources :avatar_tag_maps
    resources :avatar_tags
    resources :information

    root to: 'users#index'
  end

  get '*path', to: 'application#routing_error', constraints: lambda { |req|
    # 'rails/active_storage'が含まれているパスは対象外にする
    req.path.exclude? 'rails/active_storage'
  }
end
