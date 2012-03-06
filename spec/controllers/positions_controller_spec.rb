require 'spec_helper'

describe PositionsController do
  before(:each) do
    TestServerRunner.launch
  end

  render_views

  describe "post create" do
    before(:each) do
      @attr = {:id => 0, :x => RandomNumber::float, :y => RandomNumber::float, :z => RandomNumber::float}
    end

    it "should set the position" do
      post '/positions', :position => @attr
      Position.find(0).should be_a_match_for(@attr)
    end

    it "should respond with the position if the short param is set" do
      post '/positions', :position => @attr, :short => "1"
      last_response.body.should include [@attr[:x], @attr[:y], @attr[:z]].join(" ")
    end
  end

  describe "get index" do
    it "should respond with all positions when the short param is set" do
      get '/positions', :short => "1"
      last_response.body.should include(("0.0 "*9).strip)
    end
  end

  describe "get show" do
    it "should respond with the position if the short param is set" do
      get '/positions/', :id => 0, :short => "1"
      last_response.body.should include "0.0 0.0 0.0"
    end
  end

  after(:each) do
    TestServerRunner.terminate
    BelugaSocket.close
  end
end
