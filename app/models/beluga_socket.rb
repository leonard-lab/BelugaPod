class BelugaSocket < ActiveRecord::Base
  set_table_name :empty_table

  def self.exchange input
    self.sock.puts input
    self.sock.gets
  end

  def self.sock
    WhalesOnRails::Application::socket
  end
    
end
