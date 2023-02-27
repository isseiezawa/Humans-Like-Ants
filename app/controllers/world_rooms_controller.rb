class WorldRoomsController < ApplicationController

  def create
    @world = World.find_by!(place: params[:world_place_name])
    @world_room = @world.world_rooms.build(world_room_params)
    @world_room.world_id = @world.id
    respond_to do |format|
      if @world_room.save
        format.html { redirect_to world_path(@world.place) }
        format.turbo_stream { render 'create_success' }
      else
        @world_rooms = @world.world_rooms.includes(:tweets).order(id: :desc)
        format.html { render 'worlds/show', status: :unprocessable_entity }
      end
    end
  end

  private

  def world_room_params
    params.require(:world_room).permit(:name)
  end
end
