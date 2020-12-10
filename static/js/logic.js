// To Do: 
//    - build dict => {country_name:[{year1:specs1},{year2:specs2}....{yearN:specsN}]}
// Create endpoint for geojson
var counter = 0
var oldEvent = 0
let c

const async_endpoint_data = d3.json('/ultimate')
const async_geojson_data = d3.json('/static/js/africaGeoJson.json')

const conflictTilelayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/dark-v9",
      accessToken: 'sk.eyJ1IjoiY2FybHlma2VsbHkiLCJhIjoiY2tkZ3U4Z3B3Mmx6dDJ4cG16Y2l6eWQ1bCJ9.ewwhVCi9nw45LL2iNZ1hbA'
})


const corruptionTilelayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/dark-v9",
      accessToken: 'sk.eyJ1IjoiY2FybHlma2VsbHkiLCJhIjoiY2tkZ3U4Z3B3Mmx6dDJ4cG16Y2l6eWQ1bCJ9.ewwhVCi9nw45LL2iNZ1hbA'
})

const map = L.map("map", {
  center: [-1.170320, 23.241192],
  zoom: 3,
  layers: [conflictTilelayer]//[conflict_layer, curroption_layer]// added this to get layers
});

const baseMaps = {
  'conflict':conflictTilelayer,
  'corruption':corruptionTilelayer
}

function populatedCountryDropDown(){
  async_endpoint_data.then(data => {
    array_values = []
    data.forEach(country => {
      country_name = country.country_name
      array_values.push(country_name)
    })
    array_values = array_values.sort() // must sort before converting to set. Sets are inmutable and hold unique values
    array_values = new Set(array_values)
    d3.select('#countryDD').append('option').text('African Countries (All)')
    array_values.forEach(country_name => {
      d3.select('#countryDD').append('option').text(country_name)
    })
  })
}

function mouseover(event){
  event.target.setStyle({color:'black', weight:4})
}

function mouseout(event){
  event.target.setStyle({color:'black', weight:1})
}

function clickMap_updateDropDown(clicked_country){
  // document.getElementById('countryDD').value = clicked_country
  d3.select('#countryDD').node().value = clicked_country
}

function updateEventSequence_applyMouseEventsOldEvent(event, oldEvent){
  if(oldEvent != event && oldEvent != 0){
    oldEvent.target.on({mouseout:mouseout, mouseover:mouseover})
    mouseout(oldEvent)
    return event
  }

  return event
}

function build_graph(x_axis, y_axis){
  // console.log(x_axis)
  // console.log(y_axis)
  let data = [{
    x:x_axis,
    y:y_axis,
    type:'bar'
  }]

  Plotly.newPlot('one',data)
}

function getClickedCountryInfo(clicked_country){
    async_endpoint_data.then(endpoint_data => {
    let country_info = endpoint_data.filter(c => (c.country_name == clicked_country))
    let year_array = country_info.map(c => c.year)
    let value_array = country_info.map(c => c.conflict_events)
    build_graph(year_array, value_array)  
  })
}

function click(event){ 
  var clicked_country = event.target.feature.properties.name
  clickMap_updateDropDown(clicked_country)
  mouseover(event)
  event.target.off({mouseout:mouseout})
  oldEvent = updateEventSequence_applyMouseEventsOldEvent(event, oldEvent)// need better discriptive function name
  getClickedCountryInfo(clicked_country)
}

function onEachFeature(feature, layer){
  layer.on({
    mouseover:mouseover,
    mouseout:mouseout,
    click:click
  })
}

function getFillColor(d, c) { // imporveo by using range and quartiles 
    if (c === 0){
      // console.log(d)
      // console.log(d.properties.conflict_events)
    
      d = d.properties.conflict_events
     
      return  d > 1000 ? '#800026' :
              d > 500  ? '#BD0026' :
              d > 200  ? '#E31A1C' :
              d > 100  ? '#FC4E2A' :
              d > 50   ? '#FD8D3C' :
              d > 20   ? '#FEB24C' :
              d > 10   ? '#FED976' :
                        '#FFEDA0';  
    }
    else if(c === 1){
      d = d.properties.corruption_percentile
      return  d > 40  ? '#180080' :
              d > 35  ? '#2f198c' :
              d > 30  ? '#463299' :
              d > 25  ? '#5d4ca6' :
              d > 20  ? '#7466b2' :
              d > 15  ? '#8b7fbf' :
              d > 10  ? '#a299cc' :
              d > 5   ? '#b9b2d8' :
                        '#d0cce5';  
    }    
}

async_endpoint_data.then(endpoint_data => {
  async_geojson_data.then(geojson_data=>{
    endpoint_data.forEach(point_c => {
      if(point_c.year == '2018'){
        geojson_data.features.forEach(json_c => {
          if(point_c.country_name == json_c.properties.name){
            json_c.properties.conflict_events = point_c.conflict_events
            json_c.properties.conflict_fatalities = point_c.conflict_fatalities
            json_c.properties.corruption_percentile = point_c.corruption_control_percentile
            json_c.properties.gov_effect_percentile = point_c.government_effectiveness_percentile
          }
        })
      }
    })

    function layer_style(feature,c){
      var fillColor = getFillColor(feature, c)
      return{
        fillColor: fillColor,
        color: 'black',
        weight: 1
        }
    }

    function setGeojsonLayer(c){ // imporve by using parameter values as function name. no need to use switch
      var geojson_layer = L.geoJson(geojson_data,{
        style:function(feature){ return layer_style(feature, c)},
        onEachFeature:onEachFeature
      })
      return geojson_layer
    }

    var current_layer = setGeojsonLayer(0)

    function updateMapLayer(c){
        map.removeLayer(current_layer)
        current_layer = setGeojsonLayer(c)
        current_layer.addTo(map)
    }

    console.log(document.getElementsByClassName('leaflet-control-layers-selector')[0].nextSibling.firstChild.nodeValue)
 
    document.getElementsByClassName('leaflet-control-layers-selector')[0].addEventListener('click', function(){updateMapLayer(0)})
    document.getElementsByClassName('leaflet-control-layers-selector')[1].addEventListener('click', function(){updateMapLayer(1)})
    updateMapLayer(0)
  })
})




L.control.layers(baseMaps).addTo(map)
populatedCountryDropDown()


