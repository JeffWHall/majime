#!/usr/bin/env ruby

require 'shellwords'
require 'csv'


#mpk_data = Hash[*CSV.read("#{ARGV[0]}.csv").flatten(1)]
mpk_data = Hash[*CSV.read("manifest.csv").flatten(1)]
Dir.chdir("../../Desktop/MPK drop/Dailies")
sanitized = Hash.new

def sanitize_file_names(mpk_data, sanitized)
  mpk_data.each do |key, value|
    sanitized[key.gsub(/\/\d{1,2}c/, '').gsub(/:/, '')] = value
  end
end


def rename_files_with_house_nums(data)
  puts "Renaming movie files:"
  Dir.glob("*.mov") do |f|
    puts
    puts "File:  #{f}"
    if data.include?(File.basename(f, ".mov"))
      puts "[Match]... #{File.basename(f, ".mov")} --> #{data[File.basename(f, ".mov")]}"
      File.rename(f, "#{data[File.basename(f, ".mov")]}.mov")
    end
    puts
  end
end


sanitize_file_names(mpk_data, sanitized)
rename_files_with_house_nums(sanitized)

