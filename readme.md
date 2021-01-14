using software to improve learning experiences

Try it out:

- clone this repository
- (optional) (for windows users install WSL 2)[https://docs.microsoft.com/en-us/windows/wsl/install-win10]
- (install docker)[https://docs.docker.com/get-docker/]
- greate a directory of hierarchical images at /web/topics, for example:

📦topics\
┣ 📂math\
┃ ┣ 📂calculus\
┃ ┃ ┗ 📂vector_calculus\
┃ ┃ ┃ ┣ 📂13.4\
┃ ┃ ┃ ┃ ┣ 📜10.png\
┃ ┃ ┃ ┃ ┣ 📜2.png\
┃ ┃ ┃ ┃ ┣ 📜4.png\
┃ ┃ ┃ ┃ ┣ 📜6.png\
┃ ┃ ┃ ┃ ┗ 📜8.png\
┃ ┃ ┃ ┗ 📂9.7\
┃ ┃ ┃ ┃ ┣ 📜10.png\
┃ ┃ ┃ ┃ ┣ 📜22.png\
┃ ┃ ┃ ┃ ┣ 📜24.png\
┃ ┃ ┃ ┃ ┗ 📜6.png\
┃ ┗ 📂diff eq\
┃ ┃ ┗ 📂first order\
┃ ┃ ┃ ┗ 📂intro\
┃ ┃ ┃ ┃ ┣ 📜1.png\
┗ 📂physics\
┃ ┣ 📂E&M\
┃ ┃ ┣ 📂capacitance\
┃ ┃ ┃ ┣ 📜1.png\
┃ ┃ ┃ ┣ 📜10.png\
┃ ┃ ┃ ┣ 📜11.png\
┃ ┃ ┃ ┣ 📜2.png\

- navigate to the root repository diectory (/LMS) and run `docker-compose build && docker-compose up`
- open your favorite browser (except safari or IE) and go to localhost

Feel free to use, distribute, modify or ignore this code. I'll take no responsibility if your computer blows up.

contributing: good luck!
