# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'

require 'capybara/rails'
require 'capybara/rspec'

require 'io/wait'

# Sets it up so that capybara will dump any webrick logs to log/capybara_test.log
#   This is good bc any webrick failures will show up in the logs.
Capybara.server do |app, port|
  require 'rack/handler/webrick'
  log_path = Rails.root.join("log/capybara_test.log").to_s
  Rack::Handler::WEBrick.run(app,
                             :Port => port,
                             :AccessLog => [],
                             :Logger => WEBrick::Log::new(log_path))
end

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

class TestServerRunner
  def self.launch
    BelugaIPC::Server.reset_data
    @server = BelugaIPC::Server.new(1234, '127.0.0.1')

    # uncomment to get some debug info from the server
    # @server.audit = true
    @server.start
  end

  def self.terminate_externally
    @server.stop
    @server.join
  end

  def self.terminate
    BelugaSocket.exchange("S")
    @server.join
  end

  def self.reset_data
    BelugaIPC::Server.reset_data
  end
end

module RandomNumber
  def self.float args=1.0
    min = 0.0
    if args.is_a? Hash
      if args[:plus_minus]
        min = -1.0*args[:plus_minus].to_f
        max = 1.0*args[:plus_minus].to_f
      else
        min = (args[:min] || 0.0).to_f
        max = (args[:max] || 1.0).to_f
      end
    else
      max = args.to_f
    end

    min + (max - min)*rand()
  end
end

# tolerance for comparing floats
TOL = 0.0001

RSpec::Matchers.define :be_a_match_for do |expected|
  match do |actual|
    check_match_for(actual, expected)
  end

  def check_match_for(actual, expected)
    result = true
    expected.each_pair do |ex_k, ex_v|
     if ex_v.is_a? Float
        result &= ((actual.send(ex_k) - ex_v).abs < TOL)
      else
        result &= (actual.send(ex_k) == ex_v)
      end
    end
    result
  end
end



RSpec.configure do |config|
  # we use rack::test for controller tests
  config.include Rack::Test::Methods

  def app
    BelugaPod::Application
  end
  
  # == Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr
  config.mock_with :rspec

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false
end
