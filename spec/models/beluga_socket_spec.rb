require "spec_helper"

describe BelugaSocket do

  describe "When the IPC server is running" do
    before(:all) do
      TestServerRunner.launch
    end

    # this isn't a great test, but it DOES ensure that we have our gems set up properly
    it "should respond to a ping" do
      BelugaSocket.exchange("ping").should match "PONG"
    end

    it "should respond to another ping" do
      BelugaSocket.exchange("ping").should match "PONG"
    end

    it "should return true for okay?" do
      BelugaSocket.should be_okay
    end

    it "should be able to read and write a position" do
      BelugaSocket.exchange("get position 0").should match "0.0 0.0 0.0"
      BelugaSocket.exchange("set position 0 1 0 0").should match "1.0 0.0 0.0"
      BelugaSocket.exchange("set position 1 0 1 0").should match "0.0 1.0 0.0"
      BelugaSocket.exchange("get position 0").should match "1.0 0.0 0.0"
    end

    after(:all) do
      TestServerRunner.terminate
      BelugaSocket.close
    end
  end

  describe "When the IPC server is NOT running" do
    it "should raise an error" do
      lambda do
        BelugaSocket.exchange("ping")
      end.should raise_error
    end

    it "should return false for okay?" do
      BelugaSocket.should_not be_okay
    end
  end

  describe "When the IPC server shuts down unexpectedly" do
    before(:each) do
      TestServerRunner.launch
      # make sure that the socket is open
      BelugaSocket.exchange "ping"
      TestServerRunner.terminate_externally
    end

    it "should raise an error" do
      lambda do
        BelugaSocket.exchange("ping")
      end.should raise_error
    end

    it "should return false for okay?" do
      BelugaSocket.should_not be_okay
    end

    it "should be able to reconnect if the server comes back online" do
      TestServerRunner.launch
      BelugaSocket.exchange("ping").should match "PONG"
      TestServerRunner.terminate
    end

    after(:each) do
      BelugaSocket.close
    end
  end
end