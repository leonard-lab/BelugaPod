class KinematicsController < ApplicationController

  before_filter :ensure_ipc_connection

  def create

    the_sock = TCPSocket.open('127.0.0.1', 1234)
    the_sock.gets
    
    @speed = params[:kinematic][:speed]
    @omega = params[:kinematic][:omega]
    @zdot = params[:kinematic][:zdot]

    the_sock.puts("set control kinematics 0 #{@speed} #{@omega} #{@zdot}")
    p the_sock.gets

    respond_to do |format|
      format.js { }
    end

    the_sock.close

  end

  private

  def ensure_ipc_connection

    # unless session[:sock] && !session[:sock].closed?
    #   session[:sock] = TCPSocket.open('127.0.0.1', 1234)
    # end

    
  end

  
end
