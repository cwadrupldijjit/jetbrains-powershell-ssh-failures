#!/usr/bin/bash

source $HOME/.bashrc

echo 'prepare "project"'
if [[ `ls` == '' ]]; then
    git clone https://github.com/cwadrupldijjit/jetbrains-powershell-ssh-failures.git .
else
    git pull
fi

if [ ! -f '.cert/cert.pem' ]; then
    rm -rf ./.cert > /dev/null 2>&1
    mv -f /run/.cert .
fi

echo 'ensure dependencies are up to date'
pnpm install

echo 'start the ssh service'
/usr/sbin/sshd
echo 'start the application'
pnpm start
