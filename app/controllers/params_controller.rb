class ParamsController < ApplicationController
  
  def create
    @param = Param.new(params[:param])

    unless @param.save
      raise "Unable to save parameter string: #{@position.errors.full_messages {|msg| p msg}}"
    end

    respond_to do |format|
      format.html { render :inline => @param.to_s }
      format.js { }
    end

  end

  def index
    @params = Param.all

    respond_to do |format|
      format.html do
        if short_response?
          render :inline => '"' + @params.collect{ |p| p.to_s }.join("\" \"") + '"'
        end
      end
      format.js
    end

  end
  
  def show
    @id = params[:id]
    @param = Param.find(@id)
    
    respond_to do |format|
      format.html do
        if short_response?
          render :inline => @param.to_s
        end
      end
    end

  end
  
end
