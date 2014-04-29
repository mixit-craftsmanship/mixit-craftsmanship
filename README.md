mixit-craftsmanship
===================

Ce repository contient l'application Mix-IT Now initiée pour la session Craftsmanship Workshop du Mix-IT 2014.
L'objectif de cette session est de s'exercer à quelques pratiques d'ingénierie logicielle : pair programming, TDD, bonnes pratiques de POO, user feedback, déploiement continu, workflow git...

C'est une application basée sur :
* Pour la partie serveur : Node.js, Express comme middleware MVC (HJS comme moteur de vue), mongodb pour stocker les données
  * Le module http est utilisé pour appeler l'API Mix-IT, encapsulé via dans une promesse Promise
  * underscore est utilisé pour traiter les données retournées par l'API Mix-IT
* Pour la partie client : Knockout.js, jQuery et RequireJS pour gérer le chargement des fichiers JS

Structuration de l'application
------------------------------
|- libs contient les modules Node.js côté serveurs
|- public/javascripts contient les modules RequireJS côté client
| |- libs contient les modules d'accès à l'API serveur
| '- viewModels contient les modules représentant les View Models utilisés par Knockout
|- public/templates contient les templates des vues
|- routes contient les controlleurs (MVC) utilisés par Express
|- views contient les vues (MVC) utilisées par Express
|- test contient les tests unitaires
  |- libs contient les tests unitaires côté serveur
  '- public contient les tests unitaires côté client

Tests unitaires
---------------
Les tests unitaires sont gérés :
* côté serveur via Mocha + should. Nock permet de mocker les appels HTTP à l'API Mix-IT.
* côté client via Karma + Mocha + chai (intégration should côté browser)

Environnement de dev nécessaire pour développer
-----------------------------------------------
Pour développer sur cette application, le seul pré-requis est Node.js.
Ensuite, les dépendances côté serveur sont récupérées via NPM (définie dans package.json, à installer avec "npm install"). Les dépendances côté client sont gérées via Bower (bower.json + "bower install", intérêt de doublonner avec NPM ?).

Pour ceux souhaitant utiliser un IDE, l'intégration IntelliJ est proposée. Il est nécessaire d'installer les plugins suivants : Node.js et Karma.

