# 一、安装与使用
### 1.全局安装：npm install -g coordination-cli
### 2.全局指令使用：coordination-cli \<yourProjectName\>。如果不传入自定义项目名，默认项目名称为coordination-cli
### 3.指令集说明（将根据项目实际开发需求，陆续扩展指令集）
#### 3.1）使用：coordination-cli \<yourProjectName\> [options]
#### 3.2）第一个参数如果不以 - 符开头，将认为是即将创建项目的项目名，否则将采用coordination-cli作为默认项目名。
#### 3.3）选项：
##### 3.3.1）-i，--install：创建完项目后将执行npm install为该项目安装node_modules包。
#### 3.4）如因网络原因，执行指令后项目长时间未创建，请直接下载源码zip包。
##
# 二、相关规范与配置项解读
### 1.全局变量
#### 1.1）项目中唯一的顶级全局对象是window.globalYonyouCoordinationCliTopLevelObj，严禁在window下再添加其他全局对象，所有需要暴露的全局对象全部添加到window.globalYonyouCoordinationCliTopLevelObj对象下。
#### 1.2）由于历史原因，保留window.WEB_DIWORK_GLOBAL_CONFIG全局对象，禁止对该对象做任何操作。
#### 1.3）为了防止乱用全局变量和全局变量相互冲突，在各文件使用任何全局变量前，必须在src/components/index文件中的globalYonyouCoordinationCliTopLevelObj对象上进行初始化注册，严禁在没有注册的情况下，在其他文件中直接定义并使用全局变量。
##
### 2.package.json中的环境变量
#### 2.1）小程序包环境变量以smallProgram开头，全局变量window.globalYonyouCoordinationCliTopLevelObj.isSmallProgram用来标识当前开发包是否是小程序输出包，依据此全局变量，可作出相应的条件判断，实现H5和小程序开发在业务逻辑和调用桥接时的区别化处理，同时实现H5和小程序共用一套代码。
##
### 3.关于yyzone的使用
#### 3.1）yyzone是用友协同部开发的一套web端ui库，如想使用该组件库，可在src/main.js文件中取消掉相关代码注释，即可开箱使用。
##
### 4.关于yy-mui的使用
#### 4.1）yy-mui是用友协同部开发的一套移动端ui库，如想使用该组件库，可在src/main.js文件中取消掉相关代码注释，即可开箱使用。
#### 4.2）移动端页面布局的自适应开发，一般都会涉及到px单位的转换问题，coordination-cli脚手架集成了px2vw转换插件，如需将源码中的px单位转成vw单位，可到webpack/base.js文件中取消掉相关代码注释（需要取消的注释代码已在文件中做了标识）。
##
### 5.html布局性结构
#### 5.1）src/components/index.vue文件用于html结构化布局，为了实现路由的扩展性，严禁对src/view/index.vue文件做任何改动。
##
### 6.css样式规范
#### 6.1）全局样式统一写在src/components/index.vue文件的:global {}中，必须做好css命名空间，特别是覆盖其他ui库组件的样式。
##
### 7.yonbip私有化部署前端解决方案
#### 7.1）src/config/configReplace.js是接口域名替换文件，在项目私有化部署的过程中，需在后台开发人员配合下，在执行npm run yonbip指令时，加入勾子函数，在打包结束后替换此文件。该解决方案的目的在于只维护一套代码就能实现公网与不同客户私有化服务器的代码部署。
#### 7.2）任何需要使用url或接口，必须统一写到src/config/configReplace.js文件文件中，通过import/require引入src/config/config.js进行使用，不得将url或接口硬编码写死写到各vue文件中。
##
### 8.脚手架风险提示
#### 8.1）此脚手架工具在本地环境测试通过后，会陆续应用在新项目中用以获得更加充分的测试，不断更新与丰富，希望能够与大家一同携手让它更加完善与易用。
##
### 9.其他
#### 9.1）代码书写规范、脚手架目录结构、项目开发规范，略。
#### 9.2）限于作者技术水平，难免有错误和考虑不周的地方，如发现相关错误和优化点，请给我提issue，我将尽快解决。