import{u as e,o,c as t,w as c,a as s,b as a,_ as i}from"./app.71046403.js";const p=s("div",{class:"markdown-body"},[s("h1",{id:"macos-ventura-%E9%87%8D%E6%96%B0%E5%AE%89%E8%A3%85-wireshark",tabindex:"-1"},"macOS Ventura \u91CD\u65B0\u5B89\u88C5 Wireshark"),s("p",null,[s("a",{href:"https://gitlab.com/wireshark/wireshark/-/issues/18734",target:"_blank",rel:"noopener"},"https://gitlab.com/wireshark/wireshark/-/issues/18734")]),s("p",null,[s("a",{href:"https://gitlab.com/crapulas",target:"_blank",rel:"noopener"},"Sebastien Barbier")]),s("p",null,"I had the same issue as all of you reported."),s("p",null,"I found this in the legacy Wireshark Q&A and executed the different commands to clean up the OS from Wireshark. Then I reinstalled in the following order: Wireshark / Add Wireshark to path pkg / ChmodBPF pkg It works now correctly with Ventura 13.2 even after a reboot."),s("p",null,"Put the following text into a shell script and run that script:"),s("pre",null,[s("code",{class:"language-sh"},[s("div",{class:"shiki-container"},[s("pre",{class:"shiki shiki-dark",style:{"background-color":"#121212"}},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{color:"#758575DD"}},"#! /bin/sh")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"sudo rm -f \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"/usr/local/bin/capinfos \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"/usr/local/bin/dftest \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"/usr/local/bin/dumpcap \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"/usr/local/bin/editcap \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"/usr/local/bin/mergecap \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"/usr/local/bin/randpkt \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"/usr/local/bin/rawshark \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"/usr/local/bin/text2pcap \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"/usr/local/bin/tshark \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"/usr/local/bin/wireshark")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"sudo rm -f /etc/paths.d/Wireshark")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"sudo rm -f /etc/manpaths.d/Wireshark")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"sudo pkgutil --forget org.wireshark.cli.pkg")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"sudo rm -rf /Library/StartupItems/ChmodBPF")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"sudo rm -rf "),s("span",{style:{color:"#C98A7DAA"}},'"'),s("span",{style:{color:"#C98A7D"}},"/Library/Application Support/Wireshark"),s("span",{style:{color:"#C98A7DAA"}},'"')]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"sudo launchctl unload /Library/LaunchDaemons/org.wireshark.ChmodBPF.plist")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"sudo rm -f /Library/LaunchDaemons/org.wireshark.ChmodBPF.plist")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"sudo pkgutil --forget org.wireshark.ChmodBPF.pkg")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"sudo rm -rf /Applications/Wireshark.app")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#DBD7CAEE"}},"sudo pkgutil --forget org.wireshark.Wireshark.pkg")]),a(`
`),s("span",{class:"line"})])]),s("pre",{class:"shiki shiki-light",style:{"background-color":"#ffffff"}},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{color:"#A0ADA0"}},"#! /bin/sh")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"sudo rm -f \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"/usr/local/bin/capinfos \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"/usr/local/bin/dftest \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"/usr/local/bin/dumpcap \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"/usr/local/bin/editcap \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"/usr/local/bin/mergecap \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"/usr/local/bin/randpkt \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"/usr/local/bin/rawshark \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"/usr/local/bin/text2pcap \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"/usr/local/bin/tshark \\")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"/usr/local/bin/wireshark")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"sudo rm -f /etc/paths.d/Wireshark")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"sudo rm -f /etc/manpaths.d/Wireshark")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"sudo pkgutil --forget org.wireshark.cli.pkg")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"sudo rm -rf /Library/StartupItems/ChmodBPF")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"sudo rm -rf "),s("span",{style:{color:"#B56959AA"}},'"'),s("span",{style:{color:"#B56959"}},"/Library/Application Support/Wireshark"),s("span",{style:{color:"#B56959AA"}},'"')]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"sudo launchctl unload /Library/LaunchDaemons/org.wireshark.ChmodBPF.plist")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"sudo rm -f /Library/LaunchDaemons/org.wireshark.ChmodBPF.plist")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"sudo pkgutil --forget org.wireshark.ChmodBPF.pkg")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"sudo rm -rf /Applications/Wireshark.app")]),a(`
`),s("span",{class:"line"},[s("span",{style:{color:"#393A34"}},"sudo pkgutil --forget org.wireshark.Wireshark.pkg")]),a(`
`),s("span",{class:"line"})])])])])]),s("h2",{id:"%E7%BF%BB%E8%AF%91",tabindex:"-1"},"\u7FFB\u8BD1"),s("ol",null,[s("li",null,"\u8FD0\u884C\u4EE5\u4E0A\u811A\u672C"),s("li",null,"\u5B89\u88C5 Wireshark.app"),s("li",null,[a("\u5C06 Wireshark \u6DFB\u52A0\u5230 "),s("code",null,"PATH")]),s("li",null,"\u5B89\u88C5 ChmodBPF")])],-1),A="macOS Ventura \u91CD\u65B0\u5B89\u88C5 Wireshark\u3000",m="2023-02-04T00:00:00.000Z",D="network",g=["network","wireshark"],E=[{property:"og:title",content:"macOS Ventura \u91CD\u65B0\u5B89\u88C5 Wireshark\u3000"}],f={__name:"wireshark-install",setup(u,{expose:n}){const l={title:"macOS Ventura \u91CD\u65B0\u5B89\u88C5 Wireshark\u3000",date:"2023-02-04T00:00:00.000Z",category:"network",tags:["network","wireshark"],meta:[{property:"og:title",content:"macOS Ventura \u91CD\u65B0\u5B89\u88C5 Wireshark\u3000"}]};return n({frontmatter:l}),e({title:"macOS Ventura \u91CD\u65B0\u5B89\u88C5 Wireshark\u3000",meta:[{property:"og:title",content:"macOS Ventura \u91CD\u65B0\u5B89\u88C5 Wireshark\u3000"}]}),(d,k)=>{const r=i;return o(),t(r,{frontmatter:l},{default:c(()=>[p]),_:1})}}};export{D as category,m as date,f as default,E as meta,g as tags,A as title};
