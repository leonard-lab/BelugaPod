require "spec_helper"

describe Kinematic do
  describe "when the IPC server is not running" do
    it "should raise an error when we try to get data" do
      lambda do
        Kinematic.find(0).should
      end.should raise_error
    end
  end

  describe "when the IPC server is running" do
    before(:each) do
      TestServerRunner.launch
      @attr = [{:id => 0, :speed => RandomNumber::float, :omega => RandomNumber::float, :zdot => RandomNumber::float},
               {:id => 1, :speed => RandomNumber::float, :omega => RandomNumber::float, :zdot => RandomNumber::float},
               {:id => 2, :speed => RandomNumber::float, :omega => RandomNumber::float, :zdot => RandomNumber::float},
               {:id => 3, :speed => RandomNumber::float, :omega => RandomNumber::float, :zdot => RandomNumber::float}]
    end

    it "should be able to set and get the position for a single bot" do
      # doing this out of order, just to make sure we don't
      # get a buffered response accidentally
      Kinematic.new(@attr[0]).save.should == true
      Kinematic.new(@attr[1]).save.should == true

      p0 = Kinematic.find(@attr[0][:id])
      p1 = Kinematic.find(@attr[1][:id])

      p0.should be_a_match_for(@attr[0])
      p1.should be_a_match_for(@attr[1])
   end

    it "should get the positions of all vehicles" do
      Kinematic.new(@attr[0]).save.should == true
      Kinematic.new(@attr[1]).save.should == true
      Kinematic.new(@attr[2]).save.should == true
      Kinematic.new(@attr[3]).save.should == true

      ps = Kinematic.all
      ps[0].should be_a_match_for(@attr[0])
      ps[1].should be_a_match_for(@attr[1])
      ps[2].should be_a_match_for(@attr[2])
      ps[3].should be_a_match_for(@attr[3])
    end

    it "should convert to a string by stringing the numbers together" do
      Kinematic.new(@attr[0]).to_s.should match [@attr[0][:speed], @attr[0][:omega], @attr[0][:zdot]].join(" ")
    end

    it "should not allow the id to be greater than 3 when saving" do
      Kinematic.new(@attr[0].merge(:id => 4)).save.should == false
    end

    it "should not allow the id to be greater than 3 when finding" do
      Kinematic.find(4).should be_nil
    end

    describe "when the mode is set to waypoint" do
      before(:each) do
        Waypoint.new(:id => 0, :x => 0, :y => 0, :z => 0).save
      end

      it "should return nil for find" do
        Kinematic.find(0).should be_nil
      end

      it "should return an empty array for all" do
        Kinematic.all.should be_empty
      end
    end

    after(:each) do
      TestServerRunner.terminate
      BelugaSocket.close
    end
  end
end