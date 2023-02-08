---
title: macOS Ventura 重新安装 Wireshark　
date: 2023-02-04
category: 'network'
tags: ['network', 'wireshark']
---

# macOS Ventura 重新安装 Wireshark　

https://gitlab.com/wireshark/wireshark/-/issues/18734

[Sebastien Barbier](https://gitlab.com/crapulas)

I had the same issue as all of you reported.

I found this in the legacy Wireshark Q&A and executed the different commands to clean up the OS from Wireshark. Then I reinstalled in the following order: Wireshark / Add Wireshark to path pkg / ChmodBPF pkg It works now correctly with Ventura 13.2 even after a reboot.

Put the following text into a shell script and run that script:

```sh
#! /bin/sh
sudo rm -f \
/usr/local/bin/capinfos \
/usr/local/bin/dftest \
/usr/local/bin/dumpcap \
/usr/local/bin/editcap \
/usr/local/bin/mergecap \
/usr/local/bin/randpkt \
/usr/local/bin/rawshark \
/usr/local/bin/text2pcap \
/usr/local/bin/tshark \
/usr/local/bin/wireshark
sudo rm -f /etc/paths.d/Wireshark
sudo rm -f /etc/manpaths.d/Wireshark
sudo pkgutil --forget org.wireshark.cli.pkg
sudo rm -rf /Library/StartupItems/ChmodBPF
sudo rm -rf "/Library/Application Support/Wireshark"
sudo launchctl unload /Library/LaunchDaemons/org.wireshark.ChmodBPF.plist
sudo rm -f /Library/LaunchDaemons/org.wireshark.ChmodBPF.plist
sudo pkgutil --forget org.wireshark.ChmodBPF.pkg
sudo rm -rf /Applications/Wireshark.app
sudo pkgutil --forget org.wireshark.Wireshark.pkg
```

## 翻译

1. 运行以上脚本
2. 安装 Wireshark.app
3. 将 Wireshark 添加到 `PATH`
4. 安装 ChmodBPF
