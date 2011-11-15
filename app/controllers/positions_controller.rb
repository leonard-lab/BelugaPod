class PositionsController < ApplicationController

  before_filter :ensure_ipc_connection

  def show
    @id = params[:id]
    @sock.puts "get position #{@id}"
    resp = @sock.gets
    d = %w{ resp }
    @x = d[0].to_f
    @y = d[1].to_f
    @z = d[2].to_f

    respond_to do |format|
      format.html do
        if params[:short] && params[:short] == "1"
          render :inline => resp
        end
      end
    end

  end

  private
  
  def ensure_ipc_connection
    @sock = WhalesOnRails::Application::socket
  end
  
end
