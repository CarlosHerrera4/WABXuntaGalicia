    define(['dojo/_base/declare', 'jimu/BaseWidget'],
  function(declare, BaseWidget) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-customwidget',

      //this property is set by the framework when widget is loaded.
      //name: 'CustomWidget',


      //methods to communication with app container:

      postCreate: function() {
       this.inherited(arguments);
       console.log('postCreate');
      },

      startup: function() {
        this.inherited(arguments);
        //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
        console.log('startup');
      },
    
        // <!--								  <option value="-1">Seleccione Concello</option>-->

      onOpen: function(){
        console.log('onOpen');
      },
          
       
      //cargaConcellos: function(b) {
        
      cargaConcellos: function() {  
          
        //document.getElementById("SelectMuni").children.remove;
        var num_options = document.getElementById("SelectMuni").options.length;
        

        // Si hay alguna selección anterior, borra lista "SelectMuni"  
        if (num_options>1){
            for (var i=0; i < num_options ; i++) {
                var list = document.getElementById("SelectMuni");
                list.removeChild(list.childNodes[0]); 
            }       
        }


        //document.getElementById("SelectMuni").remove(1);
        
//        var option = document.createElement("option");
//        option.text = "Seleccione concello";
//        option.value = -1;
//        document.getElementById("SelectMuni").add(option);
        //document.getElementById("SelectMuni").appendChild(option);
        //document.getElementById("SelectMuni").append('<option value="' + -1 + '">Seleccione concello</option>');
        document.getElementById("lupa_muni").style.visibility = "hidden";
        //document.getElementById("lupa_muni").hide();
        //document.getElementById("lupa_muni").removeAttr("onclick");
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
            //alert(num_enti);
            debugger
            
            for (var count = 0; count <= num_enti - 1 ; count++){
                var m = g[count].attributes.codmuni;
                var k = g[count].attributes.nome;
                d.push(m);
                c.push(k);
            }
            
//            document.getElementById.each(g, function(i, l) {
//                var m = l.attributes.codmuni;
//                var k = l.attributes.nome;
//                d.push(m);
//                c.push(k)
//            });
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
          
    
    cargaParroquias: function() {
        //Recogemos concello elegido en la función anterior
        // <option value="-1">Seleccione parroquia</option>
        // var selec_concello = document.getElementById("SelectMuni").value;
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


        // document.getElementById("SelectParroquia").children.remove;
        // var option = document.createElement("option");
        // option.text = "Seleccione Parroquia";
        // option.value = -1;
        // document.getElementById("SelectParroquia").add(option);

        //document.getElementById("SelectParroquia").append('<option value="' + -1 + '">Seleccione Parroquia</option>');
        var urlLimites = "http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer/18/?f=json";
        http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer/18/query?where=CodCONC =Brión&outFields=CODPARRO,PARROQUIA&orderByFields=PARROQUIA&returnGeometry=false&returnDistinctValues=true
        var c = [];
        var b = [];

        var a = esri.request({
            url: urlLimites + "/18/query?where=CodCONC =" + parro_concello + "&outFields=CODPARRO,PARROQUIA&orderByFields=PARROQUIA&returnGeometry=false&returnDistinctValues=true",
            // url: urlLimites + "/18/query?where=CodCONC =" + d + "&outFields=CODPARRO,PARROQUIA&orderByFields=PARROQUIA&returnGeometry=false&returnDistinctValues=true",
            content: {
                f: "json"
            },
            handleAs: "json",
            callbackParamName: "callback"
        });
        a.then(function(g) {
            var e = g.features;
            var num_enti = e.features.length;
            for (var count = 0; count <= num_enti - 1 ; count++){
                var m = g[count].attributes.CODPARRO;
                var k = g[count].attributes.PARROQUIA;
                d.push(m);
                c.push(k);
            }
            // $.each(e, function(i, l) {
            //     var m = l.attributes.CODPARRO;
            //     var k = l.attributes.PARROQUIA;
            //     b.push(k);
            //     c.push(m)
            // });

            var f = dojo.byId("SelectParroquia");
            for (var h = 0; h < c.length; h++) {
                var j = document.createElement("option");
                j.value = c[h];
                j.text = b[h];
                f.add(j)
            }
            document.getElementById("divParroquias").removeClass("precarga").addClass("buscador");
            document.getElementById("SelectParroquia").show()
        })},
    
        
    cargaPoboacions: function(b) {
        document.getElementById("#SelectPobo").children().remove();
        document.getElementById("#SelectPobo").append('<option value="' + -1 + '">Seleccione Poboación</option>');
        document.getElementById("#lupa_pobo").hide();
        document.getElementById("#lupa_pobo").removeAttr("onclick");
        var d = [];
        var c = [];
        var a = esri.request({
            url: urlToponimia + "/9/query?where=CodPARRO=" + b + "&outFields=NOMBRE,OBJECTID&orderByFields=NOMBRE&returnGeometry=false&returnDistinctValues=true",
            content: {
                f: "json"
            },
            handleAs: "json",
            callbackParamName: "callback"
        });
        a.then(function(f) {
            var j = f.features;
            $.each(j, function(i, m) {
                var l = m.attributes.OBJECTID;
                d.push(l);
                var k = m.attributes.NOMBRE;
                c.push(k)
            });
            var e = dojo.byId("SelectPobo");
            for (var g = 0; g < c.length; g++) {
                var h = document.createElement("option");
                h.value = d[g];
                h.text = c[g];
                e.add(h)
            }
            $("#divPoboacions").removeClass("precarga").addClass("buscador");
            $("#SelectPobo").show()
        })},

    
    consultaMuni: function(b, c) {
        var e = new esri.tasks.QueryTask(b);
        var d = new esri.tasks.Query();
        d.returnGeometry = true;
        var a = "CODCONC= " + c;
        d.where = a;
        e.execute(d, showResults);
        ShowBuscaXeral()},

    
    consultaParroquia: function(b, e) {
        var d = new esri.tasks.QueryTask(b);
        var c = new esri.tasks.Query();
        c.returnGeometry = true;
        var a = "codPARRO = " + e;
        c.where = a;
        d.execute(c, showResults);
        ShowBuscaXeral()
    },
    
    consultaPoboacion: function(b, e) {
        var d = new esri.tasks.QueryTask(b);
        var c = new esri.tasks.Query();
        c.returnGeometry = true;
        var a = "OBJECTID = " + e;
        c.where = a;
        d.execute(c, showResultsPoint);
        ShowBuscaXeral()
    },
    
    showResults: function(a) {
        map.graphics.clear();
        var b = new esri.symbol.SimpleFillSymbol();
        dojo.forEach(a.features, function(d) {
            var c = new esri.Graphic(d.geometry,b);
            map.graphics.add(c);
            var e = esri.graphicsExtent(a.features);
            map.setExtent(e.getExtent().expand(1))
        })
    },
    
    showResultsPoint: function(a) {
        map.graphics.clear();
        var b = new esri.symbol.SimpleMarkerSymbol();
        dojo.forEach(a.features, function(k) {
            var j = new esri.Graphic(k.geometry,b);
            var g = k.geometry.points;
            var e = g[0][0];
            var c = g[0][1];
            var i = new esri.geometry.Point(e,c,map.spatialReference);
            var f = new esri.symbol.Font("16pt",esri.symbol.Font.STYLE_NORMAL,esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"Arial");
            var d = new esri.symbol.TextSymbol(k.attributes.NOMBRE,f,"red");
            d.setAlign(esri.symbol.Font.ALIGN_START);
            var h = new esri.Graphic(i,d);
            map.graphics.add(h);
            map.setZoom(13);
            map.centerAt(i)
        })
    },
    
    buscaCatastro: function(a) {
        $(document).ready(function() {
            var c = $(a);
            var b = c.val();
            $.ajax({
                url: "proxy/catastro_proxy.php",
                type: "GET",
                data: "RC=" + b,
                dataType: "xml",
                success: function(e) {
                    var f = $(e);
                    var d = f.find("xcen").text();
                    var h = f.find("ycen").text();
                    var g = f.find("des").text();
                    if (d != "" & h != "") {
                        $("#X").val(d);
                        $("#Y").val(h);
                        gotoXY(d, h)
                    } else {
                        if (g == "") {
                            g = nlsStrings.T_ERRORESPOSTACATASTRO
                        }
                        alert(g);
                        return false
                    }
                },
                error: function(d) {
                    alert(nlsStrings.T_ERRORESPOSTACATASTRO);
                    return false
                }
            })
        })
    },
    
    coordXY: function(a) {
        coord = a.split(",");
        x = coord[0];
        y = coord[1];
        gotoXY(x, y)
    },
    
    gotoXY: function(c, e) {
        if (c < 291000 || c > 868605 || e < 4569700 || e > 4885600 || c == "NaN" || e == "NaN") {
            alert(nlsStrings.T_ERROCOORDENADAS);
            return false
        } else {
            map.graphics.clear();
            var b = new esri.geometry.Point(c,e,map.spatialReference);
            var d = new esri.symbol.SimpleMarkerSymbol({
                color: [255, 255, 255, 64],
                size: 16,
                angle: -30,
                xoffset: 0,
                yoffset: 0,
                type: "esriSMS",
                style: "esriSMSCircle",
                outline: {
                    color: [255, 255, 0, 255],
                    width: 3,
                    type: "esriSLS",
                    style: "esriSLSSolid"
                }
            });
            var a = new esri.Graphic(b,d);
            map.graphics.add(a);
            map.setZoom(13);
            map.centerAt(b)
        }
    },

          
          
          
      

//      onClose: function(){
//         console.log('onClose');
//      },
//
//      onMinimize: function(){
//         console.log('onMinimize');
//      },
//
//      onMaximize: function(){
//         console.log('onMaximize');
//      },
//
//      onSignIn: function(credential){
//       /* jshint unused:false*/
//         console.log('onSignIn');
//      },
//
//      onSignOut: function(){
//         console.log('onSignOut');
//      }
//
//      onPositionChange: function(){
//         console.log('onPositionChange');
//      },
//
//      resize: function(){
//        console.log('resize');
//      }

      //methods to communication between widgets:

    });
  });