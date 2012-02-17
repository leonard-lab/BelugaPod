class Position < ActiveRecord::Base
  set_table_name :empty_table
  
  attr_accessor :id, :x, :y, :z
  attr_accessible :id, :x, :y, :z

  validates_presence_of :id
  validates_presence_of :x
  validates_presence_of :y
  validates_presence_of :z  

  def self.all
    r = BelugaSocket.exchange "get position *"
    d = r.split.collect(&:to_f)
    out = []
    i = -1
    d.each_slice(3){ |s| out << Position.new(:id => (i += 1), :x => s[0], :y => s[1], :z => s[2])}
    out
  end
  
  def self.find id
    id = id.to_i
    return nil unless (0..3).include?(id)
    
    r = BelugaSocket.exchange "get position #{id}"
    d = r.split.collect(&:to_f)
    return Position.new(:id => id, :x => d[0], :y => d[1], :z => d[2])
  end

  def to_s
    "#{x} #{y} #{z}"
  end

  def save
    if id && (0..3).include?(id)
      BelugaSocket.exchange "set position #{id} #{x} #{y} #{z}"
      true
    else
      false
    end
  end
  
end
