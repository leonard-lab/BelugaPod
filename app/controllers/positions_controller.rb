class PositionsController < ApplicationController

  def index
    @positions = Position.all

    respond_to do |format|
      format.html do
        if params[:short] && (params[:short] == "1" || params[:short] == "yes")
          render :inline => @positions.collect{ |p| p.to_s }.join(" ")
        end
        
      end

    end

  end
  
  def show
    @id = params[:id]
    @position = Position.find(@id)
    
    respond_to do |format|
      format.html do
        if params[:short] && params[:short] == "1"
          render :inline => @position.to_s
        end
      end
    end

  end

  private
  
  def ensure_ipc_connection
    @sock = WhalesOnRails::Application::socket
  end
  
end
