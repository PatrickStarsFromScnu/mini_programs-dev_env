### 脚手架说明
通过gulp对项目进行了自动化构建，在src文件夹中进行开发，执行相应指令后会在根目录生成dist文件夹，dist文件夹里生成与src文件夹对应的文件。通过小程序开发工具打开dist文件夹预览效果

#### 主要配置
 - 对image、wxml、json文件进行压缩优化
 - 使用less替代wxss进行开发，编译压缩生成wxss
 - 使用typescript代替js进行开发，编译压缩为es5

#### 使用
运行：
```
gulp build
```
编译src，并更新dist

监听：
```
gulp watch
```
监听src中的wxml、ts、less等文件，文件被修改和保存时自动刷新（重新处理被修改的文件）实时预览效果。
