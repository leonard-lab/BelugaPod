require "spec_helper"

describe BelugaSocket do

  describe "When the IPC server is running" do
    before(:each) do
      TestServerRunner.launch
    end

    # this isn't a great test, but it DOES ensure that we have our gems set up properly
    it "should respond to a ping" do
      BelugaSocket.exchange("ping").should match "PONG"
    end

    after(:each) do
      TestServerRunner.terminate
    end
  end

  describe "When the IPC server is NOT running" do
    it "should raise an error" do
      lambda do
        puts BelugaSocket.exchange("ping")
      end.should raise_error
    end
  end

  describe "When the IPC server shuts down unexpectedly" do
    it "should raise an error" do
      lambda do
        TestServerRunner.terminate_externally
        BelugaSocket.exchange("ping")
      end.should raise_error
    end
  end
end