require "spec_helper"

describe Position do
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
      @attr = [{:id => 0, :x => RandomNumber::float, :y => RandomNumber::float, :z => RandomNumber::float},
               {:id => 1, :x => RandomNumber::float, :y => RandomNumber::float, :z => RandomNumber::float},
               {:id => 2, :x => RandomNumber::float, :y => RandomNumber::float, :z => RandomNumber::float},
               {:id => 3, :x => RandomNumber::float, :y => RandomNumber::float, :z => RandomNumber::float}]
    end

    it "should be able to set and get the position for a single bot" do
      # doing this out of order, just to make sure we don't
      # get a buffered response accidentally
      Position.new(@attr[0]).save.should == true
      Position.new(@attr[1]).save.should == true

      p0 = Position.find(@attr[0][:id])
      p1 = Position.find(@attr[1][:id])

      p0.should be_a_match_for(@attr[0])
      p1.should be_a_match_for(@attr[1])
   end

    it "should get the positions of all vehicles" do
      Position.new(@attr[0]).save.should == true
      Position.new(@attr[1]).save.should == true
      Position.new(@attr[2]).save.should == true
      Position.new(@attr[3]).save.should == true

      ps = Position.all
      ps[0].should be_a_match_for(@attr[0])
      ps[1].should be_a_match_for(@attr[1])
      ps[2].should be_a_match_for(@attr[2])
      ps[3].should be_a_match_for(@attr[3])
    end

    it "should convert to a string by stringing the numbers together" do
      Position.new(@attr[0]).to_s.should match [@attr[0][:x], @attr[0][:y], @attr[0][:z]].join(" ")
    end

    it "should not allow the id to be greater than 3 when saving" do
      Position.new(@attr[0].merge(:id => 4)).save.should == false
    end

    it "should not allow the id to be greater than 3 when finding" do
      Position.find(4).should be_nil
    end

    it "should allow to set the parameters via strings" do
      attr_as_str = @attr[0].inject(Hash.new){|h, (k,v)| h[k.to_s] = v.to_s; h}
      Position.new(attr_as_str).save.should == true
      Position.find(@attr[0][:id]).should be_a_match_for(@attr[0])
    end

    after(:each) do
      TestServerRunner.terminate
      BelugaSocket.close
    end
  end
end