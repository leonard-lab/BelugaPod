class Waypoint < ActiveRecord::Base
  set_table_name :empty_table
  
  attr_accessor :id, :x, :y, :z
  attr_accessible :id, :x, :y, :z

  validates_presence_of :id
  validates_presence_of :x
  validates_presence_of :y
  validates_presence_of :z

  def self.all
    r = BelugaSocket.exchange "get control *"
    d = r.split

    mode = d[0]

    return [] unless mode == "waypoint"
    
    d = d[1..-1].collect{ |d| d.to_f }
    out = []
    i = -1;
    d.each_slice(3){ |s| out << Waypoint.new(:id => (i += 1),
                                             :x => s[0],
                                             :y => s[1],
                                             :z => s[2])}
    out
  end
  
  def self.find id
    id = id.to_i
    return nil unless (0..3).include?(id)

    r = BelugaSocket.exchange "get control #{id}"
    d = r.split
    mode = d[0]

    return nil unless mode == "waypoint"
    
    d = d[1..-1].collect{ |d| d.to_f }
    return Waypoint.new(:id => id, :x => d[0], :y => d[1], :z => d[2])
  end

  def to_s
    "#{x} #{y} #{z}"
  end

  def save
    if id
      BelugaSocket.exchange "set control waypoint #{id} #{x} #{y} #{z}"
      true
    else
      false
    end
  end
  
  
end
