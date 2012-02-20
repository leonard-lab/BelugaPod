class WaypointsController < ApplicationController

  def index
    @waypoints = Waypoint.all

    respond_to do |format|
      format.html do
        if short_response?
          render :inline => @waypoints.collect{ |p| p.to_s }.join(" ")
        end
      end
      format.js { }

    end

  end

  def show
    @id = params[:id]
    @waypoint = Waypoint.find(@id)
    
    respond_to do |format|
      format.html do
        if short_response?
          render :inline => @waypoint.to_s
        end
      end
    end

  end
    
  def create

    @waypoint = Waypoint.new(params[:waypoint])

    @waypoint.save

    respond_to do |format|
      format.html do
        if short_response?
          render :inline => @waypoint.to_s
        end
      end
      format.js { }
    end

  end
  
end
