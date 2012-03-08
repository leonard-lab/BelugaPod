require 'spec_helper'

describe "WaypointInterface", :js => true do
  before(:all) do
    TestServerRunner.launch    
  end
  
  before(:each) do
    TestServerRunner.reset_data
  end

  describe "default layout" do
    before(:each) do
      visit "/waypoint"
    end
    
    it "should have the first beluga selected" do
      page.evaluate_script("selectedRobotId();").should == "0"
    end

    it "should populate the form values" do
      within "#new_waypoint_0" do
        find("#waypoint_x").value.should == "0"
        find("#waypoint_y").value.should == "0"
        find("#waypoint_z").value.should == "0"                
      end
    end
  end

  describe "selecting another robot" do
    before(:each) do
      @waypoint = Waypoint.find(1)
      @waypoint.x = -1
      @waypoint.y = 1
      @waypoint.z = 2
      @waypoint.save

      visit "/waypoint"
      find("label[for='waypoint_id_1']").click
    end

    it "should change the selected id" do
      page.evaluate_script("selectedRobotId();").should == "1"
    end

    it "should update the form values" do
      within "#new_waypoint_0" do
        (find("#waypoint_x").value.to_f - @waypoint.x).abs.should < 0.001
        (find("#waypoint_y").value.to_f - @waypoint.y).abs.should < 0.001
        (find("#waypoint_z").value.to_f - @waypoint.z).abs.should < 0.001        
      end
    end
  end

  after(:all) do
    BelugaSocket.close    
    TestServerRunner.terminate
  end
end
