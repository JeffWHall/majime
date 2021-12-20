#!/usr/bin/env ruby
require 'csv'


class Queue

  attr_reader :jobList

  def initialize(bot)
    @bot = bot
    @jobList = Hash.new
    @manifest = []
  end


  def addJob(title)
    jobId = @bot.get_res_id(@bot.homeFolders, "title", title)
    @jobList[title] = jobId
  end

  
  def find_comment_that_has_list(comments)
    comment = nil
    comments.each_with_index do |c, idx|
      comment = idx if c['text'] =~ /ION_GR/
    end
    comment
  end


  def get_comments(job)
    # Reverse the order so it will pick up any later revisions
    comments = @bot.get_resource("folders/#{job}/comments")['data'].reverse!
    index_of_nums = find_comment_that_has_list(comments)
    if index_of_nums != nil
      comments[index_of_nums]['text']
    else
      puts
      puts
      puts "Could not find any house numbers."
    end
  end


  def cleanText(data)
    data.gsub("\t", "")
      .gsub("\n", "")
      .gsub("amp;", "")
      .gsub(/---/, '--')
      .gsub(/MPK\s+-+\s*/, 'MPK-- ')
      .gsub(/MPK-+\s*/, 'MPK-- ')
      .gsub(/(:)(\w)/, ': \2')
      .split("<br />").each { |x| x.strip! || x }
      #.gsub(/(--)(\w)/, '-- \2')
  end
  

  def structureData(data)
    element = Struct.new(:house_num, :title)
    rgx = /(ION_GR\d+) ([A-Z].+)/

    structList = Array.new

    data.each do |line|
      structList.push(line.match(rgx) { |m| element.new(*m.captures) })
    end
    structList.compact
  end


  ## TODO Check if entry already exists
  def writeCSV(data_detailing)

    CSV.open("manifest.csv", "a+") do |csv|
      @manifest.each do |element|
        data_detailing.call(element)
        csv << [element["title"], element["house_num"]] unless element == nil
      end
    end
  end


  def processJobs
    @jobList.each do |key, value|
      theList = get_comments(value)
      @manifest = @manifest.concat(structureData(cleanText(theList)))
    end

    data_detailing = lambda { |d| d['title'] = d['title'].gsub(/_/, ' ') }

    writeCSV(data_detailing)
  end
end


