require 'spec_helper'

describe PositionsController do
  before(:each) do
    TestServerRunner.launch
  end

  render_views
  
  describe "post create" do
    before(:each) do
      @attr = {:id => 0, :x => RandomNumber::float, :y => RandomNumber::float, :z => RandomNumber::float}
      @attr_str = @attr.inject(Hash.new){|h, (k,v)| h[k.to_s] = v.to_s; h}
    end

    it "should set the position" do
      BelugaSocket.should be_okay
      post :create, :position => @attr
      puts Position.find(0).to_s
      Position.find(0).should be_a_match_for(@attr)
    end

    it "should respond with the position only if the short param is set" do
      post :create, :position => @attr, :short => "1"
      response.should contain [@attr[:x], @attr[:y], @attr[:z]].join(" ")
    end
  end

  describe "get index" do
    it "should respond with all positions when the short param is set" do
      get :index, :short => "1"
      response.should contain(("0.0 "*9).strip)
    end
  end

  describe "get show" do
    it "should respond with the position if the short param is set" do
      get :show, :id => 0, :short => "1"
      response.should contain "0.0 0.0 0.0"
    end
  end

  after(:each) do
    TestServerRunner.terminate
    BelugaSocket.close
  end
end
