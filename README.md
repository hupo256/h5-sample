安我基因采样流程与绑定采样器
1. git clone http://gitlab.andall.com/front-end/h5-sample.git

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
