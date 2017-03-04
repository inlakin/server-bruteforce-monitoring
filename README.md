# Server (bruteforce) monitoring

The goals are :

- to be able to follow on a real time map the bruteforce attemps on a server (vps, dedicated, mutualized, self-hosted ...)

- to gather information about the attacker and run a vulnerabilities analysis if possible and draw reports regarding the attacker location, and most present vulnerabilities. 



While programming, I came with some additional/optional functionalities :

- follow not only one but multiple servers at a time

- restrict the markers shown on the map (or use a slider to select how much attacks we want to see) because otherwise it is too long to charge (how to optimized ?). indeed, on average, a third-part hosted server is subject to ~200 bruteforce attacks a day. 

- Use animated circle instead of markers to show real time attack 

- extend the functionalities of this "server monitoring" front end to be able to organize cron task for example, are other tasks. 

