require "spec_helper"

describe Param do
  describe "when the IPC server is not running" do
    it "should raise an error when we try to get data" do
      lambda do
        Position.find(0).should
      end.should raise_error
    end
  end

  describe "when the IPC server is running" do
    before(:each) do
      TestServerRunner.launch
    end

    it "should get the parameter string from the server when we call find" do
      Param.find(0).string.should match "ERR"
    end

    it "should get the parameter string from the server when we call all" do
      Param.all.first.string.should match "ERR"
    end
    
    it "should be able to set the parameter string" do
      Param.new(:string => "foo bar baz").save.should == true

      Param.all.first.string.should match "foo bar baz"
    end

    after(:each) do
      TestServerRunner.terminate
      BelugaSocket.close
    end
  end
end
