Application permettant de décentraliser le minage en participant collectivement
à des offres d'achat groupées. 

Un utilisateur peut acheter un ticket à une valeur unique pour recevoir un NFT correspondant.
Ce ticket peut être lock sur une offre commerciale afin d'y valider sa participation.

Une fois qu'on a assez de ticket lock sur une offre commerciale, les tickets d'investissements sont burn
et chaque utilisateur ayant lock au moins un ticket sur cette offre recçois un nouvel NFT correspondant
à la part qu'il possède de ce parc de minage. Par exemple si il a lock 3 tickets d'investissement
et que l'offre était limitée à 100 tickets il possède un NFT correspondant à 3% du parc de minage de cette offre.

Afin de maintenir le floor price et rassurer les utilisateurs tout ticket d'investissement n'étant pas lock
et n'ayant jamais été utilisé (donc burn) peut être remboursé pour 95% de sa valeur initiale.


L'application se décompose en deux smart contract distinct:

MiningDAOInvestTickets.sol 

Permet de minter et d'utiliser les tickets d'investissements qui seront lock sur les offres commerciales


MiningDAOCommercialOffer.sol 

Un contrat par offre commerciale qui permet de lock les tickets d'investissements dessus. Il y a un nombre de ticket minimum 
à atteindre mais également un nombre maximum au dela duquel l'offre sera automatiquement validée et la possibilitée
de lock de nouveaux tickets dessus sera impossible.

Il y a bien sûr un délais maximum au dela duquel si le nombre minimum de ticket n'a pas été lock tous les utilisateurs verront
leur ticket d'instissement libéré et l'offre sera annulée.


Présentation: https://www.dropbox.com/t/QgyE0xQ8LzTrvmMl