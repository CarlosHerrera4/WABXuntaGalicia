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
        
       


      },

      realizaZoom: function() {
      
       var that = this;
       var cod_concello = document.getElementById("SelectMuni").value;
       var urlLimites = "http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer";
       debugger
       var a = esri.request({
            url:  urlLimites + "/12/query?where=CODCONC+%3D+" + cod_concello + "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json",
            content: {
                f: "json"
            },
            handleAs: "json",
            callbackParamName: "callback"
        }); 

        a.then(function(e) {
            var g = e.features;

            var polygonJson = g[0].geometry;
            var polygon = new esri.geometry.Polygon(polygonJson);
            var polygonExtent = polygon.getExtent();

            var centroid = polygon.getCentroid();
            centroid.spatialReference.wkid = 25829;
            
            gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var outSR = new SpatialReference(102100);
            gsvc.project([ centroid ], outSR, function(projectedPoints){
              pt = projectedPoints[0];
              that.map.centerAndZoom(pt, 13);
            });

        });
      },  



      cargaConcellos: function() {  
        var num_options = document.getElementById("SelectMuni").options.length;
        
        if (num_options>1){
            for (var i=0; i < num_options ; i++) {
                var list = document.getElementById("SelectMuni");
                list.removeChild(list.childNodes[0]); 
            }       
        }

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
        })
      },


      realizaZoomParroquia: function() {
       var that = this;
       var cod_parroquia = document.getElementById("SelectParroquia").value;
       var urlLimites = "http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer";
       var a = esri.request({
            url:  urlLimites + "/18/query?where=CodPARRO=" + cod_parroquia + "&outFields=CODPARRO,PARROQUIA&orderByFields=PARROQUIA&returnGeometry=true", 
            content: {
                f: "json"
            },
            handleAs: "json",
            callbackParamName: "callback"
        }); 

        a.then(function(e) {
            var g = e.features;
            var polygonJson = g[0].geometry;
            var polygon = new esri.geometry.Polygon(polygonJson);
            var polygonExtent = polygon.getExtent();

            var centroid = polygon.getCentroid();
            centroid.spatialReference.wkid = 25829;
            
            gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var outSR = new SpatialReference(102100);
            gsvc.project([ centroid ], outSR, function(projectedPoints){
              pt = projectedPoints[0];
              that.map.centerAndZoom(pt, 14);
            });

        });
      },  


      cargaParroquias: function() {
        var selec_concello = document.getElementById("SelectMuni").selectedOptions[0].text;
        var parro_concello = document.getElementById("SelectMuni").selectedOptions[0].value;
        //alert(selec_concello);
        var num_options = document.getElementById("SelectParroquia").options.length;
        if (num_options>1){
            for (var i=0; i < num_options ; i++) {
                var list = document.getElementById("SelectParroquia");
                list.removeChild(list.childNodes[0]); 
            }       
        }
        //Hasta aquí lo que hace es ver si hay algo elegido en Concellos, si lo hay, existirá una lista de Parroquias y por tanto borrará esa lista para crear una nueva

        var urlLimites = "http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer";
        var c = [];
        var b = [];

        var a = esri.request({
            url: urlLimites + "/18/query?where=CodCONC =" + parro_concello + "&outFields=CODPARRO,PARROQUIA&orderByFields=PARROQUIA&returnGeometry=false&returnDistinctValues=true",
            content: {
                f: "json"
            },
            handleAs: "json",
            callbackParamName: "callback"
        });
        a.then(function(g) {
            var e = g.features;
            var num_enti = e.length;
            for (var count = 0; count <= num_enti - 1 ; count++){
                var m = e[count].attributes.CODPARRO;
                var k = e[count].attributes.PARROQUIA;
                b.push(m);
                c.push(k);
            }

            var f = dojo.byId("SelectParroquia");
            for (var h = 0; h < c.length; h++) {
                var j = document.createElement("option");
                j.value = b[h];
                j.text = c[h];
                f.add(j)
            }
            document.getElementById("trParroquias").style.display = "block";
            document.getElementById("SelectParroquia").style.display = "block";
            
        })
      },


      realizaZoomPoboacions: function() {
       var that = this;
       var nombre_parroquia = document.getElementById("SelectParroquia").options[document.getElementById("SelectParroquia").selectedIndex].text;
       var nombre_poboacion = document.getElementById("SelectPobo").options[document.getElementById("SelectPobo").selectedIndex].text;
       var urlLimites = "http://ideg.xunta.es/servizos/rest/services/Toponimia/toponimia_visor/MapServer";
       debugger
       var a = esri.request({
            url:  urlLimites + "/9/query?where=NOMBRE='" + nombre_poboacion + "'AND+PARROQUIA='" + nombre_parroquia + "'&outFields=NOMBRE,OBJECTID&orderByFields=NOMBRE&returnGeometry=true&returnDistinctValues=false", //&returnDistinctValues=true",
            content: {
                f: "json"
            },
            handleAs: "json",
            callbackParamName: "callback"
        }); 

        a.then(function(e) {
            var g = e.features;

            var pointJson = g[0].geometry.points[0];
            var point = new esri.geometry.Point(pointJson);
            point.spatialReference.wkid = 25829;
            
            gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var outSR = new SpatialReference(102100);
            gsvc.project([ point ], outSR, function(projectedPoints){
              pt = projectedPoints[0];
              that.map.centerAndZoom(pt, 16);
            });

        });
      }, 


      cargaPoboacions: function() {
        var selec_parroquia = document.getElementById("SelectParroquia").selectedOptions[0].text;
        var selec_parroquia_value = document.getElementById("SelectParroquia").selectedOptions[0].value;

        var num_options = document.getElementById("SelectPobo").options.length;
        if (num_options>1){
            for (var i=0; i < num_options ; i++) {
                var list = document.getElementById("SelectPobo");
                list.removeChild(list.childNodes[0]); 
            }       
        }

        var urlLimites = "http://ideg.xunta.es/servizos/rest/services/Toponimia/toponimia_visor/MapServer";
        var d = [];
        var c = [];
        var a = esri.request({
            url: urlLimites + "/9/query?where=CodPARRO=" + selec_parroquia_value + "&outFields=NOMBRE,OBJECTID&orderByFields=NOMBRE&returnGeometry=false&returnDistinctValues=true",
            content: {
                f: "json"
            },
            handleAs: "json",
            callbackParamName: "callback"
        });
        a.then(function(f) {
            var j = f.features;
            var num_enti = j.length;
            for (var count = 0; count <= num_enti - 1 ; count++){
                var l = j[count].attributes.OBJECTID;
                var k = j[count].attributes.NOMBRE;
                d.push(l);
                c.push(k);
            }

            var e = document.getElementById("SelectPobo");
            for (var g = 0; g < c.length; g++) {
                var h = document.createElement("option");
                h.value = d[g];
                h.text = c[g];
                e.add(h)
            }
            document.getElementById("trPoboacions").style.display = "block";
            document.getElementById("SelectPobo").style.display = "block";
        })
      },

      realizaZoomPoboacions: function() {
        // var coor = document.getElementById("buscador_input_xy").text;
        // var coor_1 = coor.split(",");
        // var x = coor_1[0];
        // var y = coor_1[1];

        // if (x < 291000 || x > 868605 || y < 4569700 || y > 4885600 || x == "NaN" || y == "NaN") {
        //   alert(ERROCOORDENADAS);
        //   return false
        // } else {
        //     this.map.graphics.clear();
        //     var b = new esri.geometry.Point(c,e,map.spatialReference);
        //     var d = new esri.symbol.SimpleMarkerSymbol({
        //         color: [255, 255, 255, 64],
        //         size: 16,
        //         angle: -30,
        //         xoffset: 0,
        //         yoffset: 0,
        //         type: "esriSMS",
        //         style: "esriSMSCircle",
        //         outline: {
        //             color: [255, 255, 0, 255],
        //             width: 3,
        //             type: "esriSLS",
        //             style: "esriSLSSolid"
        //         }
        //     });
        //     var a = new esri.Graphic(b,d);
        //     this.map.graphics.add(a);
        //     this.map.setZoom(16);
        //     this.map.centerAt(b)
        // }

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