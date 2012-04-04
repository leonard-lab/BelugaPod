require 'spec_helper'

describe ParamsController do
  before(:each) do
    TestServerRunner.launch
    @attr = { :string => 'foo bar baz' }    
  end

  render_views

  describe "post create" do
    it "should set the param string on the server" do
      post '/params', :param => @attr
      Param.find(0).string.should match 'foo bar baz'
    end

    it "should respond with the param string if the short param is set" do
      post '/params', :param => @attr, :short => '1'
      last_response.body.should include @attr[:string]
    end
  end

  describe "get index" do
    it "should respond with the param string when the short param is set" do
      Param.new(@attr).save
      
      get '/params', :short => '1'
      last_response.body.should include @attr[:string]
    end
  end

  describe "get show" do
    it "should respond with the param string when the short param is set" do
      Param.new(@attr).save
      
      get '/params', :id => 0, :short => '1'
      last_response.body.should include @attr[:string]
    end
  end

  after(:each) do
    TestServerRunner.terminate
    BelugaSocket.close
  end
end
