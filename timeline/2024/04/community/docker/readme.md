# docker-web_dev

Docker 在 Web 开发中的作用：

- 环境一致性：Docker 可确保开发环境、测试环境和生产环境保持一致。这意味着可以避免出现“在我机器上可以运行，为什么在你机器上不能运行”的问题。

- 便捷的服务管理：如果你的 Web 应用包含多个服务（例如数据库、缓存服务器、后端 API 等），Docker Compose 可以帮助你方便地管理这些服务。你只需要在一个 YAML 文件中定义所有的服务，然后使用一个命令就可以启动或停止所有的服务。

- 快速部署：Docker 可以将你的 Web 应用和所有依赖打包成一个 Docker 镜像，然后你可以将这个镜像部署到任何支持 Docker 的平台上。这使得部署过程变得非常快速和简单。

- 隔离性：每个 Docker 容器都在其自己的环境中运行，互不干扰。这意味着你可以在同一台机器上运行使用不同版本的同一软件的应用，而不会有冲突。

- 可扩展性：Docker 支持容器的水平扩展和垂直扩展，这使得你可以根据需要轻松地增加或减少资源。

因此，使用 Docker 可以大大提高 Web 开发的效率，简化部署过程，确保环境的一致性，方便地管理多个服务，以及轻松地扩展应用

## Windows

Docker Desktop for Windows 现在使用 Windows Subsystem for Linux (WSL) 2 作为其底层技术。WSL 2 提供了一个完整的 Linux 内核环境，这使得 Docker 可以在 Windows 上以与在 Linux 上相同的方式运行。

在早期版本的 Docker Desktop for Windows 中，Docker 使用了名为 Hyper-V 的 Windows 虚拟化技术来运行 Docker 引擎。然而，这种方法有一些限制，例如性能问题和与其他虚拟化软件的兼容性问题。

因此，Docker 在最新版本的 Docker Desktop for Windows 中改为使用 WSL 2。这使得 Docker 在 Windows 上的运行性能得到了显著提升，同时也解决了一些兼容性问题。

所以，即使你没有直接使用 WSL，Docker Desktop for Windows 仍然需要它来运行 Docker 引擎。如果你的系统中没有安装 WSL，Docker Desktop 的安装程序会自动为你安装它。

## install

## use

### md_image

image可以自己生成、也可以从dockerHub下载、还可以加载uu打包好的image

从 Dockerfile 创建 Docker 镜像
https://github.com/docker-library/mysql/blob/a15b34a032f48089ee7b02d307d8f89a96b3bb76/8.4/Dockerfile.oracle

```sh
cd docker
docker build -t mysql8.4:1.0 -f Dockerfile.oracle .
#  -t or --tag , -f or --file
# --build-arg: 用于设置构建参数。例如，docker build --build-arg MYVAR=value .
# --no-cache: 用于禁用构建缓存。如果你使用这个参数，那么 Docker 在构建镜像时会重新执行所有的步骤，而不是使用缓存的结果
# --pull: 用于强制 Docker 在构建镜像前拉取基础镜像的最新版本
# .: 这是 docker build 命令的最后一个参数，它指定了 Dockerfile 所在的目录
docker images
```

从 Docker Hub 下载 Docker 镜像

```shell
docker pull
```

加载同事打包好的 Docker 镜像。你的同事可以使用 docker save 命令将 Docker 镜像保存为一个 tar 文件，然后你可以使用 docker load 命令从 tar 文件加载 Docker 镜像

```sh
# 你的uu可以使用 docker save 命令将 image保存为一个 .tar
docker save
# 使用 docker load 命令从 tar 文件加载 Docker 镜像
docker load
```

#### Dockerfile

定义如何从一个基础镜像创建一个新的 Docker image

```dockerfile
# 使用官方 Python 3.8 镜像作为基础镜像
FROM python:3.8-slim-buster

# 设置工作目录
WORKDIR /app

# 设置环境变量
# PYTHONDONTWRITEBYTECODE: 防止 Python 写 pyc 文件到磁盘
# PYTHONUNBUFFERED: 确保我们的 Python 输出直接在终端中显示，而不用先被缓存
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 安装依赖
RUN apt-get update \
  && apt-get install -y build-essential \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# 安装项目依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制项目代码到工作目录
COPY . .

# 指定容器启动时运行的命令
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]
```

#### docker-compose.yml

定义了如何运行一个或多个 Docker 容器。这个文件中可以定义容器的网络、存储、环境变量、依赖关系等等。你可以使用 docker-compose up 命令来根据 docker-compose.yml 文件启动你的应用。

### md_container(run_image)

```shell
docker run -d -p 3306:3306 -v /d/github/web_list/community/a_web/data/mysql:/var/lib/mysql --name mysql -e MYSQL_ROOT_PASSWORD=root mysql8.4:1.0

docker ps # 查看正在运行的容器
docker exec -it mysql bash # 进入容器
mysql -u root -p # 进入MySQL命令行
# 每个用户的用户名，主机和是否有GRANT权限
SELECT User, Host, Grant_priv FROM mysql.user;

CREATE DATABASE web
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
show databases;
```

## YAML

YAML（YAML Ain't Markup Language）是一种人类可读的数据序列化标准，常用于配置文件和在不同语言之间交换数据。

在 Docker 和 Kubernetes 等工具中，YAML 文件通常用于定义和配置应用或服务。例如，你可以在一个 YAML 文件中定义一个 Docker Compose 项目，包括项目中的所有服务、每个服务使用的镜像、服务之间的网络连接等。

以下是一个 Docker Compose 的 YAML 文件示例：

```yaml
version: '3'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
```

在这个示例中，定义了两个服务：一个是 web 服务，使用的是 nginx 的最新镜像，将容器的 80 端口映射到主机的 80 端口；另一个是 db 服务，使用的是 mysql 5.7 的镜像，并设置了环境变量 MYSQL_ROOT_PASSWORD。

总的来说，YAML 文件在 Docker 和其他 DevOps 工具中扮演了重要的角色，它使得配置和管理应用变得更加简单和直观。
