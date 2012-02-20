class PositionsController < ApplicationController

  def create
    @position = Position.new(params[:position])

    unless @position.save
      raise "Unable to save position: #{@position.errors.full_messages {|msg| p msg}}"
    end

    respond_to do |format|
      format.html { render :inline => @position.to_s }
      format.js { }
    end

  end

  def index
    @positions = Position.all

    respond_to do |format|
      format.html do
        if short_response?
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
        if short_response?
          render :inline => @position.to_s
        end
      end
    end

  end
  
end
