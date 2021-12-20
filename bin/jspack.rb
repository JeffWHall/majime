#!/usr/bin/env ruby

require 'pathname'
require 'yaml'

build_path = Pathname.new("../ae-helper.js")
srcList_path = Pathname.new("../config/js-src-manifest.yml")
src_path = Pathname.new("../lib/js-aehelper/")

# Destroy old build file because we're about to make a new one.
File.delete(build_path) if build_path.exist?


# Get list of files from manifest
src_manifest = YAML.load(File.read(srcList_path))

build_file = File.new(build_path, 'a')


# For comments and blank lines, return empty string.
# For code lines, remove white space, inline comments, and line feeds.
def strip_it(line)
  if line =~ /(?!^\s*\/\/)|(?!^[\n\r])/
    replacements = [ [/\/\/\s*.*$/, ""], [/true/, "!0"], [/false/, "!1"] ]
    replacements.each { |r| line.gsub!(r[0], r[1]) }
    line = line.strip
    #line = line.gsub(/\/\/\s*.*$/, "").strip
    #line = line.gsub(/true/, "!0")
    #line = line.gsub(/false/, "!1")
  else
    line = ""
  end
  line
end


# Process include statements.
def insert_include(i, src_path, build_file)
  name = i.split(" ").last
  src = src_path.join("_#{name}.js")
  File.foreach(src) do |line|
    build_file.write(line)
  end
  ""
end


# Stream through each file in the manifest.
src_manifest.each do |src|
  puts src
  File.foreach(src_path.join(src)) do |l|
    if l =~ /^\s*\/\/\+\s+include/
      l = insert_include(l, src_path, build_file)
    else 
#      l = strip_it(l) 
    end

    build_file.write(l)
  end
end

build_file.close()
