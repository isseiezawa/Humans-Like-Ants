class AddWorldRoomIdToTweets < ActiveRecord::Migration[7.0]
  def change
    add_reference :tweets, :world_room, null: false, foreign_key: true, default: 1
  end
end
