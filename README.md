# Scénario de transition énergétique pour le parc automobile français (Version Beta)
Le parc automobile français émet chaque année plus de 70 millions de tonnes de CO2 chaque année. Pour réduire ces émissions, l'électrification de ces véhicules apparaît comme une solution intéressante, notamment lorsqu'ils sont alimentés par de l'électricité à faible émissions de CO2 comme en France. Néanmoins, la fabrication des voitures éléctriques génère des quantités importantes de CO2 (environ une dizaine de tonnes). 

Aussi, est-ce que l'électrification totale est une solution satisfaisante pour réduire les émissions de CO2 d'un facteur 2 d'ici 2030 et d'un facteur 4 d'ici 2050 ? Nous vous proposons de le déterminer par vous-même grâce à ce simulateur.

Le modèle ne calcule (pour l'instant) que les émissions de gaz à effet de serre. La transition du parc automobile thermique vers l'électrique ne saurait toutefois se résumer à ce seul paramètre, aussi important soit-il. Des questions liées à l'usage de ressources, aux enjeux économiques, aux capacités manufacturières et à la place de l'automobile dans nos sociétés devraient également être abordées pour arbitrer entre différents scénarios.

Le modèle utilisé est un modèle simplifié dont vous pouvez modifier chacun des paramètres. Il n'y a pas de variable cachée. Le programme est disponible en accès libre sous licence GNU GPL v3.

## Hypothèses du modèle
*Les émissions prises en comptes sont celles liées à la fabrication et l'utilisation du véhicule. D'autres postes,
comme ceux liés à la maintenance ou la fin de vie ne sont pas intégrés. Leurs contributions au bilan global sont considérées marginales.
*La informations collectées mentionnent la nécessité de remplacer une fois la batterie pendant la durée de vie d'une voiture électrique. Le bilan de fabrication des batteries est donc multiplié par deux.
*Les impacts liés à la fabrication d'un véhicule sont répartis sur l'ensemble de sa durée de vie.
*Les caractéristiques des véhicules thermiques correspondent aux moteurs à essence. Les émissions liées aux moteurs diesel étant similaires (que ce soit pour la fabrication du véhicule ou les émissions de CO2 au km), ils sont comptabilisés commes des moteurs à essence.

## Donées sources
Nous sourçons ci-dessous
les principaux paramètres utilisés. Si vous avez des sources divergentes avec les données utilisées, n'hésitez pas à nous le signaler, nous adapterons le modèle en conséquence.
*Emissions totale du secteur des transport - hors fabrication (69 Mt) : https://www.notre-environnement.gouv.fr/themes/climat/les-emissions-de-gaz-a-effet-de-serre-et-l-empreinte-carbone-ressources/article/les-emissions-de-gaz-a-effet-de-serre-du-secteur-des-transports
*Facteur d'émissions (2.75 kg eqCO2/L pour l'essence, 59.9 g eqCO2/kWh pour l'électricité) : Base Carbone ADEME https://bilans-ges.ademe.fr/documentation/UPLOAD_DOC_FR/index.htm
*Emissions liées à la fabrication des batteries (75 kg eqCO2/kWh) : https://www.transportenvironment.org/discover/ev-batteries-are-getting-cleaner-and-cleaner-2-3-times-better-2-years-ago/

# Nous contacter
Pour nous contacter à propos de cet outil (ou pour d'autres sujets) : voiture-elec@apps.dynartio.com