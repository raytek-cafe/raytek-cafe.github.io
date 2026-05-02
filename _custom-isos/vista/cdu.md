---
title: CDU's 2025-09 Windows Vista Updated ISO
layout: custom-iso
verdict: terrible
---
**Verdict:**&nbsp; <i class="fa fa-bug"></i> Terrible!

Well, what do I say... This ISO is terrible. From broken codecs to broken TrustedInstaller, the only use for this ISO is to take stuff from it for your own ISO.

**Pros:**
- Uses a Windows 7 PE with Windows Vista's setup so you can install it on real hardware without slipstreaming USB 3 drivers.
- Has the Winload/CI patch pre-integrated so all the driver patches will work without enabling Test Mode.
- Has the Drift patch pre-included (NTOSKRNL patch).
- Has NTOSKRNL progwrp included.
- Integrates Windows 10 build 1607 and Micron NVME drivers by default.
- Integrates some manufacturers' Ethernet drivers by default.
- Has ACPI Wake Alarm driver pre-included.
- Has .NET Framework 4.6.2, Visual C++ up to 2022, DirectX and XNA pre-included.
- Has the latest updates (2025-09) for all the components (Powershell 3, Internet Explorer 9, .NET etc.).

**Cons:**
- Internet Explorer 9 is pre-included by default with no option to revert back to Internet Explorer 7.
- Some Ultimate Extras addons are pre-installed by default with no option to uninstall them (check the issues section for more info about this).
- Modifies system components for "cosmetics" (pre-includes some Vize icons and [Vaporvance's fixed folder icons](https://www.deviantart.com/vaporvance/art/Vista-folder-icons-16px-fix-966771384)), which doesn't make this a vanilla up to date ISO.
- Includes unofficial patches by default which reinforces the point above.
- Has Hyper-V on by default which will cause problems with other hypervisor software.

**Issues I discovered while using this ISO:**
- TrustedInstaller is just broken on this ISO. Everything that relies on it will crash.
- SFC is broken due to TrustedInstaller being broken.
<img src="https://github.com/user-attachments/assets/9635424a-c19a-4ea9-8824-d7974e2c998e" />
- `slgmr /rearm` will throw "Error: 0XC004D307: The maximum allowed number of re-arms has been exceeded."
- `sysprep.exe generalize` will not work due to the same issue as above.
- **"Turn Windows features on or off" is broken**, so any features turned on by default cannot be turned off (e.g. Hyper-V cannot be turned off)
- Windows Dreamscene is pre-installed, but all the extra wallpapers were removed. Why even include it in the first place if you were just going to remove most of it?
- Windows Media Player 11 cannot play anything by default. WMA/WMV will refuse to play.
- The pre-included Ultimate Extras cannot be uninstalled, as they won't show in "View installed updates"
  
<img src="https://github.com/user-attachments/assets/15ee4987-d575-40bc-ab06-5ac74d575842" />

<img src="https://github.com/user-attachments/assets/8a0ef915-4fb9-4d3a-9a75-ae06c96bf709" />
