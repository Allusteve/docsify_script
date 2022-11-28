let defaultDocsifyUpdatedOptions = {
  text: ">Last Modified: ",
  formatUpdated: "{YYYY}/{MM}/{DD}",
  whereToPlace: "bottom"
}

var CONFIG = {
    repo: 'Allusteve/notes',
    basePath: 'docs/',
    preString: 'Last modified:',
    dateFormat: '{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}',
    align: 'right',
};




// Docsify plugin functions
function plugin(hook, vm) {
  

  

  let whereToPlace = String(vm.config.timeUpdater.whereToPlace).toLowerCase()
  hook.beforeEach(function (content) {
    
    var time = '{docsify-updated}';
  if (CONFIG.repo !== '') {
      var date_url = 'https://api.github.com/repos/' + CONFIG.repo + '/commits?per_page=1';

      if (CONFIG.basePath !== '') {
          date_url = date_url + '&path=' + CONFIG.basePath + vm.route.file;
      }
      fetch(date_url).then((response) => {
        return response.json();
      }).then((commits) => {
          if (commits.length > 0) {
              time = tinydate(CONFIG.dateFormat)(new Date(commits[0]['commit']['committer']['date']));
          }
      });
  }
    
    let text = vm.config.timeUpdater.text + time
    switch (whereToPlace) {
      case "top":
        return text + "\n\n" + content
      case "bottom":
        return content + "\n\n" + text
      default:
        return content + "\n\n" + text
    }
  })
}

// Docsify plugin options
window.$docsify = (window.$docsify || {})
// https://docsify.js.org/#/configuration?id=formatupdated
// https://github.com/lukeed/tinydate#patterns
window.$docsify.plugins = (window.$docsify.plugins || []).concat(plugin)
