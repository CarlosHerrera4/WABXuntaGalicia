var nuevaext, ptomin_bueno, ptomax_bueno, x_min, y_min, x_max, y_max, sr;
define(['dojo/_base/declare', 
        'jimu/BaseWidget', 
        'esri/geometry/Extent', 
        'esri/layers/FeatureLayer', 
        'esri/tasks/GeometryService', 
        'esri/tasks/ProjectParameters',
        'esri/SpatialReference',
        'esri/geometry/Point'],
  function(declare, BaseWidget, Extent, FeatureLayer, GeometryService, ProjectParameters, SpatialReference, Point) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-customwidget',

      //this property is set by the framework when widget is loaded.
      //name: 'CustomWidget',


      //methods to communication with app container:

      postCreate: function() {
        //this.inherited(arguments);
        //console.log('postCreate');
      },

      startup: function() {
       //this.inherited(arguments);
       //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
       //console.log('startup');
       

      },

      onOpen: function(){
        //console.log('onOpen');

        // var nuevaExtent = new Extent({
        //   xmin: -20098296,
        //   ymin:-2804413,
        //   xmax:5920428,
        //   ymax:15813776,
        //   spatialReference:{wkid:54032}
        // });
        // debugger
        // this.map.setExtent(nuevaExtent);

        

        // var base1 = new FeatureLayer("http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer/4", {
        //   showLabels: true,
        //   outFields: ["*"]
        // });
        // var base2 = new FeatureLayer("http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer/5", {
        //   showLabels: true,
        //   outFields: ["*"]
        // });
        // var base3 = new FeatureLayer("http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer/6", {
        //   showLabels: true,
        //   outFields: ["*"]
        // });
        // var base4 = new FeatureLayer("http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer/7", {
        //   showLabels: true,
        //   outFields: ["*"]
        // });
        // var base = new FeatureLayer("http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer/", {
        //   showLabels: true,
        //   outFields: ["*"]
        // });

        // this.map.addLayers([base1,base2,base3,base4]);
        // this.map.setExtent(base.initialExtent,true);


        //var customExtentAndSR = new esri.geometry.Extent(475443.3882,4628906.1195,686706.0554,4849646.2585, new esri.SpatialReference({"wkid":25829}));
        //this.map._initialExtent.setSpatialReference({wkid:25829});
       //  var next = new Extent({
       //    xmin:475443.3882,
       //    ymin:4628906.1195,
       //    xmax:686706.0554,
       //    ymax:4849646.2585,
       //    spatialReference:{wkid:25829}
       //  });
       // //102100
       // //25829
       //  this.map.setExtent(next);


       


      },

     realizaZoom: function() {
      
       var that = this;
       var cod_concello = document.getElementById("SelectMuni").value;
       var urlLimites = "http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer";
       debugger
       var a = esri.request({
        //http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer/12/query?where=CONCELLO= " + concello + "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=html
            url:  urlLimites + "/12/query?where=CODCONC+%3D+" + cod_concello + "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json",
            content: {
                f: "json"
            },
            handleAs: "json",
            callbackParamName: "callback"
        }); 



        //var nuevaextension;
        a.then(function(e) {
            // Creo que hay algún problema con "map"
            var g = e.features;
            debugger

            var polygonJson = g[0].geometry;
            var polygon = new esri.geometry.Polygon(polygonJson);
            var polygonExtent = polygon.getExtent();

            //Cogemos el centroide del polígono y le hacemos zoom
            var centroid = polygon.getCentroid();
            centroid.spatialReference.wkid = 25829;
            // that.map.centerAndZoom(centroid,6);

            //var newpoint = new Point([475443.3882, 4628906.1195], new SpatialReference({ wkid: 25829 }));
            //var ptomin = new Point([polygonExtent.xmin, polygonExtent.ymin], new SpatialReference({ wkid: 25829})); 
            //var ptomax = new Point([polygonExtent.xmax, polygonExtent.ymax], new SpatialReference({ wkid: 25829}));



            gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var outSR = new SpatialReference(102100);
            //var ptomin_bueno, ptomax_bueno;
            //that.map.centerAndZoom(centroid, 6);
            gsvc.project([ centroid ], outSR, function(projectedPoints){
              pt = projectedPoints[0];
              that.map.centerAndZoom(pt, 13);
            });



            // gsvc.project([ ptomax ], outSR, function(projectedPoints_2){
            //   ptomax_bueno = projectedPoints_2[0];
            //   //that.map.centerAndZoom(pt, 6);
            // });

            // var x_min = ptomin_bueno.x;
            // var y_min = ptomin_bueno.y;
            // var x_max = ptomin_bueno.x;
            // var y_max = ptomin_bueno.y;
            // var sr = ptomax_bueno.spatialReference.wkid;

            // var exten_buena = new Extent({
            //   "xmin": x_min,
            //   "ymin": y_min,
            //   "xmax": x_max,
            //   "ymax": y_max,
            //   "spatialReference": {wkid: sr}
            // });
            // that.map.setExtent(exten_buena);




            //that.map.setspati
            //polygonExtent.spatialReference.wkid = 25829;

            //that.map.setExtent(polygonExtent);     //Esta es la buena
            //nuevaext = polygonExtent;
            //nuevaExtension2(nuevaext);
            //map.setExtent(polygonExtent);
            //this.map.extent(polygonExtent);
            //nuevaextension = polygon.getExtent();
        });
        //this.map.setExtent(nuevaext, true);
        //map.setExtent(nuevaext);
        //var aea = nuevaextension;
        // function nuevaExtension2 (nuevaext) {
        //   //map.setExtent(nuevaext, true);
        //   that.map.setExtent(nuevaext, true);
        // };
        // nuevaExtension2(nuevaext);
        
      },  

      // nuevaExtension2: function(b) {
      //   this.map.setExtent(b);

      // },


      cargaConcellos: function() {  
        var num_options = document.getElementById("SelectMuni").options.length;
        
        // Si hay alguna selección anterior, borra lista "SelectMuni"  
        if (num_options>1){
            for (var i=0; i < num_options ; i++) {
                var list = document.getElementById("SelectMuni");
                list.removeChild(list.childNodes[0]); 
            }       
        }

        document.getElementById("lupa_muni").style.visibility = "hidden";
        document.getElementById("lupa_muni").removeAttribute("onclick");
        var op_prov = document.getElementById("provincia1").value;
        var d = [];
        var c = [];
        var a = esri.request({
            url: "/widgets/PruebaGalicia2/js/concellos"+ op_prov + ".json",
            content: {
                f: "json"
            },
            handleAs: "json",
            callbackParamName: "callback"
        });  
          
        a.then(function(e) {
            var g = e.features;
            //asdfasdfsadf
            var num_enti = e.features.length;
            
            for (var count = 0; count <= num_enti - 1 ; count++){
                var m = g[count].attributes.codmuni;
                var k = g[count].attributes.nome;
                d.push(m);
                c.push(k);
            }
            
            var j = dojo.byId("SelectMuni");
            for (var f = 0; f < d.length; f++) {
                var h = document.createElement("option");
                h.value = d[f];
                h.text = c[f];
                j.add(h)
            }
            document.getElementById("trConcellos").style.display = "block";
            document.getElementById("lupa_muni").style.display = "block";
        })
      },

      // onClose: function(){
      //   console.log('onClose');
      // },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  });