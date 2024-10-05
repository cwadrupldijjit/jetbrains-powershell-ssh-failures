#!/usr/bin/bash

source $HOME/.bashrc

echo 'prepare "project"'
if [[ `ls` == '' ]]; then
    git clone https://github.com/cwadrupldijjit/jetbrains-powershell-ssh-failures.git .
    mv -f /run/.cert .
else
    git pull
fi

echo 'ensure dependencies are up to date'
pnpm install

echo 'start the ssh service'
/usr/sbin/sshd
echo 'start the application'
pnpm start
