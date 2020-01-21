安我基因采样流程与绑定采样器
1. git clone http://gitlab.dnatime.com/front-end/h5-sample.git

2. cd h5-sample  

3. 安装依赖 npm install  

4. 启动 npm start  
访问入口 http://ip:8081/andall-sample/

5. 打包  
开发 npm run dev  
测试 npm run test  
生产 npm run build 



6.  node 版本v8.0以上  

7.  相关文档  
ajax库 axios  https://www.kancloud.cn/yunye/axios/234845  

注意:开发时npm start启动默认为dev环境，需要请求test、pro接口请手动个性utils/config  
文件中的env参数，打包为自动更改api host无修手动修改



webpakc打包优化
主要改了四个地方：
1. devtool  分生产和开发环境，生产的包就去掉所有帮助信息，减少大小
2. ParallelUglifyPlugin 生产包时进行压缩和混淆，为了提高打包速度，特别用了多线程
3. webpack.DefinePlugin  引入各种库的生产版本
4. splitChunks 分开打包，得于并行下载和公共库的缓存

这样下来生产包主js由原来的5.7m, 变成了 9百多k, 效果很明显
由于我们的h5要兼容低版的浏览器，所以 babel-polyfill 没有动，不然，还可以再小三分之一
当然，还有减少的空间，比较再改一下 devtool 的模式