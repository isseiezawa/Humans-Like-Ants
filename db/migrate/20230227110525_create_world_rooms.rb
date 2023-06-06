class CreateWorldRooms < ActiveRecord::Migration[7.0]
  def change
    create_table :world_rooms do |t|
      t.integer :world_id, null: false
      t.string :name, null: false
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
