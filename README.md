Beluga POD
==========

Beluga POD is a Rails-based web interface for the [Beluga project](http://github.com/leonard-lab/Beluga) developed at the [Dynamical Control Systems Laboratory](http://dcsl.princeton.edu/robotics) at Princeton University.  It uses TCP sockets to connect to a [Beluga IPC server](http://github.com/leonard-lab/BelugaIPC) (built with [rhubarb](http://github.com/dantswain/rhubarb)).  Both joystick and waypoint (point-and-move) style interfaces are provided that use AJAX to continuously update the user's view with the latest information from the tracking software while sending commands to the robots.

Adding a new interface
----------------------

As an example, suppose that we want to add a new experimental interface that can be accessed at `<thehost>/hitl`.  We'll add this task to the `pages` controller.

  1. Add the route to `config/routes.rb`

     Add the following line below the `match '/waypoint' => 'pages#waypoint` line in `config/routes.rb`:

     ``` ruby
     match '/hitl' => 'pages#hitl'
     ```

     This tells Rails that whenever someone visits `<thehost>/hitl`, we want the application to execute the code found in the `hitl` action (aka function/method) in the `PagesController` controller.

     Optionally, if you want to disable the other interfaces, comment out the corresponding lines.

  2. Add the action to `PagesController`

     Open up `app/controllers/pages_controller.rb` and add a `hitl` method to the `PagesController` class:
     
     ``` ruby
     class PagesController < ApplicationController
       # ...
       # existing code...
      
       # the new 'hitl' action
       def hitl
         # whatever code needs to go here
         # for example, if we need a waypoint:
         @waypoint = Waypoint.new(:id => 0, :x => 0, :y => 0, :z => 0)
       end
     end
     ```

     Take a look at the other actions to see what kind of code might need to go into this method.  The basic idea is to set up any variables that you need in your view.  Any instance variable (the ones with the `@` in front) will be available in the view.  It's entirely possible that you don't need any code at all here.

  3. Set up the view

     Create a file `app/views/pages/hitl.html.erb`.  Probably the simplest way to do this is to copy an existing view and rename the file.  If you want to use custom css and/or javascript, set up the appropriate `content_for` blocks:
     
     ``` erb
     <%= content_for :page_css do %>
       <%= stylesheet_link_tag "hitl" %>
     <% end %>
      
     <%= content_for :page_js do %>
       <%= javascript_include_tag "hitl" %>
     <% end %>
     ```

     This tells Rails to insert a css link to the file at `app/assets/stylesheets/hitl.css` and the javascript file at `app/assets/javascripts/hitl.js`.  Note that this is optional and you can include multiple files here.  For example, if you want to include the `waypoint.js` file as well, just add a duplicate `javascript_include_tag` line and replace `hitl` with `waypoint`.

     Note also that this is separate from using [sass/scss](http://sass-lang.com/).  If you want to use scss, create a (for example) `hitl.scss` and then run `sass hitl.scss hitl.css` in the stylesheets directory.  The bottom line is that rails will load the `.css` file - it's up to you to generate it however you want.  (There are ways to automate this process, but that's beyond the scope of this note.)

That's it!  You should now be able to launch the Rails server and see your new action at http://127.0.0.1:3000/hitl

         
        
        
