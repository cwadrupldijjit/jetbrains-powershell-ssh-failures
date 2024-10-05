FROM debian

ENV NODEJS_VERSION=22.x
WORKDIR /root/project

COPY --chmod=700 init.sh /run/
COPY custom-shell /root/.custom-shell
# this will be moved into the project after the project is cloned
COPY .cert /run/
COPY --chmod=600 remote-dev-key.pub /root/.ssh/authorized_keys

RUN echo '-- install the groundwork needed to test the remote connection --' && \
    apt-get update && \
    apt-get upgrade -y && \
    # installing the openssh server so that we can connect via ssh
    apt-get install -y openssh-server curl vim git

RUN echo "-- install node for project's sake --" && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION} | bash - && \
    apt-get update && \
    apt-get install -y nodejs

RUN echo "-- installing pnpm --" && \
    curl -fsSL https://get.pnpm.io/install.sh | bash -

RUN echo '-- configure ssh server --' && \
    sed -iE 's/#?PermitRootLogin prohibit-password/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config && \
    service ssh start

RUN echo '-- add custom bashrc script --' && \
    echo 'source $HOME/.custom-shell/.bashrc' >> /root/.bashrc

RUN echo '-- configure ssh client and git --' && \
    git config --global safe.directory /var/www/html && \
    echo 'Host *' >> /root/.ssh/config && \
    echo "    StrictHostKeyChecking accept-new\n" >> /root/.ssh/config

CMD [ "/run/init.sh" ]
