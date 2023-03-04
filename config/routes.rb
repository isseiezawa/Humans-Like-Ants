# frozen_string_literal: true

# == Route Map
#
#                                   Prefix Verb   URI Pattern                                                                                       Controller#Action
#                                     root GET    /                                                                                                 static_pages#top
#                                    login GET    /login(.:format)                                                                                  user_sessions#new
#                                          POST   /login(.:format)                                                                                  user_sessions#create
#                                   logout DELETE /logout(.:format)                                                                                 user_sessions#destroy
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
#                                    tweet DELETE /tweets/:id(.:format)                                                                             tweets#destroy
#                       search_avatar_tags GET    /avatar_tags/search(.:format)                                                                     avatar_tags#search
#                              avatar_tags GET    /avatar_tags(.:format)                                                                            avatar_tags#index
#                               avatar_tag GET    /avatar_tags/:avatar_tag_name(.:format)                                                           avatar_tags#show
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

  get 'login', to: 'user_sessions#new'
  post 'login', to: 'user_sessions#create'
  delete 'logout', to: 'user_sessions#destroy'

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
  end

  resources :avatar_tags, only: %i[show index], param: 'avatar_tag_name' do
    get :search, on: :collection
  end

  get '*path', to: 'application#routing_error', constraints: lambda { |req|
    # 'rails/active_storage'が含まれているパスは対象外にする
    req.path.exclude? 'rails/active_storage'
  }
end
