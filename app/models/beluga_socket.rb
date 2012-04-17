require 'io/wait'

class BelugaSocket
  #set_table_name :empty_table

  def self.exchange input
    begin
      sock.puts input
      response = sock.gets
      raise "Beluga socket error: No response from the server" if response.nil?
      if response =~ /server error/i && reconnect
        sock.puts input
        response = sock.gets
      end
      raise "Beluga socket error: Error response from server" if response =~ /server error/i
      response.strip
    rescue Errno::ECONNRESET
      if reconnect
        retry
      else
        raise
      end
    end
  end

  def self.reconnect
    close
    sock(true)
    okay?
  end

  def self.sock force_connect = false
    if force_connect || @sock.nil?
      @sock.close unless @sock.nil?
      @sock = TCPSocket.open('127.0.0.1', 1234)
      @sock.wait(100)
      if @sock.ready?
        @sock.gets
      end
    end
    @sock
  end

  def self.okay?
    begin
      !!(exchange("ping") =~ /pong/i)
    rescue
      false
    end
  end

  def self.close
    @sock.close unless @sock.nil?
    @sock = nil
  end

end
