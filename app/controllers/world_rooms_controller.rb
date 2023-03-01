class WorldRoomsController < ApplicationController
  skip_before_action :require_login, only: %i[show]
  before_action :set_world_room, only: %i[show]

  def show
    @tweet = Tweet.new
    @tweets = @world_room.tweets.includes(:user).with_attached_image.order(id: :desc).page(params[:page]).per(5)
  end

  def create
    @world = World.find_by!(place: params[:world_place_name])
    @world_room = current_user.world_rooms.build(world_room_params)
    @world_room.world_id = @world.id
    @world_rooms = @world.world_rooms.includes(:tweets).order(id: :desc).page(params[:page]).per(5)
    respond_to do |format|
      if @world_room.save
        format.html { redirect_to world_path(@world.place) }
        format.turbo_stream { render 'create_success' }
      else
        format.html { render 'worlds/show', status: :unprocessable_entity }
      end
    end
  end

  def destroy
    world_room = current_user.world_rooms.find(params[:id])
    world_room.destroy!

    render turbo_stream: turbo_stream.remove(world_room)
  end

  private

  def set_world_room
    @world_room = WorldRoom.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to worlds_path, danger: t('activerecord.errors.messages.not_found_world_room', param: params[:id])
  end

  def world_room_params
    params.require(:world_room).permit(:name)
  end
end
