class CreateAvatarTagMaps < ActiveRecord::Migration[7.0]
  def change
    create_table :avatar_tag_maps do |t|
      t.references :user, null: false, foreign_key: true
      t.references :avatar_tag, null: false, foreign_key: true

      t.timestamps
    end
    add_index :avatar_tag_maps, [:user_id, :avatar_tag_id], unique: true
  end
end
