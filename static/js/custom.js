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
  var decrease = localStorage.getItem("Volume-decrease");
  var i = 0;
  jQuery.each(zones, function() {
    jQuery.ajax({
      url: '/' + zones[i] + '/Volume/' + decrease
    });
    i = i + 1;
  });
}

function IncreaseVolumeAllSpeakers() {
  var zones = JSON.parse(localStorage.getItem("Zones"));
  var increase = localStorage.getItem("Volume-increase");
  var i = 0;
  jQuery.each(zones, function() {
    jQuery.ajax({
      url: '/' + zones[i] + '/Volume' + increase
    });
    i = i + 1;
  });
}
// END Functions all Speakers

function CreateDefaultSetting() {
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

// Functions for Specific Speakers
function PauseSpecificSpeaker(){
  jQuery.ajax({
    url: '/' + localStorage.getItem("SelectedZone") + '/pause'
  });
}

function PlaySpecificSpeaker(){
  jQuery.ajax({
    url: '/' + localStorage.getItem("SelectedZone") + '/play'
  });
}

function IncreaseVolumeSpecificSpeaker(){
  jQuery.ajax({
    url: '/' + localStorage.getItem("SelectedZone") + '/volume/' + localStorage.getItem("Volume-increase")
  });
}

function DecreaseVolumeSpecificSpeaker(){
  jQuery.ajax({
    url: '/' + localStorage.getItem("SelectedZone") + '/volume' + localStorage.getItem("Volume-decrease")
  });
}

function MuteSpecificSpeaker(){
  jQuery.ajax({
    url: '/' + localStorage.getItem("SelectedZone") + '/volume/' + localStorage.getItem("Volume-off")
  });
}
