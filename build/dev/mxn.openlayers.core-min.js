/*
MAPSTRACTION   v3.0.21   http://www.mapstraction.com

The BSD 3-Clause License (http://www.opensource.org/licenses/BSD-3-Clause)

Copyright (c) 2013 Tom Carden, Steve Coast, Mikel Maron, Andrew Turner, Henri Bergius, Rob Moran, Derek Fowler, Gary Gale
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the Mapstraction nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
mxn.register("openlayers",{Mapstraction:{init:function(c,d){var e=this;if(typeof OpenLayers.Map==="undefined"){throw new Error(d+" map script not imported")}this.controls={pan:null,zoom:null,overview:null,scale:null,map_type:null};var f=new OpenLayers.Map(c.id,{maxExtent:new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),maxResolution:156543,numZoomLevels:18,units:"m",projection:"EPSG:900913",controls:[new OpenLayers.Control.Navigation(),new OpenLayers.Control.ArgParser(),new OpenLayers.Control.Attribution()]});this.layers={};this.layers.osm=new OpenLayers.Layer.TMS("OpenStreetMap",["http://a.tile.openstreetmap.org/","http://b.tile.openstreetmap.org/","http://c.tile.openstreetmap.org/"],{type:"png",getURL:function(k){var j=this.map.getResolution();var g=Math.round((k.left-this.maxExtent.left)/(j*this.tileSize.w));var n=Math.round((this.maxExtent.top-k.top)/(j*this.tileSize.h));var m=this.map.getZoom();var h=Math.pow(2,m);if(n<0||n>=h){return null}else{g=((g%h)+h)%h;var l=m+"/"+g+"/"+n+"."+this.type;var i=this.url;if(i instanceof Array){i=this.selectUrl(l,i)}return i+l}},displayOutsideMaxExtent:true});f.events.register("click",f,function(h){var i=f.getLonLatFromViewPortPx(h.xy);var g=new mxn.LatLonPoint();g.fromProprietary(d,i);e.click.fire({location:g})});f.events.register("zoomend",f,function(g){e.changeZoom.fire()});f.events.register("moveend",f,function(g){e.moveendHandler(e);e.endPan.fire()});var a=function(g){e.load.fire();this.events.unregister("loadend",this,a)};for(var b in this.layers){if(this.layers.hasOwnProperty(b)){if(this.layers[b].visibility===true){this.layers[b].events.register("loadend",this.layers[b],a)}}}f.addLayer(this.layers.osm);this.tileLayers.push(["http://a.tile.openstreetmap.org/",this.layers.osm,true]);this.maps[d]=f;this.loaded[d]=true},applyOptions:function(){var b=this.maps[this.api],c=b.getControlsByClass("OpenLayers.Control.Navigation"),a;if(c.length>0){a=c[0];if(this.options.enableScrollWheelZoom){a.enableZoomWheel()}else{a.disableZoomWheel()}if(this.options.enableDragging){a.activate()}else{a.deactivate()}}},resizeTo:function(b,a){this.currentElement.style.width=b;this.currentElement.style.height=a;this.maps[this.api].updateSize()},addControls:function(a){var b=this.maps[this.api];if("zoom" in a){if(a.zoom=="large"){this.controls.zoom=this.addLargeControls()}else{if(a.zoom=="small"){this.controls.zoom=this.addSmallControls()}}}else{if(this.controls.zoom!==null){this.controls.zoom.deactivate();b.removeControl(this.controls.zoom);this.controls.zoom=null}}if("pan" in a&&a.pan&&((!"zoom" in a)||("zoom" in a&&a.zoom=="small"))){if(this.controls.pan===null){this.controls.pan=new OpenLayers.Control.PanPanel();b.addControl(this.controls.pan)}}else{if(this.controls.pan!==null){this.controls.pan.deactivate();b.removeControl(this.controls.pan);this.controls.pan=null}}if("overview" in a&&a.overview){if(this.controls.overview===null){this.controls.overview=new OpenLayers.Control.OverviewMap();b.addControl(this.controls.overview)}}else{if(this.controls.overview!==null){this.controls.overview.deactivate();b.removeControl(this.controls.overview);this.controls.overview=null}}if("map_type" in a&&a.map_type){this.controls.map_type=this.addMapTypeControls()}else{if(this.controls.map_type!==null){this.controls.map_type.deactivate();b.removeControl(this.controls.map_type);this.controls.map_type=null}}if("scale" in a&&a.scale){if(this.controls.scale===null){this.controls.scale=new OpenLayers.Control.ScaleLine();b.addControl(this.controls.scale)}}else{if(this.controls.scale!==null){this.controls.scale.deactivate();b.removeControl(this.controls.scale);this.controls.scale=null}}},addSmallControls:function(){var a=this.maps[this.api];this.addControlsArgs.pan=false;this.addControlsArgs.scale=false;this.addControlsArgs.zoom="small";if(this.controls.zoom!==null){this.controls.zoom.deactivate();a.removeControl(this.controls.zoom)}this.controls.zoom=new OpenLayers.Control.ZoomPanel();a.addControl(this.controls.zoom);return this.controls.zoom},addLargeControls:function(){var a=this.maps[this.api];if(this.controls.zoom!==null){this.controls.zoom.deactivate();a.removeControl(this.controls.zoom)}this.controls.zoom=new OpenLayers.Control.PanZoomBar();a.addControl(this.controls.zoom);return this.controls.zoom},addMapTypeControls:function(){var b=this.maps[this.api];var a=null;if(this.controls.map_type===null){a=new OpenLayers.Control.LayerSwitcher({ascending:false});b.addControl(a)}else{a=this.controls.map_type}return a},setCenterAndZoom:function(a,b){var d=this.maps[this.api];var c=a.toProprietary(this.api);d.setCenter(a.toProprietary(this.api),b)},addMarker:function(b,a){var e=this.maps[this.api];var d=b.toProprietary(this.api);if(!this.layers.markers){var g=new OpenLayers.Style({cursor:"pointer",graphicZIndex:2});var f=g;var c=new OpenLayers.StyleMap({"default":g,select:f});this.layers.markers=new OpenLayers.Layer.Vector("markers",{reportError:true,styleMap:c,rendererOptions:{yOrdering:true,zIndexing:true}});e.addLayer(this.layers.markers);select=new OpenLayers.Control.SelectFeature(this.layers.markers,{multiple:true,clickout:true,hover:false,highlightOnly:true,onSelect:function(h){h.mapstraction_marker.click.fire();select.unselect(h)},overFeature:function(i){var h=i.mapstraction_marker;if(!!h.hoverIconUrl){h.setUrl(h.hoverIconUrl)}if(h.hover&&!!h.popup){h.map.addPopup(h.popup);h.popup.show()}},outFeature:function(i){var h=i.mapstraction_marker;if(!!h.hoverIconUrl){var j=h.iconUrl||"http://openlayers.org/dev/img/marker-gold.png";h.setUrl(j)}if(h.hover&&!!h.popup){h.popup.hide();h.map.removePopup(h.popup)}},autoActivate:true});drag=new OpenLayers.Control.DragFeature(this.layers.markers,{documentDrag:true,autoActivate:true});drag.handlers.drag.stopDown=false;drag.handlers.drag.stopUp=false;drag.handlers.drag.stopClick=false;drag.handlers.feature.stopDown=false;drag.handlers.feature.stopUp=false;drag.handlers.feature.stopClick=false;drag.onStart=function(i,h){if(i.mapstraction_marker.draggable!==true){drag.handlers.drag.deactivate()}};e.addControls([select,drag]);this.controls.drag=drag;this.controls.select=select}this.layers.markers.addFeatures([d]);return d},removeMarker:function(a){var c=this.maps[this.api];var b=a.proprietary_marker;this.layers.markers.removeFeatures([b])},declutterMarkers:function(a){throw new Error("Mapstraction.declutterMarkers is not currently supported by provider "+this.api)},addPolyline:function(b,a){var d=this.maps[this.api];var c=b.toProprietary(this.api);if(!this.layers.polylines){this.layers.polylines=new OpenLayers.Layer.Vector("polylines");d.addLayer(this.layers.polylines)}this.layers.polylines.addFeatures([c]);return c},removePolyline:function(a){var c=this.maps[this.api];var b=a.proprietary_polyline;this.layers.polylines.removeFeatures([b])},removeAllPolylines:function(){var c=[];for(var a=0,b=this.polylines.length;a<b;a++){c.push(this.polylines[a].proprietary_polyline)}if(this.layers.polylines){this.layers.polylines.removeFeatures(c)}},getCenter:function(){var c=this.maps[this.api];var b=c.getCenter();var a=new mxn.LatLonPoint();a.fromProprietary(this.api,b);return a},setCenter:function(a,b){var d=this.maps[this.api];var c=a.toProprietary(this.api);d.setCenter(c)},setZoom:function(a){var b=this.maps[this.api];b.zoomTo(a)},getZoom:function(){var a=this.maps[this.api];return a.zoom},getZoomLevelForBoundingBox:function(f){var e=this.maps[this.api];var a=f.getSouthWest();var d=f.getNorthEast();if(a.lon>d.lon){a.lon-=360}var b=new OpenLayers.Bounds();b.extend(new mxn.LatLonPoint(a.lat,a.lon).toProprietary(this.api));b.extend(new mxn.LatLonPoint(d.lat,d.lon).toProprietary(this.api));var c=e.getZoomForExtent(b);return c},setMapType:function(a){},getMapType:function(){return mxn.Mapstraction.ROAD},getBounds:function(){var e=this.maps[this.api];var d=e.calculateBounds();var c=new OpenLayers.LonLat(d.left,d.bottom);var a=new mxn.LatLonPoint(0,0);a.fromProprietary(this.api,c);var b=new OpenLayers.LonLat(d.right,d.top);var f=new mxn.LatLonPoint(0,0);f.fromProprietary(this.api,b);return new mxn.BoundingBox(a.lat,a.lon,f.lat,f.lon)},setBounds:function(c){var e=this.maps[this.api];var a=c.getSouthWest();var d=c.getNorthEast();if(a.lon>d.lon){a.lon-=360}var b=new OpenLayers.Bounds();b.extend(new mxn.LatLonPoint(a.lat,a.lon).toProprietary(this.api));b.extend(new mxn.LatLonPoint(d.lat,d.lon).toProprietary(this.api));e.zoomToExtent(b)},addImageOverlay:function(d,b,g,k,h,i,f,j){var c=this.maps[this.api];var a=new OpenLayers.Bounds();a.extend(new mxn.LatLonPoint(h,k).toProprietary(this.api));a.extend(new mxn.LatLonPoint(f,i).toProprietary(this.api));var e=new OpenLayers.Layer.Image(d,b,a,new OpenLayers.Size(j.imgElm.width,j.imgElm.height),{isBaseLayer:false,alwaysInRange:true});c.addLayer(e);this.setImageOpacity(e.div.id,g)},setImagePosition:function(b,a){throw new Error("Mapstraction.setImagePosition is not currently supported by provider "+this.api)},addOverlay:function(b,c){var e=this.maps[this.api];var a=new OpenLayers.Layer.GML("kml",b,{format:OpenLayers.Format.KML,formatOptions:new OpenLayers.Format.KML({extractStyles:true,extractAttributes:true}),projection:new OpenLayers.Projection("EPSG:4326")});if(c){var d=function(){dataExtent=this.getDataExtent();e.zoomToExtent(dataExtent)};a.events.register("loadend",a,d)}e.addLayer(a)},addTileLayer:function(i,d,g,j,h,e,k,c){var a=this.maps[this.api];var f=i.replace(/\{Z\}/gi,"${z}");f=f.replace(/\{X\}/gi,"${x}");f=f.replace(/\{Y\}/gi,"${y}");var b=new OpenLayers.Layer.XYZ(g,f,{sphericalMercator:false,opacity:d});if(!k){b.addOptions({displayInLayerSwitcher:false,isBaseLayer:false})}a.addLayer(b);OpenLayers.Util.onImageLoadErrorColor="transparent";this.tileLayers.push([i,b,true])},toggleTileLayer:function(c){var b=this.maps[this.api];for(var a=this.tileLayers.length-1;a>=0;a--){if(this.tileLayers[a][0]==c){this.tileLayers[a][2]=!this.tileLayers[a][2];this.tileLayers[a][1].setVisibility(this.tileLayers[a][2])}}},getPixelRatio:function(){var a=this.maps[this.api];throw new Error("Mapstraction.getPixelRatio is not currently supported by provider "+this.api)},mousePosition:function(a){var b=this.maps[this.api];var c=document.getElementById(a);if(c!==null){b.events.register("mousemove",b,function(e){var f=b.getLonLatFromViewPortPx(e.xy);var d=new mxn.LatLonPoint();d.fromProprietary("openlayers",f);var g=d.lat.toFixed(4)+" / "+d.lon.toFixed(4);c.innerHTML=g})}c.innerHTML="0.0000 / 0.0000"}},LatLonPoint:{toProprietary:function(){var b=this.lon*20037508.34/180;var a=Math.log(Math.tan((90+this.lat)*Math.PI/360))/(Math.PI/180);a=a*20037508.34/180;return new OpenLayers.LonLat(b,a)},fromProprietary:function(a){var c=(a.lon/20037508.34)*180;var b=(a.lat/20037508.34)*180;b=180/Math.PI*(2*Math.atan(Math.exp(b*Math.PI/180))-Math.PI/2);this.lon=c;this.lng=this.lon;this.lat=b}},Marker:{toProprietary:function(){var d,c,e,b,a;if(!!this.iconSize){d=new OpenLayers.Size(this.iconSize[0],this.iconSize[1])}else{d=new OpenLayers.Size(21,25)}if(!!this.iconAnchor){c=new OpenLayers.Pixel(-this.iconAnchor[0],-this.iconAnchor[1])}else{c=new OpenLayers.Pixel(-(d.w/2),-d.h)}if(!!this.iconUrl){this.icon=new OpenLayers.Icon(this.iconUrl,d,c)}else{this.icon=new OpenLayers.Icon("http://openlayers.org/dev/img/marker-gold.png",d,c)}e={cursor:"pointer",externalGraphic:((!!this.iconUrl)?this.iconUrl:"http://openlayers.org/dev/img/marker-gold.png"),graphicTitle:((!!this.labelText)?this.labelText:""),graphicHeight:d.h,graphicWidth:d.w,graphicOpacity:1,graphicXOffset:c.x,graphicYOffset:c.y,graphicZIndex:(!!this.attributes.zIndex?this.attributes.zIndex:2)};a=this.location.toProprietary("openlayers");b=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(a.lon,a.lat),null,e);if(!!this.infoBubble){this.popup=new OpenLayers.Popup.FramedCloud(null,a,new OpenLayers.Size(100,100),this.infoBubble,this.icon,true);this.popup.autoSize=true;this.popup.panMapIfOutOfView=true;this.popup.fixedRelativePosition=false;this.popup.feature=b}else{this.popup=null}if(this.infoDiv){}return b},openBubble:function(){if(!!this.infoBubble){this.popup=new OpenLayers.Popup.FramedCloud(null,this.location.toProprietary("openlayers"),new OpenLayers.Size(100,100),this.infoBubble,this.icon,true);this.popup.autoSize=true;this.popup.panMapIfOutOfView=true;this.popup.fixedRelativePosition=false;this.popup.feature=this.propriety_marker}if(!!this.popup){this.map.addPopup(this.popup,true)}},closeBubble:function(){if(!!this.popup){this.popup.hide();this.map.removePopup(this.popup);this.popup=null}},hide:function(){this.proprietary_marker.layer.setVisibility(false)},show:function(){this.proprietary_marker.layer.setVisibility(true)},update:function(){throw new Error("Marker.update is not currently supported by provider "+this.api)}},Polyline:{toProprietary:function(){var f=[];var b;var d={strokeColor:this.color,strokeOpacity:this.opacity,strokeWidth:this.width,fillColor:this.fillColor,fillOpacity:this.opacity};for(var c=0,e=this.points.length;c<e;c++){var a=this.points[c].toProprietary("openlayers");f.push(new OpenLayers.Geometry.Point(a.lon,a.lat))}if(this.closed){if(!(this.points[0].equals(this.points[this.points.length-1]))){f.push(f[0])}}else{if(this.points[0].equals(this.points[this.points.length-1])){this.closed=true}}if(this.closed){b=new OpenLayers.Geometry.LinearRing(f)}else{b=new OpenLayers.Geometry.LineString(f)}this.proprietary_polyline=new OpenLayers.Feature.Vector(b,null,d);return this.proprietary_polyline},show:function(){this.proprietary_polyline.layer.setVisibility(true)},hide:function(){this.proprietary_polyline.layer.setVisibility(false)}}});