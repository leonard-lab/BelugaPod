class PagesController < ApplicationController
  before_filter :ipc_info

  def home
  end

  def ipc
  end

  def joystick
    @kinematic = Kinematic.new(:id => 0, :max_speed => 40, :max_omega => 40, :max_zdot => 10)
  end

  def waypoint
    @waypoint = Waypoint.new(:id => 0, :x => 0, :y => 0, :z => 0)
  end

  def sandbox
    @param = Param.find(0).to_s
  end


  def ipc_info
    @ipc_up = BelugaSocket.okay?
  end
  
end
