#!/usr/bin/env ruby
require './lib/WrikeBot.rb'
require './lib/Queue.rb'
require 'yaml'


timeStart = Time.now

JobList = YAML.load(File.read("JobList.yml"))

bot = WrikeBot.new("Ion and Ion Plus")

m = Queue.new(bot)
JobList.each { |j| m.addJob(j) }
m.processJobs

timeEnd = Time.now

puts "Majime completed #{m.jobList.length() > 1 ? "jobs" : "job"} in #{timeEnd - timeStart} seconds. manifest.csv written."

