class CreateEmptyTable < ActiveRecord::Migration
  def self.up
    create_table :empty_table do |t|
    end
  end

  def self.down
    drop_table :empty_table
  end
end
