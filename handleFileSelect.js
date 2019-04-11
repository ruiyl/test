function handleFileSelect(evt) {
  var file = evt.target.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var motions = parseAMC(e.target.result);
    hero.setAMC(motions);
  }
  reader.readAsText(file);
}