require 'spec_helper'

describe WaypointsController do
  before(:each) do
    TestServerRunner.launch
  end

  render_views

  describe "post create" do
    before(:each) do
      @attr = {:id => 0, :x => RandomNumber::float, :y => RandomNumber::float, :z => RandomNumber::float}
    end

    it "should set the waypoint" do
      post '/waypoints', :waypoint => @attr
      Waypoint.find(0).should be_a_match_for(@attr)
    end

    it "should respond with the waypoint if the short param is set" do
      post '/waypoints', :waypoint => @attr, :short => "1"
      last_response.body.should include [@attr[:x], @attr[:y], @attr[:z]].join(" ")
    end

    it "should respond to a javascript request" do
      post '/waypoints', :waypoint => @attr, :format => 'js'
      last_response.body.should include "updateWaypoint(#{[@attr[:id], @attr[:x], @attr[:y], @attr[:z]].join(",")})"
    end
  end

  after(:each) do
    TestServerRunner.terminate
    BelugaSocket.close
  end

end
