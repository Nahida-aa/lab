# 使用Ubuntu 22.04作为基础镜像
FROM ubuntu:22.04

# 更新系统并安装依赖
RUN apt-get update && apt-get install -y software-properties-common

# 添加deadsnakes PPA并安装Python 3.10
RUN add-apt-repository ppa:deadsnakes/ppa && apt-get update && apt-get install -y python3.10 python3-pip

# 更新python3和pip3为Python 3.10版本
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1
RUN update-alternatives --install /usr/bin/pip3 pip3 /usr/bin/pip3.10 1

# 安装额外的依赖
RUN apt-get install -y pkg-config libmysqlclient-dev build-essential

# 设置工作目录
WORKDIR /app

# 将当前目录的内容复制到容器的/app目录中
COPY . /app

# 安装requirements.txt中指定的Python包
RUN pip3 install -r requirements.txt

# 运行bash
CMD ["/bin/bash"]