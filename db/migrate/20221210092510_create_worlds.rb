class CreateWorlds < ActiveRecord::Migration[7.0]
  def change
    create_table :worlds do |t|
      t.string :place, null: false

      t.timestamps
    end
  end
end
