class CreateAvatarTags < ActiveRecord::Migration[7.0]
  def change
    create_table :avatar_tags do |t|
      t.string :name, null: false

      t.timestamps
    end
    add_index :avatar_tags, :name, unique: true
  end
end
