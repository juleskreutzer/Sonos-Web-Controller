// Functions All Speakers
function PauseAllSpeakers() {
  jQuery.ajax({
    url: '/pauseall'
  });
}

function ResumeAllSpeakers() {
  jQuery.ajax({
    url: '/resumeall'
  });
}

function MuteAllSpeakers() {
  var obj = JSON.parse(localStorage.getItem("Zones"));
  var i = 0;
  jQuery.each(obj, function(){
    jQuery.ajax({
      url: '/' + obj[i] + '/Volume/0'
    });
    i = i + 1;
  })
}

function DecreaseVolumeAllSpeakers() {
  var zones = JSON.parse(localStorage.getItem("Zones"));
  var i = 0;
  jQuery.each(zones, function() {

    jQuery.ajax({
      url: '/' + zones[i] + '/Volume/' + localStorage.getItem("Volume-decrease")
    });
    i = i + 1;
  });
}

function IncreaseVolumeAllSpeakers() {
  var zones = JSON.parse(localStorage.getItem("Zones"));
  var i = 0;
  jQuery.each(zones, function() {
    jQuery.ajax({
      url: '/' + zones[i] + '/Volume/' + localStorage.getItem("Volume-increase")
    });
    i = i + 1;
  });
}
// END Functions all Speakers

// Functions for Specific Speakers
function PauseSpecificSpeaker(){
  jQuery.ajax({
    url: '/' + localStorage.getItem("SelectedZone") + '/pause'
  });

  $("#nowPlaying").empty();
}

function PlaySpecificSpeaker(){
  jQuery.ajax({
    url: '/' + localStorage.getItem("SelectedZone") + '/play'
  });
  ShowCurrentPlaying(localStorage.getItem("SelectedZone"));
}

function IncreaseVolumeSpecificSpeaker(){
  jQuery.ajax({
    url: '/' + localStorage.getItem("SelectedZone") + '/volume/' + localStorage.getItem("Volume-increase")
  });
}

function DecreaseVolumeSpecificSpeaker(){
  jQuery.ajax({
    url: '/' + localStorage.getItem("SelectedZone") + '/volume/' + localStorage.getItem("Volume-decrease")
  });
}

function MuteSpecificSpeaker(){
  jQuery.ajax({
    url: '/' + localStorage.getItem("SelectedZone") + '/volume/' + localStorage.getItem("Volume-off")
  });
}
// END Functions for Specific Speakers

// Other Functions
function LoadSettings(){
  $("#default-volume").val(localStorage.getItem("Default-volume"));
  $("#volume-decrease").val(localStorage.getItem("Volume-decrease"));
  $("#volume-off").val(localStorage.getItem("Volume-off"));
  $("#selectedZone").val(localStorage.getItem("SelectedZone"));

  // We need to do some extra because the volume-increase in the local storage has a "+" in the beginning
  var increase = localStorage.getItem("Volume-increase");
  var res = increase.replace('+', '');
  $("#volume-increase").val(res);
  /*
  var speakers = localStorage.getItem("Zones"); <-- this gives an error
  jQuery.each(speakers, function(value) {
       $("#zones").append(this);
   });
   */
   $.ajax({
     url: "/Zones"
   }).done(function(data){
     var ZonesArray = "["
     jQuery.each(data, function(){
       $("#zones").append(this.coordinator.roomName + '\n');
     })
   });

}

function clearSettings() {
  localStorage.clear();
  location.reload();
}

function updateSettings() {
  swal({title: '',type: 'success', showConfirmButton: false, timer: 1100});

  localStorage.setItem("Volume-decrease", $("#volume-decrease").val());
  localStorage.setItem("Volume-increase", "+" + $("#volume-increase").val());
  localStorage.setItem("Default-volume", $("#default-volume").val());
}
function CreateDefaultSettings() {
  // +_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+
  // DO NOT CHANGE THESE SETTING WHEN YOU DON'T KNOW WHAT YOU ARE DOING !!
  // +_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+

  // Create the default settings for the web controller

  // Settings for volumes
  localStorage.setItem("Volume-off", "0");
  localStorage.setItem("Volume-decrease", "-5");
  localStorage.setItem("Volume-increase", "+5");
  localStorage.setItem("Default-volume", "15");

  // Setting for zones
  $.ajax({
    url: "/Zones"
  }).done(function(data){
    var ZonesArray = "["
    jQuery.each(data, function(){
      ZonesArray = ZonesArray + "\"" + this.coordinator.roomName + "\",";
    })
    ZonesArray = ZonesArray.replace(/,\s*$/, "");
    ZonesArray = ZonesArray + "]";
    localStorage.setItem("Zones", ZonesArray);
  });
}

function FillSelectWithZones(){
  var obj = JSON.parse(localStorage.getItem("Zones"));
  var i = 0;
  jQuery.each(obj, function(){
    if(obj[i] == localStorage.getItem("SelectedZone")){
      $('#SelectZone').append('<option value=' + obj[i] + ' selected>' + obj[i] + '</option>');
    }
    else {
      $('#SelectZone').append('<option value=' + obj[i] + '>' + obj[i] + '</option>');
    }
    i = i + 1;
  });
}

function ShowCurrentPlaying(Zone){
  var obj;
  jQuery.ajax({
    url: '/Zones'
  }).done(function(data){
    jQuery.each(data, function(){
      if(this.coordinator.roomName == Zone)
      {
        $("#nowPlaying").empty();

        if(this.coordinator.state.zoneState == "PLAYING"){
        $("#nowPlaying").append('<img src="http://i169.photobucket.com/albums/u236/darkashe_4002/GIF/equalizerblue.gif"/>&nbsp;');
        }

        $("#nowPlaying").append(this.coordinator.state.currentTrack.title);

        if(this.coordinator.state.currentTrack.type == "radio"){
          var streamInfo = this.coordinator.state.currentTrack.streamInfo;
          $("#nowPlaying").append(" - " + streamInfo);
        }
      }
    })
  });
}
