class BelugaSocket < ActiveRecord::Base
  set_table_name :empty_table

  @@sock = nil
  
  def self.exchange input
    self.sock.puts input
    self.sock.gets
  end

  def self.sock
    if @@sock.nil? || @@sock.closed?
      @@sock = TCPSocket.new('127.0.0.1', 1234)
      @@sock.gets # server response
    end
    @@sock
  end
    
end
