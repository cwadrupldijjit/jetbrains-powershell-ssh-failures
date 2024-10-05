#!/usr/bin/bash

echo 'prepare "project"'
if [[ `ls` == '' ]]; then
    git clone git@github.com:cwadrupldijjit/jetbrains-powershell-ssh-failures.git .
    pnpm install
fi

echo 'start the ssh service'
/usr/sbin/sshd
echo 'start the application'
pnpm start
