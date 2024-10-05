# Update the list of packages
apt-get update

# Install pre-requisite packages.
apt-get install -y wget sudo

# Download the PowerShell package file
wget https://github.com/PowerShell/PowerShell/releases/download/v7.4.5/powershell_7.4.5-1.deb_amd64.deb

###################################
# Install the PowerShell package
dpkg -i powershell_7.4.5-1.deb_amd64.deb

# Resolve missing dependencies and finish the install (if necessary)
apt-get install -f

# Delete the downloaded package file
rm powershell_7.4.5-1.deb_amd64.deb

###################################
# Install PowerShell
apt-get install -y powershell

cp "$(dirname -- "${BASH_SOURCE[0]}")/profile.ps1" /root/.config/powershell
