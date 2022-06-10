# MoTaGame
一个测试性质的react+electron魔塔游戏，或者说半个react魔塔游戏引擎。
one game and half game engine use by react + electron(maybe this grammar?).

操作说明：
↑↓←→控制勇者行动，enter确认，鼠标点击对大部分按钮生效。
Q打开菜单，里面有‘保存’、‘读取’。
开始界面————>创建地图，会在项目根目录下的public/data/createMap中生成对应名称的json数据文件（请注意，如有重复名称的文件，则否进行覆盖）。
如需使用对应的地图，则将json中对应的数据拷贝到上一级public/data/map.json中对应楼层的位置，记得保证楼层不要重复、不要跳层，因为还未测试相关功能。

项目使用前置说明：

1，本项目在window10、node12.8.3环境下开发生成，请程序员在编写前确保前置环境是否已完备。

2，因为上传GitHub的是项目的程序及数据文件，clone到本地后，如要在开发环境下运行，请确保npm i了所有node_modules依赖。

3，本项目以react框架为核心，开发了仅用前端实现的魔塔游戏或者半个魔塔引擎，而前端本身是不允许随意访问、修改用户本地文件的。
针对这个问题，本项目使用了electron作为基底，代为实现魔塔游戏的‘保存’、‘读取’功能，同时将网页嵌入形成桌面应用一样的存在，可谓是客户端。
所以，在开发环境下，如果仅仅npm run webpackStart项目的话，启动的是react基底的项目主体，这个状态下去使用菜单中的‘保存’、‘读取’功能，我记得是会崩溃来着。

下面是我常规启动项目调试的流程：
vscode————>项目————>打开两个集成终端————>第一个集成终端npm run webpackStart项目————>等待项目启动完成后，在第二个集成终端中npm run electron————>这样就打开了调试状态下的项目桌面应用，因为设置了快捷键，可以f12打开网页调试工具。在未崩溃的情况下，f5可以刷新页面。

我本机有保存一个打包好的本项目，打个压缩包后差不多就可以当做是一个已完成的简陋单机魔塔游戏了。
-_-如果之后有需要的话，再行开个仓库上传吧，老实说体积不算小，估计删去不需要的多余文件，大小总共也有200M呢。


以下是百度翻译：
Operating instructions:
↑↓←→ control the action of the brave, enter to confirm, and click the mouse to take effect on most buttons.
Q open the menu with 'Save' and 'read'.
Start interface - > to create a map, a JSON data file with the corresponding name will be generated in public/data/createmap under the root directory of the project (please note that if there are files with duplicate names, they will not be overwritten).
To use the corresponding map, copy the corresponding data in JSON to the upper level public/data/map The location of the corresponding floor in JSON. Remember to ensure that the floor does not repeat or jump, because the relevant functions have not been tested.
Pre instructions for project use:
1. This project is developed and generated under the environment of windows10 and node12.8.3. Programmers are required to ensure that the front-end environment is complete before writing.
2. Because the program and data files of the project are uploaded to GitHub, if you want to run in the development environment after the clone is local, please ensure that NPM I all nodes_ Modules dependency.
3. With react framework as the core, this project has developed a magic tower game or half a magic tower engine that is only implemented by the front end. The front end itself is not allowed to access or modify users' local files at will.
To solve this problem, this project uses electron as the base to realize the 'Save' and 'read' functions of magic tower games, and embed the web pages to form the same existence as desktop applications, which can be described as a client.
Therefore, in the development environment, if only the NPM run webpackstart project is started, the project body of the react base is started. In this state, the "save" and "read" functions in the menu will crash, I remember.
The following is the process of my regular startup project debugging:
Vscode -- > Project -- > open two integration terminals -- > NPM run webpackstart project of the first integration terminal -- > after the project is started, NPM run electron -- > in the second integration terminal opens the project desktop application in the debugging state. Because the shortcut key is set, you can press F12 to open the web page debugging tool. F5 can refresh the page without crashing.
I have saved a packed project on this computer. After playing a compressed package, it can almost be regarded as a completed simple stand-alone magic tower game.
-_- If you need it later, open a warehouse to upload it. To be honest, the volume is not small. It is estimated that deleting unnecessary redundant files will have a total size of 200m.
