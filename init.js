window.addEventListener('load', init, false);

function init(event){
//document.getElementById('files').addEventListener('change', handleFileSelect, false);
  initScreenAnd3D();
  createLights();
  createHero();
  loop();
}