# Screeps

Screeps ss an open-source game for programmers, wherein the core mechanic is programming your units' AI.  You control your colony by writing JavaScript.  Screeps stands for Scripting Creeps.

### Official website
https://screeps.com/

### Official blog
https://blog.screeps.com/



## Tutorials

https://github.com/screeps/tutorial-scripts

https://steamcommunity.com/sharedfiles/filedetails/?id=712286113



## Documentation

### Game mechanics and system overviews
https://docs.screeps.com/

### API
https://docs.screeps.com/api/

### Emoji
https://emojipedia.org/



## Dev Tools

### Recommend Visual Studio: Code as an IDE
https://code.visualstudio.com/

### Screeps Intellisense package
https://github.com/Garethp/ScreepsAutocomplete

### Screeps code references file
https://gist.github.com/quonic/d7a7d385c85846027a7ca3dd03a0e985

### Screeps performance profiler
https://www.npmjs.com/package/screeps-profiler

### Screeps Notify
https://github.com/screepers/screeps_notify

### Screeps in Discord

You'll have to read between the lines and piece it together from these two links

https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/
https://github.com/danielheyman/screeps-discord



## Getting Started With Screeps

  * Launch the Screeps game
  * Play the tutorial to generate some default scripts you can learn from and copy!
  * Log into the main server, select your first room, and place your first spawner
  * Now, you can find your local scripts folder by clicking "Open local folder" in the bottom-left
    * For me on Windows10 this was: <My Drive>:\<My Windows Installation>\Users\<<My User>\AppData\Local\Screeps\scripts\screeps<span>.</span>com\default\
    * You'll notice that if you navigate up one level to the /screeps.com/ folder, that your tutorial scripts have been saved in other folders at this location
    * That's because you were running the tutorials in sandbox environments, and now the scripts that you place in your /default/ folder will run on the main server


## Integrating Git

  * After you've been playing for awhile, maybe you realize it would be nice to have some source control!
  * FSetup a new repository and create a directory called "default"
  * Find your local scripts folder by clicking "Open local folder" in the bottom-left
    * For me on Windows10 this was: <My Drive>:\<My Windows Installation>\Users\<<My User>\AppData\Local\Screeps\scripts\screeps<span>.</span>com\default\
  * Copy all your scripts to the "default" folder in your repository
  * Commit yoru code to source control
  * Close Screeps, your IDE, and any terminal windows you used for source control
  * From a new terminal window create a symlink between your repository's "default" folder and the Screeps local scripts folder's "default" folder:
    * on Windows run:
      * mklink /J "path/to/screeps/local/scripts/folder/default" "path/to/repository/default"
    * on Linux run:
      * ln -s "path/to/repository/default" "path/to/screeps/local/scripts/folder/default"
  * Now, your scripts in your repository will be linked into the folder Screeps expects


## Setup Visual Studio: Code for Screeps Development

  * Install Visual Studio: Code
    * In the Extensions menu (Ctrl + Shift + X):
      * Install "GitLens - Git Supercharged" by Eric Amodio
  * Launch the Screeps game and play the tutorial
    * Select your first room and place your spawner
    * Now, find your local scripts folder by clicking "Open local folder" in the bottom-left
      * For me on Windows10 this was: <My Drive>:\<My Windows Installation>\Users\<<My User>\AppData\Local\Screeps\scripts\screeps<span>.</span>com\default\
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


### Copyright

The git repository and/or scripts directory in which you find this file is a copyrighted Work under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License.

A copy of the license can be found in the copyright.license textfile, or online at https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode

In brief:
  * The Copyright License allows anyone, anywhere to share, copy, and redistribute the Work in any medium or format and to adapt, remix, transform, and build upon the Material infinitely and forever;
  * so long as they
    * distribute their modified Work under the same licenses as the original,
    * do not use the material for commercial purposes,
    * give appropriate credit to the original author and all other contributors,
    * indicate if and what changes were made,
    * provide a link to the Copyright License, and
    * do not apply additional legal restrictions or prevent others from following the Copyright License.
  * At anytime the Copyright Holder may cease distribution of the Work, add to or alter the current terms and conditions, or distribute the Material under a different set of terms and conditions.
    * However, doing so does not terminate the Public License outlined here.

You can learn more at: https://creativecommons.org/ and https://creativecommons.org/licenses/by-nc-sa/4.0/

Copyright © 2020 Ian Joseph Thompson
