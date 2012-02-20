class ApplicationController < ActionController::Base
  protect_from_forgery

  protected

  def short_response?
    # this should eventually go back in, but for now every time
    # we request html, this is what we want
    # params[:short] && (params[:short] == "1" || params[:short] == "yes")

    # eventually remove this
    true
  end
end
