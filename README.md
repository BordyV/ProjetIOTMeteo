# ProjetIOTMeteo


# DESCRIPTION

Creation d'une plateforme de partage de donnees meteorologiques tel que la temperature, l'humidité , la force du vent ....( ce qu'on aura de dispo).

# PLAN

## etape 1:
realisation de l'esp qui recoltera les donnees meteo. L'esp contiendra un capteur de température, un capteur d'humidité, un anémomètre.

## etape 2:
realisation d'une api qui recupere les donnees et les stock en base.
Realisation d'une interface permettant de visualiser les donnees meteo.

## etape 3:
Interface ou l'on peut voir les donnees issus dautres reseaux.
Creation d'alerte en fonction de la zone geographique et de la meteo.

## etape 4:
Mise en place d'un systeme de qualité afin de verifier et lisser les donnees.

# Planning

12/04 Réalisation de/des l'esp en fonction des pieces deja en notre possession <br>
      Commande des autres pièces: anémomètre, capteurs de pression/altitude etc <br>
13/04 Debut du front/du back, création de l'API. <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Connexion des esp a l'API et reception des données <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Affichage des données sur le front <br>
XX/04 Reception du nouveau matériel, ajout des nouveaux capteurs <br>
+1/04 Ajout des nouvelles valeurs a l'API <br>
+3/04 Recherche d'une API pour les données hors de nos régions d'acquisition <br>
+4/04 Connexion de l'API a notre site <br>
+6/04 Rework du front en fonction de l'API choisit <br>
+8/04 Réflexion sur la qualité de nos valeurs et comment les améliorer <br>
+9/04 Amélioration des valeurs et de leur affichage


# ATTRIBUTION

Responsables des taches : 
- **Alaedine Karouia** Code / Architecture
- **Guilhem Fabre** Rapport / Commentaires de code
- **Mathieu Birger** User Interface / Description fonctionnelle
- **Yohann Laurendeau** Déploiement / "Mise en Galerie"
- **Valentin Bordy** Sécurité
