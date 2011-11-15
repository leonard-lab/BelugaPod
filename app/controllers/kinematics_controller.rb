class KinematicsController < ApplicationController

  before_filter :ensure_ipc_connection

  def create

    @speed = params[:kinematic][:speed]
    @omega = params[:kinematic][:omega]
    @zdot = params[:kinematic][:zdot]

    @sock.puts("set control kinematics 0 #{@speed} #{@omega} #{@zdot}")
    response = @sock.gets

    p response

    respond_to do |format|
      format.js { }
    end

  end

  private

  def ensure_ipc_connection

    @sock = WhalesOnRails::Application::socket

  end

  
end
