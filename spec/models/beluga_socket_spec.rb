require "spec_helper"

describe BelugaSocket do
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