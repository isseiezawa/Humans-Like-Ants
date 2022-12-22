class CreateTweets < ActiveRecord::Migration[7.0]
  def change
    create_table :tweets do |t|
      t.references :user, null: false, foreign_key: true
      t.references :world, null: false, foreign_key: true
      t.text :post

      t.timestamps
    end
  end
end
