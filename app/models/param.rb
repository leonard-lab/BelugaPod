class Param < ActiveRecord::Base
  set_table_name :empty_table

  attr_accessor :string

  validates_presence_of :string

  # the id is ignored, we keep it here for congruency with other Rails models
  def self.find id
    r = BelugaSocket.exchange "get params"
    return Param.new(:string => r)
  end

  def self.all
    return [find(0)]
  end

  def to_s
    string
  end

  def save
    BelugaSocket.exchange "set params \"#{string}\""
    true
  end

end
