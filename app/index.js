var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var chalk = require('chalk');
var banner = require('./lib/banner');
var request = require('request-promise');
var updateNotifier = require('./lib/notifier');
var _ = require('lodash-addons');

updateNotifier();

// Set list of repos from which we grab standard files.
// These will be used in the downloadTemplate function in the writing priority.
var osLibraries = [
  'https://github.com/cfpb/open-source-project-template/archive/master.zip'
];

var extractScriptName = function (appname) {
  var slugged = _.slugify(appname);
  if (!/^(catops|hubot)-(.+)/.test(slugged)) {
    return 'catops-' + slugged;
  }
  return slugged;
};

var prepareKeywords = function(keywords) {
  var ky = ['hubot', 'hubot-scripts', 'catops'];
  ky = _.union(ky, keywords.split(','));
  for (i = 0; i < ky.length; ++i) {
    ky[i] = '"' + ky[i].trim() + '"';
  }
  return '[' + ky.join(',') + ']';
}

module.exports = yeoman.Base.extend({

  initializing: function() {
      this.option('skip-install');
      this.pkg = require('../package.json');
      banner();
      this.log(
        '\nWelcome to the CatOps Hubot script generator, brought\n' +
        'to you by the ' + chalk.green('Consumer Financial Protection Bureau') + '.'
      );
  },

  prompting: function() {
      var done = this.async();

      var scriptName = extractScriptName(this.appname);

      var prompts = [
        {
          name: 'scriptName',
          message: 'Name of your Hubot script',
          default: scriptName
        },
        {
          name: 'scriptDescription',
          message: 'Description',
          default: 'A Hubot script that does the things'
        },
        {
          name: 'scriptKeywords',
          message: 'Keywords (comma-separated)',
          default: 'hubot, hubot-scripts, catops'
        },
        {
          name: 'needStorage',
          message: 'Will this script require a database (Hubot\'s "brain") to persist data?',
          type: 'confirm',
          default: true
        },
        {
          name: 'needConfig',
          message: 'Will this script make use of environment variables (to store things like API keys)?',
          type: 'confirm',
          default: true
        }
      ];

      this.prompt(prompts, function (props) {
        this.appname = props.scriptName;
        this.scriptName = props.scriptName.toLowerCase().replace('catops-', '').replace('hubot-', '');
        this.scriptDescription = props.scriptDescription;
        this.needStorage = props.needStorage;
        this.envVariable = props.needConfig
                         ? 'HUBOT_' + this.scriptName.toUpperCase() + '_CONFIG - Describe your environment variable.'
                         : 'LIST_OF_ENV_VARS_TO_SET - Describe any optional/required environment variables.'
        this.scriptKeywords = prepareKeywords(props.scriptKeywords);

        done();
      }.bind(this));
  },

  writing: {
    downloadTemplate: function() {
      var numLibraries = osLibraries.length;
      var done = this._.after( numLibraries, this.async() );

      osLibraries.forEach(function (library) {
        this.extract(library, '_cache', done);
      }.bind(this));
    },
    metaFiles: function() {
      var files = ['.gitignore', 'TERMS.md', 'CONTRIBUTING.md', 'LICENSE'];

      // Copy over the OSPT files.
      files.forEach( function _copy( file ) {
        fs.createReadStream( this.destinationRoot() + '/_cache/open-source-project-template-master/' + file )
          .pipe( fs.createWriteStream(file) );
      }.bind(this));

      this.userName = this.user.git.name();
      this.userEmail = this.user.git.email();

      this.mkdir('script');
      this.copy('script/bootstrap', 'script/bootstrap');
      this.copy('script/test', 'script/test');

      this.mkdir('src');
      this.copy('src/template.coffee', 'src/' + this.scriptName + '.coffee');

      this.mkdir('test');
      this.copy('test/template-test.coffee', 'test/' + this.scriptName + '-test.coffee');

      this.copy('Gruntfile.js', 'Gruntfile.js');
      this.copy('.travis.yml', '.travis.yml');
      this.copy('index.coffee', 'index.coffee');
      this.copy('_package.json', 'package.json');
      this.copy('README.md', 'README.md');

    },
    cleanUp: function() {
      var done = this.async();
      rimraf( this.destinationRoot() + '/_cache', done );
    }
  },

  install: function() {
    this.installDependencies({bower: false, skipInstall: this.options['skip-install']});
  },

  end: function () {
    this.log( yosay('All done! Edit `src/' + this.scriptName + '.coffee`. Your tests are in `test/' + this.scriptName + '.coffee`. Run them with `npm test`.') );
  }

});
