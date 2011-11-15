class Position < ActiveRecord::Base
  set_table_name :empty_table
  
  attr_accessor :x, :y, :z
  attr_accessible :x, :y, :z
  
end
