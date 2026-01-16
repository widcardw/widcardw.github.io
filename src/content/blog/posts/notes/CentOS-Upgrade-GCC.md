---
title: CentOS 7 更新 GCC
pubDate: 2026-01-16
updatedDate: 2026-01-16
tags:
  - Linux
  - GCC
  - CentOS
description: 由于依然有一些旧服务器还在用 CentOS 7，只能手动更新了
---

首先尝试

```bash
sudo yum install centos-release-scl
```

如果发现有代理问题，先查看

```bash
env | grep -i proxy
```

如果有配置代理的话（临时修改）

```bash
unset http_proxy
unset https_proxy
unset HTTP_PROXY
unset HTTPS_PROXY
# 然后再执行你的 yum 命令
sudo yum install centos-release-scl
```

以及检查全局代理配置

```bash
sudo grep -i proxy /etc/yum.conf
```

如果输出中包含 `proxy=http://xxxx:yyy` 这样的行，你需要注释掉或删除它

```bash
sudo vi /etc/yum.conf
```

修改后，再尝试 `sudo yum install centos-release-scl`

如果还遇到无法连接镜像源的问题，则进行下面修改

```bash
sudo vi /etc/yum.repos.d/CentOS-SCLo-scl.repo
```

```bash title="/etc/yum.repos.d/CentOS-SCLo-scl.repo"
[centos-sclo-sclo]
name=CentOS-7 - SCLo sclo
baseurl=https://mirrors.aliyun.com/centos/7/sclo/x86_64/sclo/
# mirrorlist=http://mirrorlist.centos.org?arch=$basearch&release=7&repo=sclo-sclo
gpgcheck=0
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-SCLo
```

```bash
sudo vi /etc/yum.repos.d/CentOS-SCLo-scl-rh.repo
```

```bash title="/etc/yum.repos.d/CentOS-SCLo-scl-rh.repo"
[centos-sclo-rh]
name=CentOS-7 - SCLo rh
baseurl=https://mirrors.aliyun.com/centos/7/sclo/x86_64/rh/
# mirrorlist=http://mirrorlist.centos.org?arch=$basearch&release=7&repo=sclo-rh
gpgcheck=0
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-SCLo
```

然后刷新缓存

```bash
yum repolist
yum clean all
yum makecache
```

如果遇到 docker 更新的问题（每个 install 都得加这个参数）

```bash ins="--disablerepo=docker-ce-stable"
sudo yum --disablerepo=docker-ce-stable install centos-release-scl
```

最后安装 GCC 版本

```bash ins="--disablerepo=docker-ce-stable"
sudo yum install devtoolset-11-gcc*
# 或者带上禁用 docker 更新
sudo yum --disablerepo=docker-ce-stable install devtoolset-11-gcc*
```

激活对应的 devtoolset，仅对本次会话有效

```bash
scl enable devtoolset-11 bash
```

```bash
gcc -v
```

想要切换版本时

```bash
source /opt/rh/devtoolset-11/enable
```

或者直接替换旧的 GCC

```bash
sudo mv /usr/bin/gcc /usr/bin/gcc-4.8.5
sudo ln -s /opt/rh/devtoolset-11/root/bin/gcc /usr/bin/gcc
sudo mv /usr/bin/g++ /usr/bin/g++-4.8.5
sudo ln -s /opt/rh/devtoolset-11/root/bin/g++ /usr/bin/g++
gcc --version
g++ --version
```

参考文献

- https://juejin.cn/post/7506436235511988235
- 通义千问
