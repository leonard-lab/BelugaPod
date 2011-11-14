class PagesController < ApplicationController

  def home
    
  end

  def joystick

    @kinematic = Kinematic.new(:max_speed => 40, :max_omega => 40, :max_zdot => 10)
    
  end

  def waypoint
    
  end
  
end
