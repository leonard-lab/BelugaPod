require 'spec_helper'

describe "WaypointInterface", :js => true do
  before(:each) do
    #TestServerRunner.launch
    #visit waypoint_path
  end

  describe "default layout" do
    it "should have the first beluga selected" do
      visit "/"
      page.should have_selector('title')
    end
  end

  after(:each) do
    #TestServerRunner.terminate
    #BelugaSocket.close
  end
end
