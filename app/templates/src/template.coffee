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

<% if (needStorage) { %>class GitHub
  constructor: (@robot) ->
    @config = process.env.HUBOT_GITHUB_CONFIG or 'default state goes here'
    github = @robot.brain.get 'github'
    @github = github or []
    @robot.brain.set 'github', @github
  add: (item) ->
    @github.push item
    @robot.brain.set 'github', @github
    msg.send "Okay, I added #{item}."
  remove: (item) ->
    @github = @github.filter (i) -> i isnt item
    @robot.brain.set 'github', @github
    msg.send "Okay, I removed #{item}."

module.exports = (robot) ->
  # Here's an instance of the above class but we're not actually calling any of the
  # methods yet. You can call them with `gitHub.add('something')`.
  gitHub = new GitHub robot
<% } else { %>module.exports = (robot) -><% } %>

  robot.respond /hello/, (msg) ->
    msg.reply "hello!"

  robot.hear /orly/, (msg) ->
    if robot.auth.isAdmin msg.envelope.user
      message = "yarly"
    else
      message = "Sorry, only admins can do that."
    msg.send message
