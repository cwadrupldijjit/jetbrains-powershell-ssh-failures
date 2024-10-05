# JetBrains Remote Development:  Issue connecting via SSH when PowerShell exists

## The problem

The point of this project is to showcase JetBrains being unable to connect to a remote host that has powershell installed on it.  It holds a simple web app that simulates a real application (and a somewhat similar environment setup) that is being used in the development pipeline.

In my case, I have a PowerShell setup that I want to use in the remote Debian environment.  Prior to setting the PowerShell stuff up, it seems that my IDE connects fine and I can dev to my heart's content.  However, after I set up PowerShell how I want it (fairly basic setup, too), when I close the IDE and close down the remote IDE backend, I can never connect via the IDE (and the JetBrains Gateway) again.

In reviewing the logs, it appears to me that when the JetBrains Gateway attempts to connect via SSH to the machine, it connects successfully, but when it attempts to set up the environment for the JetBrains IDE of choice (even doing some things that might've already been set up previously), it fails.  The same point seems to be the culprit, too--when it's downloading PowerShell and attempts to set it up.

All of that will be included in the related ticket, but it's now important for you (if you are a JetBrains dev trying to recreate the conditions) to know how to set this project up so you can check it for yourself.

## Project Setup

This project has a few tools to try to make it easier for you to set it up and test locally.  Here is a list of prerequisites:

- **OpenSSH client** to generate the SSH keypair and then to connect to the "remote" environment
- **OpenSSL client** to generate an https cert and key <u>*or*</u> just use ones you already have for localhost dev
- **Docker** or software compatible with the docker compose spec
- A **JetBrains IDE** that works well for web-based projects, particularly with TypeScript that can connect to the "remote" environment

Once you have those prerequisites, you can follow the steps below to get it running.

1. Generate the SSH keys and SSL cert
   1. From the command line, enter the root of the project
   2. Generate the SSH keys using the `ssh-keygen` command, specifying the current directory as the location for the generated keys and the name of the key as `remote-dev-key`
      - In my case, I just ran `ssh-keygen -t ed25519 -C 'my-email@foo.com'` and provided the key name of `./remote-dev-key` when prompted
   3. If you are on a Linux or Mac system, run the following to ensure that the ssh client will use the new keys:
      ```
      chmod 600 remote-dev-keys*
      ```
   4. Change your directory to the `.cert` directory within this repository
   5. Either copy into this directory a valid, PEM-formatted certificate and key as separate files and named `cert.pem` and `key.pem`, so the server can recognize them
      - Alternatively, use OpenSSL to generate a quick self-signed cert and key (which is what I did to test this out; the fields prompted are irrelevant to how well this poc will work):
        ```
        openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes
        ```
2. Start the Docker containers
   1. From the root of this project, run `docker compose up -d` to start the containers
      - If necessary, change the ports configuration to have it work on your computer
   2. When the process completes, test that you can connect to it via SSH by running the following command:
      ```
      ssh -i ./remote-dev-key root@localhost -p 2222
      ```
3. Connect to the project using the JetBrains IDE of your choice (I used PHPStorm, launched via the JetBrains Gateway app):
   1. Open the Remote Development screen for your IDE and select "SSH"
   2. Hit the caret next to "New Project" and select "Connect to Host..." from the dropdown
   3. Enter `root` as the username, `localhost` as the host, `2222` as the port, and check the box for "Specify private key"
   4. In the box that appears, find the path to the private key you generated and insert it there (should look like `/absolute/path/to/project/remote-dev-key`)
   5. Click "Check Connection and Continue"
   6. Wait as the connection is made and the initial setup is done
   7. Edit or inspect the files, connect to the database via the integration, inspect a launched process, install plugins or themes, whatever you'd like
   8. Now time to close (and stop) the ide backend
4. Install PowerShell
   1. Connect to the "server" via SSH on the command line like you did before (or, honestly, since this is a Docker container, you can probably do the `docker exec` thing instead)
   2. Go to the `/root/` directory and invoke the `.custom-shell/install-pwsh.sh` script
