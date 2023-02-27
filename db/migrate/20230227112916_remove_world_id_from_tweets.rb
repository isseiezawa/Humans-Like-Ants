class RemoveWorldIdFromTweets < ActiveRecord::Migration[7.0]
  def up
    remove_column :tweets, :world_id
  end

  def down
    add_column :tweets, :world_id, :integer, null: false
  end
end
