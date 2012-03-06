require "spec_helper"

describe PagesController do
  render_views

  describe "Get home" do
    it "should show a warning if the IPC server is not running" do
      get '/'
      last_response.body.should have_selector("div.warning", :content => "server")
    end

    it "should not show a warning if the IPC server is running" do
      BelugaSocket.should_receive(:okay?).and_return(true)
      get '/'
      last_response.body.should_not have_selector("div.warning", :content => "server")
    end
  end

  describe "get ipc" do
    it "should show a warning if the IPC server is not running" do
      get '/ipc'
      last_response.body.should have_selector("div#server_status", :content => "not running")
    end

    it "should tell us if the IPC server is running" do
      BelugaSocket.should_receive(:okay?).and_return(true)
      get '/ipc'
      last_response.body.should have_selector("div#server_status", :content => "up and running")
    end
  end
end
