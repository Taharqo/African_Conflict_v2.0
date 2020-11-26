// To Do: 
//    - build dict => {country_name:[{year1:specs1},{year2:specs2}....{yearN:specsN}]}
// Create endpoint for geojson
var endpoint_url = '/ultimate'

var geojson_url = '/static/js/africaGeoJson.json'
var old_event
var selected_layer = 'Conflict'
var selected_country = 'Algeria'
var selected_year = 2009
var first_run = 1
const mouseout_style = {color:'black',weight:1}
const mouseover_style = {color:'black', weight:3}
const click_style = mouseover_style

//////////////////////////////////// play ground /////////////////////////////
let endpoint_data = d3.json(endpoint_url).then(endpoint_url_response => {
  return endpoint_url_response
})

let geojson_data = d3.json(geojson_url).then(geojson_url_response => {
  return geojson_url_response
})
  
function test_function(){
  console.log(endpoint_data)
  console.log(geojson_data)
}

test_function()
//////////////////////////////////// play ground /////////////////////////////



//vvvvvvvvvvvvvvvvvvvvvvv chloropleth vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function getColor(d){
  // console.log(d)
  // console.log(selected_layer)
  // console.log(d.conflict_fatalities)
    if(selected_layer === 'Conflict'){
      d = d.conflict_fatalities
      return  d > 1000 ? '#800026' :
              d > 500  ? '#BD0026' :
              d > 200  ? '#E31A1C' :
              d > 100  ? '#FC4E2A' :
              d > 50   ? '#FD8D3C' :
              d > 20   ? '#FEB24C' :
              d > 10   ? '#FED976' :
                        '#FFEDA0';
      }

      else if(selected_layer === 'Curroption'){
        d = d.curroption
        return d > 3.5 ? '#800026' :
              d > 3  ? '#BD0026' :
              d > 2.5  ? '#E31A1C' :
              d > 2  ? '#FC4E2A' :
              d > 1.5   ? '#FD8D3C' :
              d > 1  ? '#FEB24C' :
              d > .5   ? '#FED976' :
                          '#FFEDA0';
      }
    }
  
  
  function style(feature){  
    // console.log(Object.keys(feature.properties).sort()) 

    return{
      fillColor: getColor(feature.properties),
      weight: 1,
      opacity: 1,
      color: 'black',
      dashArray: '1',
      fillOpacity: 1
    }
  }
  
  //^^^^^^^^^^^^^^^^^^^^^^^ chloropleth ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  
  //vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Global Variables vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
 
  const tile_attribution_url = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v9",
    accessToken: 'sk.eyJ1IjoiY2FybHlma2VsbHkiLCJhIjoiY2tkZ3U4Z3B3Mmx6dDJ4cG16Y2l6eWQ1bCJ9.ewwhVCi9nw45LL2iNZ1hbA'
  })
  
    // loading the tile layer and adding it to the intialized map
  var conflict_layer = tile_attribution_url

  var curroption_layer = tile_attribution_url

  var map = L.map("map", {
    center: [-1.170320, 23.241192],
    zoom: 3,
    layers: [conflict_layer, curroption_layer]// added this to get layers
  });

  var baseMaps = {
      "Conflict": conflict_layer,
      "Curroption": curroption_layer
  }

  L.control.layers(baseMaps).addTo(map) 
 
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global Variables ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   
  
  function getSelectedYear(){
    selected_year = d3.select('#yearDD').node().value
    getEndpointData()
  }
  
  function getSelectedCountry(){
    selected_country = d3.select('#countryDD').node().value
    getEndpointData()
  }
  
  function getConflictText(){
    selected_layer = document.getElementsByClassName('leaflet-control-layers-selector')['0'].labels['0'].innerText
    buildMap()
  }

  function getCurroptionText(){
    selected_layer = document.getElementsByClassName('leaflet-control-layers-selector')['1'].labels['0'].innerText
    buildMap()
  }
  //vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Event listeners vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  
  document.getElementsByClassName('leaflet-control-layers-selector')['0'].addEventListener('click',getConflictText)
  document.getElementsByClassName('leaflet-control-layers-selector')['1'].addEventListener('click',getCurroptionText)

  d3.select('#yearDD').on('change',getSelectedYear)
  d3.select('#countryDD').on('change',getSelectedCountry)
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Event listeners ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
  
  
  //vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Geojson functions vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  
  function whenMouseover(event){
    if((typeof old_event == 'undefined')||(old_event.target.feature.properties.name != event.target.feature.properties.name)){
      event.target.setStyle(mouseover_style)
    }
  }
  
  function whenMouseout(event){
    if((typeof old_event == 'undefined')||(old_event.target.feature.properties.name != event.target.feature.properties.name)){
      event.target.setStyle(mouseout_style)
    }
  }
  
  function whenClickedcheck(event){
    if(typeof old_event == 'undefined'){
      old_event = event
      event.target.setStyle({color:'black', weight:3})
    }
  
    if(typeof old_event != 'undified'){
      if(old_event.target.feature.properties.name != event.target.feature.properties.name){
        old_event.target.setStyle(mouseout_style)
        event.target.setStyle(click_style)
        old_event = event
        
      }
    }
  }
  
  function L_onEachFeature(feature, conflict_layer, curroption_layer){
    conflict_layer.on({mouseover:whenMouseover})
    conflict_layer.on({mouseout:whenMouseout})
    conflict_layer.on({click:whenClickedcheck})
  }
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Geojson functions ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  
 

  //vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv inserting data from endpoint to geojson to use for chloropleth vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  function geojsonUpdate(response_endpoint_data, response_geojson_data){
    response_endpoint_data.forEach(endpoint_country => {
        if(endpoint_country.year == '2018'){
            response_geojson_data.features.forEach(geojson_country =>{
              if(endpoint_country.country_name == geojson_country.properties.name){
                geojson_country.properties.conflict_fatalities = endpoint_country.conflict_fatalities 
                geojson_country.properties.curroption = endpoint_country.corruption_control_percentile          
              }
            })
          }
        })  
    }

  function addLayer(response_geojson_data){
    // console.log(response_geojson_data)
    L.geoJson(response_geojson_data,{
        style:style,
        onEachFeature: L_onEachFeature
      }).addTo(map)
  }

  function insert2018dataInGeojson(response_geojson_data){
    d3.json(endpoint_url).then(response_endpoint_data => {
        geojsonUpdate(response_endpoint_data, response_geojson_data)
      }).then( () => {
          addLayer(response_geojson_data)        
      })
    }
  //^^^^^^^^^^^^^^^^^^^^^^^^^^ add data from endpoint to geojson to use for chloropleth ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  
  
  //vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Endpoint Functions vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  function getSelectedCountryYearData(data){
      data.forEach(d => {
        if(d.country_name == selected_country && d.year == selected_year){
        }
      })
  }
  
  function populateDateDropdown(data){    
      var dupe_date = []
      
      data.forEach(d => {
        dupe_date.push(d.year)
      })
  
      dupe_date.sort()
      unique_date = new Set(dupe_date) 
  
      unique_date.forEach(date =>{
        d3.select('#yearDD').append('option').text(date)
    })
  }
  
  function populateCountryDropdown(data){
  
    var dupe_country = []
    
    dupe_country.push('African Countries (All)')
  
    data.forEach(d => {
      dupe_country.push(d.country_name)
    })
  
    dupe_country.sort()
    unique_country = new Set(dupe_country)
    
    unique_country.forEach(c =>{
      d3.select('#countryDD').append('option').text(c)
    })
  }
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Endpoint Functions ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv ENDPOINT: used to populate dorpdowns vvvvvvvvvvvvvvvvvvvvv
  function getEndpointData(){
      d3.json(endpoint_url).then(response_endpoint_data => {
        
        getSelectedCountryYearData(response_endpoint_data)
     
        if(first_run == 1){
          populateDateDropdown(response_endpoint_data)
          populateCountryDropdown(response_endpoint_data)
        }
  
        first_run = 0
  
    })
  }
  
  getEndpointData()
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ENDPOINT: used to populate dorpdowns ^^^^^^^^^^^^^^^^^^^^^
  
  
  //vvvvvvvvvvv GEOJSON: used to build basemap, add geojson data, map layers, and map interactivity vvvvvvvvvvvv
 function buildMap(){
  d3.json(geojson_url).then(response_geojson_data=>{
    map
    // conflict_layer.addTo(map)
    insert2018dataInGeojson(response_geojson_data)   
  }) 
 } 
 
 buildMap()
 //^^^^^^^6GEOJSON: used to build basemap, add geojson data, map layers, and map interactivity^^^^^^^^^^^^^^ 