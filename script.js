/*
Copyright (C) 2022 - Benoit Ribon (dynartI/O) - https://dynartio.com
Ce programme est un logiciel libre ; vous pouvez le redistribuer ou le modifier suivant les termes de la GNU General Public License telle que publiée par la Free Software Foundation ; soit la version 3 de la licence, soit (à votre gré) toute version ultérieure.
Ce programme est distribué dans l'espoir qu'il sera utile, mais SANS AUCUNE GARANTIE ; sans même la garantie tacite de QUALITÉ MARCHANDE ou d'ADÉQUATION à UN BUT PARTICULIER. Consultez la GNU General Public License pour plus de détails.
Vous devez avoir reçu une copie de la GNU General Public License en même temps que ce programme ; si ce n'est pas le cas, consultez <http://www.gnu.org/licenses>. 
*/

window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));

(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v3.0";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var initvalues = {
"nb_vehicules":32, // millions 
"part_ve": 2, // % 
"km_annuel":12200, // km annuels 
"ges_structure_vt":6, // t eqCO2  
"ges_structure_ve":6, // t eqCO2 
"conso_vt":6.5, // L/100km 
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

var svgheight = 250;
var svgscale = 2; // px par millions de tonnes CO2
var myval;
var xpos = barspace+10;

var tweettext;

var scroll_pos = 300;
var is_shown_result = false;

function pageScroll() {
  window.scrollBy(0, 10);
	scroll_pos += 10;  // horizontal and vertical scroll increments
  scrolldelay = setTimeout('pageScroll()', 8); // scrolls every 100 milliseconds
  if (scroll_pos >= document.body.offsetHeight) {
    clearTimeout(scrolldelay);
	scroll_pos = 0;
  }

}


$(document).ready(function(){
	 $("#submit-button").click(function(){
        $("#result-div").show();
		 is_shown_result = true;
		setTimeout(function(){
			 pageScroll();}, 10);
		//window.scrollTo(0, document.body.scrollHeight);}, 10);
      });
	  $("#button-carmod").click(function(){
        $("#detail_vehicule").slideToggle("slow");
      });
	  $("#button-reinit").hover(
		  function() { $("#button-text-reinit").show(); },
		  function() { $("#button-text-reinit").hide(); }
		);
	 $("#button-caract").hover(
		  function() { $("#button-text-caract").show(); },
		  function() { $("#button-text-caract").hide(); }
		);
		 $("#button-carmod").hover(
		  function() { $("#button-text-carmod").show(); },
		  function() { $("#button-text-carmod").hide(); }
		);

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
	return mycalc;
}

function round(value, precision) {
	return Math.round(value*Math.pow(10, precision))/Math.pow(10, precision);
}

function plussify(value) {
	if (value >= 0) {
		return "+" + value;
	} else {
		return value;
	}
}

function update(event) {
	for (const field of listfields) {
	   uservalues[field] = parseFloat(document.getElementById(field).value.replace(",","."));
	}

	calcvalues = do_calc(uservalues);

	document.getElementById("pct_vt").innerHTML = Math.round(100 - uservalues["part_ve"]);
	document.getElementById("pct_ve").innerHTML = Math.round(uservalues["part_ve"]);
	
	document.getElementById("nb_vt").innerHTML = Math.round(calcvalues["nb_vt"]/1e5)/10;
	document.getElementById("nb_ve").innerHTML = Math.round(calcvalues["nb_ve"]/1e5)/10;
	
	document.getElementById("bilan_km_ve").innerHTML = Math.round(calcvalues["bilan_km_ve"]);
	document.getElementById("bilan_km_vt").innerHTML = Math.round(calcvalues["bilan_km_vt"]);
	
	
	document.getElementById("val_nb_vehicules").innerHTML = uservalues["nb_vehicules"];
	document.getElementById("val_km_annuel").innerHTML = uservalues["km_annuel"];
	
	document.getElementById("diff_nb_vehicules").innerHTML = "(" + plussify(round((uservalues["nb_vehicules"]-initvalues["nb_vehicules"]), 1)) + ")";
	document.getElementById("diff_km_annuel").innerHTML = "(" + plussify(round(uservalues["km_annuel"]-initvalues["km_annuel"], 1)) + ")";
	document.getElementById("diff_nb_vt").innerHTML = "(" + plussify(round((calcvalues["nb_vt"]-initcalcvalues["nb_vt"])/1e6,1)) + ")";
	document.getElementById("diff_nb_ve").innerHTML = "(" + plussify(round((calcvalues["nb_ve"]-initcalcvalues["nb_ve"])/1e6, 1)) + ")";
	
	reduction = round((calcvalues["bilan_total"]/initcalcvalues["bilan_total"]-1)*100,0);
	division_scenario = round(1/(1+(reduction/100)), 1);
	//document.getElementById("division_scenario").innerHTML = division_scenario;
	
	
	myelement = document.getElementById("reduction_scenario");
	if (reduction > 0) {
		myelement.innerHTML = "+" + reduction + "&nbsp;%";
	} else if (reduction < 0) {
		myelement.innerHTML = reduction + "&nbsp;%"
	} else {
		myelement.innerHTML = "Même quantité";
	}
	
	calcsynth = synthese_scenario(initvalues, do_calc(initvalues), uservalues, calcvalues);

	draw();
	
	if (is_shown_result) {
		tweettext = "Mon scénario pour#global_change les émissions de GES du parc auto français:\n";
		tweettext += "-#nbveh nombre de véhicules🚙\n";
		tweettext += "-#nbkm kms parcourus au total️🛣\n";
		tweettext += "-️Électrification de #elec_pct% des V. thermiques actuels⚡\n";
		tweettext += "- Évolut° GES/km des VT (#eff_vt) et VE (#eff_ve)";

		myval = reduction; //round(calcvalues["bilan_total"], 0);
		if (myval>0) {
			tweettext = tweettext.replace("#global_change", "↗️de " + myval + "%"); 
		} else if (myval<0) {
			tweettext = tweettext.replace("#global_change", "↘️de " + (-myval) + "%");
		} else if (myval==0) {
			tweettext = tweettext.replace("#global_change", " ne pas changer");
		}
		
		myval = round(calcsynth["sobriete_equipement"],0); //round(calcvalues["bilan_total"], 0);
		mykey = "#nbveh";
		if (myval>0) {
			tweettext = tweettext.replace(mykey, "↗️de " + myval + "% du"); 
		} else if (myval<0) {
			tweettext = tweettext.replace(mykey, "↘️de " + (-myval) + "% du");
		} else if (myval==0) {
			tweettext = tweettext.replace(mykey, " Même");
		}
		
		myval = round(calcsynth["sobriete_km"],0); //round(calcvalues["bilan_total"], 0);
		mykey = "#nbkm";
		if (myval>0) {
			tweettext = tweettext.replace(mykey, "↗️de " + myval + "% des"); 
		} else if (myval<0) {
			tweettext = tweettext.replace(mykey, "↘️de " + (-myval) + "% des");
		} else if (myval==0) {
			tweettext = tweettext.replace(mykey, " Même nombre de");
		}
		
		myval = round(calcsynth["electrification"],0); //round(calcvalues["bilan_total"], 0);
		mykey = "#elec_pct";
		tweettext = tweettext.replace(mykey, myval); 
		
		myval = round(calcsynth["efficacite_ve"],0); //round(calcvalues["bilan_total"], 0);
		mykey = "#eff_ve";
		if (myval==0) {
			tweettext = tweettext.replace(mykey, "inchangé"); 
		} else {
			tweettext = tweettext.replace(mykey, myval + "%"); 
		}
		
		myval = round(calcsynth["efficacite_vt"],0); //round(calcvalues["bilan_total"], 0);
		mykey = "#eff_vt";
		if (myval==0) {
			tweettext = tweettext.replace(mykey, "inchangé"); 
		} else {
			tweettext = tweettext.replace(mykey, myval + "%"); 
		}

		
		//https://github.com/chrisachard/patio11bot/blob/dynamic-tweet-button/index.html
		document.getElementById("tweet-button").innerHTML = ' <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-text="' + tweettext + '" data-url="http://apps.dynartio.com/scenario-voiture-elec/" data-lang="fr" data-show-count="false" id="tweetlink">Tweet</a>';
		//document.getElementById("tweetlink").setAttribute("data-text", tweettext);
		twttr.widgets.load();
	}
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

 