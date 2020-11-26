let endpoint_url = '/ultimate'
let geojson_url = '/static/js/africaGeoJson.json'

let endpoint_data = d3.json(endpoint_url).then(endpoint_url_response => {
    return endpoint_url_response
})

let geojson_data = d3.json(geojson_url).then(geojson_url_response => {
    return geojson_url_response
})

let geojson_updated = geojsonAddConflictCurroptionFromEndpoint(geojson_data, endpoint_data){
      
}
