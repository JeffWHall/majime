#!/usr/bin/env ruby
require "uri"
require "net/http"
require 'json'
require 'yaml'


$app_config = YAML.load(File.read("./config/config.yml"))


class WrikeBot
  attr_reader :homeFolders

  def initialize(title)
    @client_id = $app_config["client_id"]
    @client_secret = $app_config["client_secret"]
    @token = $app_config["token"]
    @base_url = "https://www.wrike.com/api/v4/"
    @foldersCollection = self.get_resource("folders")
    @homeId = homeInit(title) 
    @homeFolders = setHomeFolders 
  end


  def homeInit(title)
    self.get_res_id(@foldersCollection['data'], "title",title)
  end


  def setHomeFolders
    self.get_resource("folders/#{@homeId}/folders")['data']
  end


  def authorization_url(resource) 
    params = {
      #scope: @scopes.join(" "),
      #redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      #response_type: 'code',
      #client_id: @client_id
      access_token: @token
    }
    url = {
      host: 'www.wrike.com',
      path: "/api/v4/#{resource}",
      query: URI.encode_www_form(params)
    }

    return URI::HTTPS.build(url)
  end


  def get_resource(resType)
    uri = URI(self.authorization_url(resType))
    res = Net::HTTP.get_response(uri)
    return JSON.parse(res.body) if res.is_a?(Net::HTTPSuccess)
  end


  def get_res_id(collection, key, value)
    resId = nil
    collection.each do |x|
      resId = x['id'] if x[key] == value
    end
    resId
  end
end

