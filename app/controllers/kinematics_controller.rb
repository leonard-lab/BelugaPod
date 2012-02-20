class KinematicsController < ApplicationController

  def index
    @kinematics = Kinematic.all

    respond_to do |format|
      format.html do
        if short_response?
          render :inline => @kinematics.collect{ |p| p.to_s }.join(" ")
        end
        
      end

    end

  end
  
  def show
    @id = params[:id]
    @kinematic = Kinematic.find(@id)
    
    respond_to do |format|
      format.html do
        if short_response?
          render :inline => @kinematic.to_s
        end
      end
    end

  end
    
  def create

    @kinematic = Kinematic.new(params[:kinematic])

    @kinematic.save

    respond_to do |format|
      format.html do
        if short_response?
          render :inline => @kinematic.to_s
        end
      end
      format.js { }
    end

  end

  
end
