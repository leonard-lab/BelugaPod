class PositionsController < ApplicationController

  def create
    @position = Position.new(params[:position])

    @position.save

    respond_to do |format|
      format.html do
        if params[:short] && (params[:short] == "1" || params[:short] == "yes")
          render :inline => @position.to_s
        end
        format.js { }
      end
    end

  end

  def index
    @positions = Position.all

    respond_to do |format|
      format.html do
        if params[:short] && (params[:short] == "1" || params[:short] == "yes")
          render :inline => @positions.collect{ |p| p.to_s }.join(" ")
        end
      end
      format.js
    end

  end
  
  def show
    @id = params[:id]
    @position = Position.find(@id)
    
    respond_to do |format|
      format.html do
        if params[:short] && (params[:short] == "1" || params[:short] == "yes")
          render :inline => @position.to_s
        end
      end
    end

  end
  
end
