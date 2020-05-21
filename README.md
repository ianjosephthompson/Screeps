Screeps

Screeps ss an open-source game for programmers, wherein the core mechanic is programming your units' AI.  You control your colony by writing JavaScript.  Screeps stands for Scripting Creeps.

Official website
https://screeps.com/

Official blog
https://blog.screeps.com/



Tutorials

https://github.com/screeps/tutorial-scripts

https://steamcommunity.com/sharedfiles/filedetails/?id=712286113



Documentation

Game mechanics and system overviews
https://docs.screeps.com/

API
https://docs.screeps.com/api/

Emoji
https://emojipedia.org/



Dev Tools

Recommend Visual Studio: Code as an IDE
https://code.visualstudio.com/

Screeps Intellisense package
https://github.com/Garethp/ScreepsAutocomplete

Screeps code references file
https://gist.github.com/quonic/d7a7d385c85846027a7ca3dd03a0e985

Screeps performance profiler
https://www.npmjs.com/package/screeps-profiler



Getting Started With Screeps

  * Launch the Screeps game
  * Play the tutorial to generate some default scripts you can learn from and copy!
  * Log into the main server, select your first room, and place your first spawner
  * Now, you can find your local scripts folder by clicking "Open local folder" in the bottom-left
    * For me on Windows10 this was: <My Drive>:\<My Windows Installation>\Users\<<My User>\AppData\Local\Screeps\scripts\screeps.com\default\
    * You'll notice that if you navigate up one level to the /screeps.com/ folder, that your tutorial scripts have been saved in other folders at this location
    * That's because you were running the tutorials in sandbox environments, and now the scripts that you place in your /default/ folder will run on the main server


Integrating Git

  * After you've been playing for awhile, maybe you realize it would be nice to have some source control!
  * From GitHub (or elsewhere) setup a new repository
  * From a terminal:
    * cd /to/your/screeps.com/ folder
      * For me on Windows10 this was: <My Drive>:\<My Windows Installation>\Users\<<My User>\AppData\Local\Screeps\scripts\screeps.com\
    * Clone your new repository here and name it something descriptive like "screeps-git"
  * Now copy all your scripts from the /default/ folder into your cloned repository
  * Commit, push your changes, and verify they are on the git server
    * Now your code is safe!
  * So you can safely delete the /default/ folder
    * And clone a new copy of your repository, but named as /default/


Setup Visual Studio: Code for Screeps Development

  * Install Visual Studio: Code
    * In the Extensions menu (Ctrl + Shift + X):
      * Install "GitLens - Git Supercharged" by Eric Amodio
  * Launch the Screeps game and play the tutorial
    * Select your first room and place your spawner
    * Now, find your local scripts folder by clicking "Open local folder" in the bottom-left
      * For me on Windows10 this was: <My Drive>:\<My Windows Installation>\Users\<<My User>\AppData\Local\Screeps\scripts\screeps.com\default\
  * From a terminal window:
      * cd /to/that/local/folder
      * git clone the Screeps Intellisense package as /ScreepsAutocomplete/ into that folder
  * Download the Screeps code references file
      * Place it inside the /ScreepsAutocomplete/ folder
  * Create a new file in the /ScreepsAutocomplete/ folder named "jsconfig.json"
      * Add the following contents to the file:

      { "compilerOptions": { "target": "ES6" }, "exclude": [ "node_modules" ] }

  * From the teriminal window:
    * cd /to/that/local/folder
    * npm install @types/screeps;
    * npm install @types/lodash;
  * Close and reopen Visual Studio: Code
  * Create a ".gitignore" file to make sure you don't commit the /ScreepsAutocomplete/ or /node_modules/ folders
    * But node recommends that you DO commit the "package-lock.json" file
  * Commit your ".gitignore" file and the "package-lock.json" file
