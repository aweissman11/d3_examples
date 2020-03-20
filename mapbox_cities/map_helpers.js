mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2LWF3ZWlzc21hbjExIiwiYSI6ImNrODBiYmwyZjAxODUzbHBodXIwbHU2Z2UifQ.gFzfxqBqHcTuWMl9I-T6vw'; // replace this with your access token

var filtersWrapper = document.getElementById('filters-wrapper');
var mapLegend = document.getElementById('map-legend');

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/dev-aweissman11/ck80bpml71ggf1ilj6kwqy5us', // replace this with your style URL
  center: [-116.752, 41.833],
  zoom: 3
});

let getHtml = (props) => {
  return '<h3>' + props.name + '</h3>' +
    '<p><b>Solar PV per Capita: </b>' + props.PerCapitaSolar + '</p>' +
    '<p><b>National Rank: </b>' + props.PerCapitaSolarRank + '</p>' +
    '<p><b>Solar PV per Capita: </b>' + props.SolarInstalled + '</p>' +
    '<p><b>National Rank: </b>' + props.SolarRank + '</p>'
}

map.on('load', function () {
  var cityFeatures = map.querySourceFeatures('composite', {
    sourceLayer: 'shining-cities'
  });

  let showShiningCities = false;
  let filterDropper = document.createElement('div');
  filterDropper.id = 'filter-dropper';
  filterDropper.textContent = '| | |';
  filterDropper.addEventListener('click', (e) => {
    filtersWrapper.style.height = showShiningCities ? '48px' : 'auto';
    filterDropper.style.transform = showShiningCities ? '' : 'rotate(90deg)';
    showShiningCities = !showShiningCities;
  });

  let filterFlexBox = document.createElement('div');
  filterFlexBox.className = 'filter-flex-box';

  let filterGroup1 = document.createElement('div');
  filterGroup1.className = 'filter-group';
  filterGroup1.id = 'filter-group-1';

  let rankingTitle = document.createElement('h2');
  rankingTitle.className = 'rank-title';
  rankingTitle.textContent = "America's Top Shining Cities";

  let rankingInstructions = document.createElement('p');
  rankingInstructions.className = 'rank-instructions';
  rankingInstructions.textContent = "Click for details";

  let capitaTitle = document.createElement('p');
  capitaTitle.className = 'rank-type';
  capitaTitle.textContent = "By Solar PV Installed per Capita:";

  filtersWrapper.appendChild(filterDropper);
  filtersWrapper.appendChild(rankingTitle);
  filtersWrapper.appendChild(rankingInstructions);
  filtersWrapper.appendChild(filterFlexBox);
  filterFlexBox.appendChild(filterGroup1);
  filterGroup1.appendChild(capitaTitle);

  cityFeatures.sort((a, b) => {
    return a.properties.PerCapitaSolarRank - b.properties.PerCapitaSolarRank;
  })
  let capitaCities = cityFeatures.slice(0, 10);
  capitaCities.forEach(function (feature, i) {
    let button = document.createElement('p');
    button.className = 'rank-btn';
    button.textContent = (i + 1) + '. ' + feature.properties.City;
    filterGroup1.appendChild(button)

    button.addEventListener('click', function (e) {
      var popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(getHtml(feature.properties))
        .addTo(map);

      map.flyTo({ center: feature.geometry.coordinates, zoom: 3.5 });

      if (showShiningCities) {
        filtersWrapper.style.height = showShiningCities ? '48px' : 'auto';
        showShiningCities = !showShiningCities;
      }
    });
  });



  let filterGroup2 = document.createElement('div');
  filterGroup2.className = 'filter-group';
  filterGroup2.id = 'filter-group-2';
  filterFlexBox.appendChild(filterGroup2);

  let totalTitle = document.createElement('p');
  totalTitle.className = 'rank-type';
  totalTitle.textContent = "By Solar PV Installed per Capita:";

  filterGroup2.appendChild(totalTitle);

  cityFeatures.sort((a, b) => a.properties.SolarRank - b.properties.SolarRank)
  let totalCities = cityFeatures.slice(0, 10);
  totalCities.forEach(function (feature, i) {
    let button = document.createElement('p');
    button.className = 'rank-btn';
    button.textContent = (i + 1) + '. ' + feature.properties.City;
    filterGroup2.appendChild(button)

    button.addEventListener('click', function (e) {
      var popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(getHtml(feature.properties))
        .addTo(map);

      map.flyTo({ center: feature.geometry.coordinates, zoom: 3.5 });

      if (showShiningCities) {
        filtersWrapper.style.height = showShiningCities ? '48px' : 'auto';
        showShiningCities = !showShiningCities;
      }
    });
  });
});


map.on('click', function (e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['shining-cities'] // replace this with the name of the layer
  });

  if (!features.length) {
    return;
  }

  var feature = features[0];

  var popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(getHtml(feature.properties))
    .addTo(map);
});

//   let bounds = [
//     [-178, 0],
//     [-50, 70]
//   ];

// // map.setMaxBounds(bounds);

map.on('load', function () {
  let capitaRankings = [
    {
      title: '< 5 - Solar Beginners',
      color: '#ffff35',
      min: 0,
      max: 5
    },
    {
      title: '5-25 - Solar Builders',
      color: '#ffbb00',
      min: 5,
      max: 25
    },
    {
      title: '25-50 - Solar Leaders',
      color: '#ff6e00',
      min: 25,
      max: 50
    },
    {
      title: '> 50 - Solar Stars',
      color: '#ff3700',
      min: 50,
      max: 99999999999999999
    },
    {
      title: 'Clear Filters',
      color: '#fff',
      min: 0,
      max: 99999999999999999
    }
  ]

  let legendTitle = document.createElement('p');
  legendTitle.innerHTML = ' <p id="legend-title" ><b> 2018 Solar PV Capacity per Capita</b></p><p>(Watts per Person)</p><p>Click to Filter</p>'
  mapLegend.appendChild(legendTitle);

  let showLegend = false;
  let legendDropper = document.createElement('div');
  legendDropper.id = 'legend-dropper';
  legendDropper.textContent = '| | |';
  legendDropper.addEventListener('click', (e) => {
    mapLegend.style.height = showLegend ? '40px' : 'auto';
    legendDropper.style.transform = showLegend ? '' : 'rotate(90deg)';
    showLegend = !showLegend;
  });

  mapLegend.appendChild(legendDropper);

  let legendFlexBox = document.createElement('div');
  mapLegend.appendChild(legendFlexBox);

  capitaRankings.forEach((rank) => {
    let ranking = document.createElement('p');
    ranking.textContent = rank.title;
    let colorDot = document.createElement('span');
    ranking.appendChild(colorDot);
    colorDot.style.background = rank.color;

    legendFlexBox.appendChild(ranking);


    ranking.addEventListener('click', function(e) {
      map.setFilter(
        'shining-cities',
        [
          'all',
          ['>', 'PerCapitaSolar', rank.min],
          ['<', 'PerCapitaSolar', rank.max]
        ]
      )
    });
  });
});
