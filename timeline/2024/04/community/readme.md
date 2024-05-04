
# git

## muti user develop

以github为例

创建仓库后会看到:

点击ssh, 因为https貌似被禁用了

![20240429123755](https://raw.githubusercontent.com/Nahida-aa/picgo/main/images/20240429123755.png)

### …or create a new repository on the command line

### …or push an existing repository from the command line

由于我们本地已有一个仓库，所以我们需要将远程仓库和本地仓库关联起来

```sh
# 关联远程仓库
# https: (貌似被禁用)
# git remote add origin https://github.com/Nahida-aa/team.git
# ssh: (推荐)
# git remote add origin git@github.com:Nahida-aa/team.git
git remote add github git@github.com:Nahida-aa/team.git
# if 之前写错了 可以用这个命令修改
git remote set-url github git@github.com:Nahida-aa/team.git
# 检测 proj_root/.git/config 文件
cat .git/config  

# 重命名 master 分支为 main (github 默认分支名)
git branch -M main

# create ssh key 用于认证
cd ~/.ssh
# 检查是否已存在 ssh key
ls -ltra
# 生成 ssh key
ssh-keygen -t rsa [-C "注释"] [-f ~/.ssh/id_rsa_github] [-b 4096]
ssh-keygen -t rsa -C "github" -f ~/.ssh/id_rsa_github -b 4096
# 默认分别是:   "", ~/.ssh/id_rsa, 2048
```
`-C` 选项用于添加一个注释到生成的 SSH 密钥中。这个注释可以是任何字符串，但通常我们会使用电子邮件地址

当你有多个 SSH 密钥时，你可以通过查看注释来快速识别每个密钥。这在管理多个 SSH 密钥，或者在多个设备或服务之间共享 SSH 密钥时非常有用。

如果你不添加 `-C "注释"`，`ssh-keygen` 仍然会生成一个 SSH 密钥，但这个密钥不会有注释。这意味着，如果你有多个 SSH 密钥，你可能会发现很难记住每个密钥是用于什么的。

![20240429125627](https://raw.githubusercontent.com/Nahida-aa/picgo/main/images/20240429125627.png)

默认生成的文件为~/.ssh/id_rsa 和 ~/.ssh/id_rsa.pub     

如果以前创建过，会覆盖，那么就需要自己提供其他的名字
![20240429130323](https://raw.githubusercontent.com/Nahida-aa/picgo/main/images/20240429130323.png)

```sh
# 检验是否生成成功
ls -ltra
# 查看公钥
vim ~/.ssh/id_rsa_github.pub
# 复制公钥
```

![20240429135414](https://raw.githubusercontent.com/Nahida-aa/picgo/main/images/20240429135414.png)

if刚刚指定了文件名，那么就要 >> ~/.ssh/config

```sh
# 将 #github ...追加到 ~/.ssh/config
echo "# github
Host github.com
  HostName github.com
  preferredauthentications publickey
  IdentityFile ~/.ssh/<filename>" >> ~/.ssh/config

# 检查最后5行
tail -5 ~/.ssh/config
```

```sh
# 将本地仓库推送到远程仓库
git push -u github main
```

#### windows(其他开发者)

```sh
cd /c/Users/aa/.ssh
ls -al
# ssh-keygen -t rsa [-C "注释"] [-f ~/.ssh/id_rsa_github] [-b 4096]
ssh-keygen -t rsa -C "win_github" -f ~/.ssh/id_rsa_github -b 4096
# 查看公钥
vim ~/.ssh/id_rsa_github.pub
# 去配置公钥(告诉我，我给你配到项目)

echo "# github
Host github.com
  HostName github.com
  preferredauthentications publickey
  IdentityFile ~/.ssh/id_rsa_github" >> ~/.ssh/config

cd /d/a_note/web/Django_l/projects
mkdir team
cd team
git init
git branch -M main

git remote add github git@github.com:Nahida-aa/team.git
git pull github main
# create branch waa 不切换
git branch waa
# 切换到 waa
git checkout waagit 
# 创建并切换到 dev 分支
git checkout -b dev
```

### 工作流

#### caa init:

```sh
# 切换到 dev 分支
git checkout dev
# 从远程仓库的dev拉取最新代码 到 本地dev 分支
git pull
# 自己的分支
git checkout caa
# 将 dev 分支合并到 caa 分支
git merge dev
# 现在本地的caa分支是dev分支的最新代码了
```

#### caa coded

```sh
# 写完了准备下班
# 这一步是保证自己在caa分支
git checkout caa
# 暂存更改(将更改add到暂存区)
git add ./
# 提交到本地仓库
git commit -m 'caa合并冲突test'
# 从远程仓库的同名分(caa)支拉取最新代码 到 本地caa 分支
# 保证自己的分支是最新的，就是自己可能通过其他方式提交了代码到caa分支
git pull 
# 将本地caa分支推送到远程caa分支
git push

# 切换到dev分支
git checkout dev
# 将caa分支合并到dev分支
git merge caa
# 确保本地dev分支是相对于远程dev最新的(可能有其他人提交了代码到远程dev分支)
git pull
# 将本地dev分支推送到远程dev分支
git push
```

#### waa init:

```sh
git checkout dev
git pull
git checkout waa
git merge dev
```

#### waa coded

```sh
git checkout waa
git add ./
git commit -m 'waa合并冲突test'
git pull
git push

git checkout dev
git merge waa
git pull
git push
```

# 04/25

```sh
activate py311_web 
django-admin startproject proj_base
# Bash
mv proj_base a_web
```

# 04/26 wsl2 centos

## vscode 插件位置
```sh
cd ~/.vscode-server/extensions
#windows
cd /mnt/c/Users/username/.vscode-server/extensions
```

## 安装 wsl

https://github.com/mishamosher/CentOS-WSL?tab=readme-ov-file

## wsl2 static ip

```sh
```

## wsl 占用内存过大

```sh
touch /mnt/c/Users/aa/.wslconfig
echo "# Settings apply across all Linux distros running on WSL 2
[wsl2]

# Limits VM memory to use no more than 2 GB, this can be set as whole numbers using GB or MB
memory=2GB 

# Sets the VM to use two virtual processors
processors=6

# Sets amount of swap storage space to 2GB, default is 25% of available RAM
swap=2GB

# Sets swapfile path location, default is %USERPROFILE%\AppData\Local\Temp\swap.vhdx
# swapfile=C:\\temp\\wsl-swap.vhdx" > /mnt/c/Users/aa/.wslconfig
```

```sh
# Settings apply across all Linux distros running on WSL 2
[wsl2]

# Limits VM memory to use no more than 2 GB, this can be set as whole numbers using GB or MB
memory=2GB 

# Sets the VM to use two virtual processors
processors=6

# Sets amount of swap storage space to 2GB, default is 25% of available RAM
swap=2GB

# Sets swapfile path location, default is %USERPROFILE%\AppData\Local\Temp\swap.vhdx
# swapfile=C:\\temp\\wsl-swap.vhdx
```

### restart wsl

```sh
wsl --shutdown
wsl
wsl -l -v
```

## 查看显卡

AMD Radeon(TM) Graphics

```sh
lspci | grep VGA
```

## conda

### Miniconda

https://docs.anaconda.com/free/miniconda/

```sh
#-p 选项会确保如果目录已经存在，mkdir 命令不会报错，同时也会创建任何需要的父目录
mkdir -p ~/miniconda3

wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh

bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
# zsh ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3

rm -rf ~/miniconda3/miniconda.sh
```

After installing, initialize your newly-installed Miniconda. The following commands initialize for bash and zsh shells:\
安装后，初始化新安装的 Miniconda。以下命令初始化 bash 和 zsh shell：

```sh
~/miniconda3/bin/conda init bash
~/miniconda3/bin/conda init zsh
```

这个命令会修改你的 ~/.bashrc 文件，以便在你打开新的 shell 时自动激活 Conda。

命令的输出告诉你，它修改了你的 ~/.bashrc 文件，并且你需要关闭并重新打开你的当前 shell 以使更改生效。

你可以通过退出并重新打开你的终端，或者使用 source ~/.bashrc 命令来立即应用这些更改。

```sh
source ~/.bashrc
source ~/.zshrc
```

这个命令会立即应用 ~/.bashrc 文件中的更改，所以你不需要关闭并重新打开你的终端

#### conda env

```sh
conda create --name py310_web python=3.10
conda activate py310_web
```

#### 换源配置

```sh
# CentOS
mkdir ~/.pip
echo "[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
[install]
trusted-host=pypi.tuna.tsinghua.edu.cn" > ~/.pip/pip.conf
```

```sh
# Windows
mkdir %HOMEPATH%\pip
echo "[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
[install]
trusted-host=pypi.tuna.tsinghua.edu.cn" > %HOMEPATH%\pip\pip.ini
```

#### pip install

```sh
pip install django==4.2.0

# WARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv
# 翻译: 以 'root' 用户身份运行 pip 可能会导致权限损坏和与系统包管理器冲突的行为。建议使用虚拟环境: https://pip.pypa.io/warnings/venv

sudo apt-get update
sudo apt-get install pkg-config libmysqlclient-dev
sudo apt-get install build-essential
pip freeze > requirements.txt
pip install -r requirements.txt
```

## docker

```sh
mkdir docker
mv Dockerfile docker/
mv docker-compose.yml docker/
mv .dockerignore docker/

docker build -t community_image -f docker/Dockerfile .
docker run -dit --network=my_network --ip=192.168.0.8 -p 8000:8000 -v /home/aa/projects/community:/app --name community_container community_image
docker exec -it community_container /bin/bash
```

```sh
docker pull delron/fastdfs
docker images

# 开启 tracker 和 storage
# 创建文件夹
sudo mkdir -p /var/fdfs/tracker
sudo mkdir -p /var/fdfs/storage
# 创建网络
docker network ls
docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 my_network
docker network inspect my_network
docker network rm my_network

docker stop tracker
docker rm tracker
docker run -dit --name tracker --network=my_network --ip=192.168.0.2 -v /var/fdfs/tracker:/var/fdfs -p 22122:22122 delron/fastdfs tracker

docker run -dti --name storage --network=my_network --ip=192.168.0.3 -e TRACKER_SERVER=192.168.0.2:22122 -v /var/fdfs/storage:/var/fdfs delron/fastdfs storage

docker ps -a
```

```sh
# fastdfs client expend
pip install py3Fdfs
pip install mutagen
mkdir -p ./a_web/proj_base/utils/fastdfs
touch ./a_web/proj_base/utils/fastdfs/client.conf
```

```sh
cd
docker build -t mysql_image -f Dockerfile.oracle .
# docker run -dit --name mysql -e MYSQL_ROOT_PASSWORD=root --network=my_network --ip=192.168.0.4 -p 3306:3306 -v /mnt/d/mysql_data:/var/lib/mysql mysql:8.0.37-debian /bin/bash
docker run -dit --name mysql -e MYSQL_ROOT_PASSWORD=root --network=my_network --ip=192.168.0.4 -p 3306:3306 -p 33060:33060 -v /var/lib/mysql:/var/lib/mysql  mysql_image
docker run -dit --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -p 33060:33060 -v /var/lib/mysql:/var/lib/mysql  mysql_image

docker exec -it mysql mysql -uroot -p

# or
docker exec -it mysql /bin/bash
# +
mysql -uroot -p

CREATE DATABASE web CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
```

```sh
docker network connect host mysql
docker network connect host tracker
docker network connect host storage
```

```sh
mv /mnt/c/Users/aa/Desktop/community/a_web/proj_base/static/images /home/aa//projects/community/a_web/proj_base/static/

mv /mnt/c/Users/aa/Desktop/community/a_web/proj_base/static/images /home/aa//projects/community/a_web/proj_base/static/
```
