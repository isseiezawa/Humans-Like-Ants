class InsertInitialWorldRooms < ActiveRecord::Migration[7.0]
  def up
    WorldRoom.create!(world_id: 13, name: 'Hello! Humans Like Ants!')
  end

  def down
    WorldRoom.delete_all
  end
end
