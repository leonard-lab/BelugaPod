class Kinematic < ActiveRecord::Base
  set_table_name :empty_table
  
  attr_accessor :speed, :omega, :zdot, :max_speed, :max_omega, :max_zdot
  attr_accessible :speed, :omega, :zdot, :max_speed, :max_omega, :max_zdot
  
end
