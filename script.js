
var initvalues = {
"nb_vehicules":32, // millions 
"part_ve": 2, // % 
"km_annuel":12200, // km annuels 
"ges_structure_vt":6, // t eqCO2  
"ges_structure_ve":6, // t eqCO2 
"conso_vt":6, // L/100km 
"conso_ve":15, // kWh/100km 
"ges_reseau_ve":59.9, //g eq CO2/kWh 
"ges_reseau_vt":2.75, // kg eq CO2/L 
"duree_vie_vt":15, // ans 
"duree_vie_ve":20, //ans 
"autonomie_ve":400, //km 
"ges_batterie_ve":75, // kg eq CO2/kWh

}

var barwidth = 40;
var barspace = 10;

var uservalues = {}; 
var calcvalues = {}; 
var listfields = Object.keys(initvalues);
var svg = d3.select("#dataviz_area")

svgheight = 250;
svgscale = 2; // px par millions de tonnes CO2
var myval;
var xpos = barspace+10;


$(document).ready(function(){
      $("#click_detail_vehicule_init").click(function(){
        $("#detail_vehicule_init").slideToggle("slow");
      });
	  $("#click_detail_vehicule").click(function(){
        $("#detail_vehicule").slideToggle("slow");
      });
    });


function draw() {

	svg.selectAll("*").remove();
	 
	myorigcalc = do_calc(initvalues);
	newcalc = do_calc(uservalues);

	svgheight = Math.max(myorigcalc["bilan_total"], newcalc["bilan_total"])*svgscale+50;
		
	draw_bar(myorigcalc["bilan_total"], myorigcalc["bilan_total"], "actuelles", "#63a375", 0, false);
	newref = myorigcalc["bilan_total"];
	  
	list_action = ["origin", "Taille du parc VT",  "Conso VT",  "Kilométrage VT", "Taille du parc VE",  "Conso VE",  "Kilométrage VE"]
	
	list_keys_iter = ["nb_vt", "nb_ve"];
	
	start_val = myorigcalc["bilan_total"];
	delta = {};
	
	blue_color = "#4499ff";

	delta = (myorigcalc["nb_vt"]*myorigcalc["bilan_year_ges_fabriq_vt"] - calcvalues["nb_vt"]*calcvalues["bilan_year_ges_fabriq_vt"])/1e12;
	draw_bar(newref, delta, "Fab. VT",blue_color, 1, true);
	newref -= delta;
	
	delta = (myorigcalc["nb_vt"]*initvalues["km_annuel"]-calcvalues["nb_vt"]*uservalues["km_annuel"])*myorigcalc["direct_co2_km_vt"]/1e12;
	draw_bar(newref, delta, "Km VT",blue_color, 1, true);
	newref -= delta;
	
	delta = (calcvalues["nb_vt"]*uservalues["km_annuel"])*(myorigcalc["direct_co2_km_vt"]-calcvalues["direct_co2_km_vt"])/1e12;
	draw_bar(newref, delta, "Eff. VT",blue_color, 1, true);
	newref -= delta;
	
	delta = (myorigcalc["nb_ve"]*myorigcalc["bilan_year_ges_fabriq_ve"] - calcvalues["nb_ve"]*calcvalues["bilan_year_ges_fabriq_ve"])/1e12;
	draw_bar(newref, delta, "Fab. VE", blue_color, 1, true);
	newref -= delta;
	
	delta = (myorigcalc["nb_ve"]*initvalues["km_annuel"]-calcvalues["nb_ve"]*uservalues["km_annuel"])*myorigcalc["direct_co2_km_ve"]/1e12;
	draw_bar(newref, delta, "Km VE",blue_color, 1, true);
	newref -= delta;
	
	delta = (calcvalues["nb_ve"]*uservalues["km_annuel"])*(myorigcalc["direct_co2_km_ve"]-calcvalues["direct_co2_km_ve"])/1e12;
	draw_bar(newref, delta, "Eff. VE",blue_color, 1, true);
	newref -= delta;
	
	delta = calcvalues["bilan_total"];
	draw_bar(newref, delta, "scénario", "#63a375", 0, true);
	newref -= delta;
	
		svg.append('line')
		.style("stroke", "black")
		.style("stroke-width", 1)
		.attr("x1", 0)
		.attr("y1", svgheight)
		.attr("x2", (barwidth+barspace)*8+barspace+20)
		.attr("y2", svgheight);
		svg.append("text")
			.attr("x", 5)
			.attr("y", 200)
			.attr("dy", ".35em")
			.attr("class", "svg-ylabel")
			.attr("transform", "translate(-190,"+svgheight+") rotate(270)")		
			.text("Mt eq. CO2 par an");
	
	xpos = barspace+10;
	document.getElementById('dataviz_area').setAttribute("height", svgheight+50);
	
}

function draw_bar(start, height, xlabel, color, posval, showbar) {


	round_val = Math.round(-height*10)/10;
	if (round_val >= 100) {
		round_val = Math.round(-height);
	}
 
	if (height > 0) {
		my_ystart = start*svgscale;
		my_height = height*svgscale;
		my_text = round_val;
	} else if (height < 0) {
		my_ystart = (start-height)*svgscale;
		my_height = -height*svgscale;
		my_text = "+" + round_val;
	} else {
		my_ystart = (start-height)*svgscale;
		my_height = -height*svgscale;
		my_text = "-";
	}

	
	svg.append("rect")
		.attr("x", xpos).attr("y", svgheight-my_ystart).attr("width", barwidth).attr("height", my_height).style("fill", color);
	if (posval == 1) { // Au dessus
		svg.append("text")
			.attr("x", xpos+2)
			.attr("y", svgheight-my_ystart-10)
			.attr("dy", ".35em")
			.attr("class", "svg-barlabel-up")
			.text(my_text);
		svg.append("text")
			.attr("x", xpos)
			.attr("y", svgheight+10)
			.attr("dy", ".35em")
			.attr("width", barwidth + barspace)
			.attr("class", "svg-xlabel")
			.text(xlabel);
	} else if (posval == 0) { // En base
		round_val = Math.round(height*10)/10;
		if (round_val >= 100) {
			round_val = Math.round(height);
		}
		my_text = round_val;
		svg.append("text")
			.attr("x", xpos+5)
			.attr("y", svgheight-10)
			.attr("dy", ".35em")
			.attr("class", "svg-barlabel-bottom")
			.text(my_text);
		svg.append("text")
			.attr("x", xpos-5)
			.attr("y", svgheight+10)
			.attr("dy", ".35em")
			.attr("width", barwidth + barspace)
			.attr("class", "svg-xlabel")
			.text("Emissions");
		svg.append("text")
			.attr("x", xpos)
			.attr("y", svgheight+20)
			.attr("dy", ".35em")
			.attr("width", barwidth + barspace)
			.attr("class", "svg-xlabel")
			.text("totales");
		svg.append("text")
			.attr("x", xpos-3)
			.attr("y", svgheight+30)
			.attr("dy", ".35em")
			.attr("width", barwidth + barspace)
			.attr("class", "svg-xlabel")
			.text(xlabel);
	}

	if (showbar) {
		svg.append('line')
			.style("stroke", "#555555")
			.style("stroke-width", 1)
			.attr("x1", xpos-barwidth - barspace)
			.attr("y1", svgheight-start*svgscale)
			.attr("x2", xpos+barwidth)
			.attr("y2", svgheight-start*svgscale);
	} else {
		/*svg.append('line')
			.style("stroke", "black")
			.style("stroke-width", 1)
			.attr("x1", xpos-barwidth + barspace)
			.attr("y1", svgheight-start*svgscale)
			.attr("x2", xpos+barwidth)
			.attr("y2", svgheight-start*svgscale);*/
	}
	xpos += barwidth + barspace;
}
	


function do_calc(values) {
	var mycalc = {};
	mycalc["nb_vt"] = (100 - values["part_ve"])*0.01*values["nb_vehicules"]*1e6;
	mycalc["nb_ve"] = (values["part_ve"])*0.01*values["nb_vehicules"]*1e6;
	mycalc["bilan_ges_batterie_ve"] = 2*values["ges_batterie_ve"]*(values["autonomie_ve"]/100)*values["conso_ve"]*1000; // en g
	mycalc["bilan_year_ges_fabriq_ve"] = (values["ges_structure_ve"]*1000000+mycalc["bilan_ges_batterie_ve"])/values["duree_vie_ve"]; // en g
	mycalc["bilan_year_ges_fabriq_vt"] = values["ges_structure_vt"]*1000000/values["duree_vie_vt"];
	
	mycalc["direct_co2_km_ve"] = values["ges_reseau_ve"]*values["conso_ve"]/100;
	mycalc["direct_co2_km_vt"] = values["ges_reseau_vt"]*values["conso_vt"]*1000/100;
	
	mycalc["bilan_km_ve"] = mycalc["bilan_year_ges_fabriq_ve"]/values["km_annuel"] + mycalc["direct_co2_km_ve"];
	mycalc["bilan_km_vt"] = mycalc["bilan_year_ges_fabriq_vt"]/values["km_annuel"] + mycalc["direct_co2_km_vt"];
	mycalc["bilan_total"] = (mycalc["bilan_km_ve"]*values["km_annuel"]*mycalc["nb_ve"] + mycalc["bilan_km_vt"]*values["km_annuel"]*mycalc["nb_vt"])/1000000000000;
	
	return mycalc;
}

function synthese_scenario(initvalues, initcalcvalues, uservalues, usercalcvalues) {
	var mycalc = {};
	mycalc["sobriete_equipement"] = (uservalues["nb_vehicules"] - initvalues["nb_vehicules"])*100/initvalues["nb_vehicules"];
	mycalc["sobriete_km"] = (uservalues["nb_vehicules"]*uservalues["km_annuel"] - initvalues["nb_vehicules"]*initvalues["km_annuel"])*100/(initvalues["nb_vehicules"]*initvalues["km_annuel"]);
	mycalc["electrification"] = (usercalcvalues["nb_ve"]-initcalcvalues["nb_ve"])*100/initcalcvalues["nb_vt"];
	mycalc["efficacite_ve"] = (usercalcvalues["bilan_km_ve"]-initcalcvalues["bilan_km_ve"])*100/initcalcvalues["bilan_km_ve"]
	mycalc["efficacite_vt"] = (usercalcvalues["bilan_km_vt"]-initcalcvalues["bilan_km_vt"])*100/initcalcvalues["bilan_km_vt"]
	for (field of Object.keys(mycalc)) {
		myelement = document.getElementById(field);
		myval = Math.round(mycalc[field]);
		if (field != "electrification") {
			if (myval!=0) {
					if (myval > 0) {
						myelement.innerHTML = "+" + myval + "&nbsp;%";
					} else {
						myelement.innerHTML = myval + "&nbsp;%";
					}
					myelement.parentElement.parentElement.className = "big_content spot_synthese_value";
			} else {
					myelement.innerHTML = "Même quantité";
					myelement.parentElement.parentElement.className = "spot_meme_qte spot_synthese_value";
			}
			
		} else {
			myelement.innerHTML = myval + "&nbsp;%";
		}
	}
}

function update(event) {
	for (const field of listfields) {
	   uservalues[field] = parseFloat(document.getElementById(field).value);
	}
	//console.log("UPDATE");
	
	calcvalues = do_calc(uservalues);
	//console.log(calcvalues);
	// Infos as text
	document.getElementById("pct_vt").innerHTML = Math.round(100 - uservalues["part_ve"]);
	document.getElementById("pct_ve").innerHTML = Math.round(uservalues["part_ve"]);
	
	document.getElementById("nb_vt").innerHTML = Math.round(calcvalues["nb_vt"]/1e5)/10;
	document.getElementById("nb_ve").innerHTML = Math.round(calcvalues["nb_ve"]/1e5)/10;
	
	document.getElementById("bilan_km_ve").innerHTML = Math.round(calcvalues["bilan_km_ve"]);
	document.getElementById("bilan_km_vt").innerHTML = Math.round(calcvalues["bilan_km_vt"]);
	
	
	document.getElementById("val_nb_vehicules").innerHTML = uservalues["nb_vehicules"];
	document.getElementById("val_km_annuel").innerHTML = uservalues["km_annuel"];
	
	document.getElementById("division_scenario").innerHTML = Math.round(initcalcvalues["bilan_total"]*10/calcvalues["bilan_total"])/10;
	reduction = Math.round((calcvalues["bilan_total"]-initcalcvalues["bilan_total"])*100/initcalcvalues["bilan_total"]);
	myelement = document.getElementById("reduction_scenario");
	if (reduction > 0) {
		myelement.innerHTML = "+" + reduction + "&nbsp;%";
		//myelement.parentElement.parentElement.className = "big_content spot_synthese_value";
	} else if (reduction < 0) {
		myelement.innerHTML = reduction + "&nbsp;%"
		//myelement.parentElement.parentElement.className = "big_content spot_synthese_value";
	} else {
		//myelement.parentElement.parentElement.className = "spot_meme_qte spot_synthese_value";
		myelement.innerHTML = "Même quantité";
	}
	
	
	synthese_scenario(initvalues, do_calc(initvalues), uservalues, calcvalues);
	//console.log("Bilan total = " + Math.round(calcvalues["bilan_total"]*10)/10 + " millions de tonnes eq CO2");
	
	draw();
}



function initialisation() {
	for (const field of listfields) {
		document.getElementById(field).value = initvalues[field];
		myel = document.getElementById("init_" + field)
		if (myel != null) {
			myel.innerHTML = initvalues[field];
		}	
	}
}

initialisation();
initcalcvalues = do_calc(initvalues);
	document.getElementById("init_pct_vt").innerHTML = Math.round(100 - initvalues["part_ve"]);
	document.getElementById("init_pct_ve").innerHTML = Math.round(initvalues["part_ve"]);
	
	document.getElementById("init_nb_vt").innerHTML = Math.round(initcalcvalues["nb_vt"]/1e5)/10;
	document.getElementById("init_nb_ve").innerHTML = Math.round(initcalcvalues["nb_ve"]/1e5)/10;
	
	document.getElementById("init_bilan_km_ve").innerHTML = Math.round(initcalcvalues["bilan_km_ve"]);
	document.getElementById("init_bilan_km_vt").innerHTML = Math.round(initcalcvalues["bilan_km_vt"]);


document.addEventListener("click", update);

update(null);

 