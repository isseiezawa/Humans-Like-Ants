class CreateTweets < ActiveRecord::Migration[7.0]
  def change
    create_table :tweets do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :world_id, null: false
      t.text :post, null: false

      t.timestamps
    end
  end
end
