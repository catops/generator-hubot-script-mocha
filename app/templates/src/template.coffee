# Description
#   <%= scriptDescription %>
#
# Configuration:
#   <%= envVariable %>
#
# Commands:
#   hubot hello - <what the respond trigger does>
#   orly - <what the hear trigger does>
#
# Notes:
#   <optional notes required for the script>
#
# Author:
#   <%= userName %>

<% if (needStorage) { %>class <%= robotClassName %>Robot
  constructor: (@robot) -><% if (needEnvVariable) { %>
    @config = process.env.HUBOT_<%= scriptNameUppercased %>_SETTING or 'whatever the default value should be'<% } %>
    initialized = false
    robot.brain.on 'loaded', =>
      if not initialized
        initialized = true
        <%= scriptNameCamelized %> = @robot.brain.get '<%= scriptNameCamelized %>'
        @<%= scriptNameCamelized %> = <%= scriptNameCamelized %> or []
        @robot.brain.set '<%= scriptNameCamelized %>', @<%= scriptNameCamelized %>
  add: (item) ->
    @<%= scriptNameCamelized %>.push item
    @robot.brain.set '<%= scriptNameCamelized %>', @<%= scriptNameCamelized %>
  remove: (item) ->
    @<%= scriptNameCamelized %> = @<%= scriptNameCamelized %>.filter (i) -> i isnt item
    @robot.brain.set '<%= scriptNameCamelized %>', @<%= scriptNameCamelized %>

module.exports = (robot) ->
  <%= scriptNameCamelized %>Robot = new <%= robotClassName %>Robot robot<% } else { %>module.exports = (robot) -><% } %>

  robot.respond /hello/, (res) ->
    res.reply "hello!"

  robot.hear /orly/, (res) ->
    if robot.auth.isAdmin res.envelope.user
      message = "yarly"
    else
      message = "Sorry, only admins can do that."
    res.send message

  <% if (needStorage) { %>robot.respond /add (\S*) to the thing/, (res) ->
    item = res.match[1]
    <%= scriptNameCamelized %>Robot.add(item)
    res.send "Alright, I added #{item} to the thing."

  robot.respond /remove (\S*) from the thing/, (res) ->
    item = res.match[1]
    if robot.auth.isAdmin res.envelope.user
      <%= scriptNameCamelized %>Robot.remove(item)
      message = "Okay, I removed #{item} from the thing."
    else
      message = "Sorry, only admins can remove stuff."
    res.send message<% } %>
