# frozen_string_literal: true

class SorceryCore < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false, index: { unique: true }
      t.string :crypted_password
      t.string :salt
      t.text :self_introduction
      t.integer :gender, null: false, default: 0
      t.integer :role, null: false, default: 0
      t.string :twitter_id

      t.timestamps null: false
    end
  end
end
