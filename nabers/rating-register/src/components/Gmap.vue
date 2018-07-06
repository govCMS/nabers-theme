<template>
  <div id="map" :style="{height: containerHeight}"></div>
</template>

<script>
  export default {
    data: function () {
      return {
        markerCluster: null,
        markers: [],
        polygons: [],
        map: {},
        visibleMarkersCount: 0
      }
    },
    methods: {
      initMap() {
        console.log('+> Initialize map');
        this.map = new google.maps.Map(document.getElementById('map'), this.mapoptions);
        this.map.addListener('idle', this.countVisibleMarkers);
        this.addMarkers();
        this.addPolygons();
      },
      markerClick: function (marker) {
        this.$emit('markerclick', marker);
      },
      addMarkers() {
        console.log('add markers');
        var self = this;

        // Clear markers.
        if (this.markerCluster != null) {
          this.markerCluster.clearMarkers();
        }

        // Generate markers.
        this.markers = this.mapmarkers.map(this.addMarker);

        var cluster_image = self.assetsFolder + '/cluster_small.png';
        var size = 59;

        // Add to cluster.
        this.markerCluster = new MarkerClusterer(this.map, this.markers, {
          maxZoom: 16,
          styles: [{
            url: cluster_image,
            width: 59,
            height: 59,
            textColor: 'white'
          }, {
            url: self.assetsFolder + '/cluster_medium.png',
            width: 79,
            height: 79,
            textColor: 'white'
          }, {
            url: self.assetsFolder + '/cluster_large.png',
            width: 89,
            height: 89,
            textColor: 'white'
          }]
        });
        this.countVisibleMarkers();
      },
      addMarker(item, i) {
        var self = this;

        var icon = this.getIcon();

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(item.Latitude, item.Longitude),
          item: item,
          index: i,
          icon: icon
        });
        marker.addListener('click', function () {
          self.markerClick(marker);
        });
        return marker;
      },
      addPolygons() {
        console.log('Add Polygons');
        var self = this;

        // Clear polygons.
        self.polygons.forEach(function (item, i) {
          item.setMap(null);
        });

        // Add polygons.
        this.polygons = this.mappolygons.map(function (poly, i) {
          var newPoly = new google.maps.Polygon(self.getPolygonFill(poly.coords));
          newPoly.setMap(self.map);
          return newPoly;
        });
      },
      getPolygonFill: function (coords) {
        return {
          paths: coords,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        };
      },
      countVisibleMarkers: function () {
        var bounds = this.map.getBounds();
        var current_marker;
        var visibleMarkersCount = 0;
        // Count markers that are visible within the map bounds.
        for (var i = 0; i < this.markers.length; i++) {
          current_marker = this.markers[i];
          if (bounds.contains(current_marker.getPosition())) {
            visibleMarkersCount++;
          }
        }
        this.$emit('updateVisibleMarkersCount', visibleMarkersCount);
      },
      getIcon: function (selectedIcon = false) {
        var self = this;
        var file = !selectedIcon ? 'icon_building.png' : 'icon_selected_building.png';
        var size = !selectedIcon ? new google.maps.Size(48, 62) : new google.maps.Size(52, 66)
        return {
          url: self.assetsFolder + '/' + file,
          scaledSize: size
        };
      }
    },
    mounted() {
      this.initMap();
    },
    props: ['mapoptions', 'mapmarkers', 'mappolygons', 'assetsFolder', 'selectedMarker', 'containerHeight'],
    watch: {
      mapoptions: {
        handler: function (newVal, oldVal) {
          this.map.setZoom(newVal.zoom);
          this.map.setCenter(newVal.center);
          google.maps.event.trigger(this.map, 'resize');
        },
        deep: true
      },
      mapmarkers: function (newVal, oldVal) {
        console.log('Map Markers Set');
        this.addMarkers();
      },
      mappolygons: function (newVal, oldVal) {
        console.log('Map Polygons Set');
        this.addPolygons();
      },
      selectedMarker: function (newVal, oldVal) {
        var self = this;
        var defaultIcon = this.getIcon();
        var selectedMarkerIcon = this.getIcon(true);
        if (newVal !== null) {
          for (var i = 0; i < self.markers.length; i++) {
            var item = self.markers[i].item;
            if (oldVal !== null && item.Latitude === oldVal.Latitude && item.Longitude === oldVal.Longitude) {
              self.markers[i].setIcon(defaultIcon);
            }
            if (item.Latitude === newVal.Latitude && item.Longitude === newVal.Longitude) {
              self.markers[i].setIcon(selectedMarkerIcon);
            }
          }
        }
      }
    }
  }
</script>
