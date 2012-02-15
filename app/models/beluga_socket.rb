class BelugaSocket < ActiveRecord::Base
  set_table_name :empty_table

  def self.exchange input
    sock.puts input
    response = sock.gets
    raise "Beluga socket error: No response from the server" if response.nil?
    response
  end

  def self.sock
    unless @sock
      @sock = TCPsocket.open('127.0.0.1', 1234)
      @sock.gets
    end
    @sock
  end

  def self.close
    self.sock.close
  end

end
